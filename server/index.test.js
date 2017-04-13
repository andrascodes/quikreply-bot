'use strict'

const test = require('tape')
const request = require('supertest')
const fetch = require('node-fetch')

const { testDatabaseUrl, nlpApiUrl, serverUrl, dbOptions, resyncDb } = require('../config')
const db = require('../db')(testDatabaseUrl)
const nlpApiService = require('../lib/services/NlpApiService')(fetch, nlpApiUrl)
const messageService = require('../lib/services/MessageService')(db, nlpApiService)
const authService = require('../lib/services/AuthService')(db)
const dashboardService = require('../lib/services/DashboardService')(db)
const conversationService = require('../lib/services/ConversationService')(db, nlpApiService)
const analytics = require('../lib/Analytics')(conversationService, messageService)
const createBotServer = require('./')

const botServer = createBotServer({ 
  services: {
    authService, 
    conversationService, 
    dashboardService, 
  },
  analytics, 
  fbConfig: {
    pageId: '123',
    accessToken: '123',
    verifyToken: '123',
    appSecret: '123',
  }, 
  serverUrl 
})

test(`GET /api/healthcheck`, assert => {

  request(botServer.app)
  .get('/api/healthcheck')
  .expect(200)
  .end((error, res) => {
    
    if(error) {
      assert.fail(error)
    }
    assert.deepEqual(res.body, { result: 'success' })
    assert.end()
  })
})

test(`/api/login`, async nest => {
  
  // 'admin:password'
  const basicAuthString = 'YWRtaW46cGFzc3dvcmQ='

  await db.sequelize.sync({force: true})

  nest.test(`POST /api/login - success`, async assert => {

    request(botServer.app)
    .post('/api/login')
    .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=')
    .expect(200)
    .expect(res => {
      if(typeof res.header.auth !== 'string') {
        throw new Error('Missing token.')
      }
    })
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.ok(
        Object.keys(res.body).every(key => {
          return ['createdAt', 'updatedAt', 'email', 'username']
          .includes(key)
        }), 'should return only the public user properties'
      )

      assert.equal(res.body.username, 'admin')  
      
      return assert.end()
    })
  })

  nest.test(`POST /api/login - invalid Auth header`, async assert => {

    request(botServer.app)
    .post('/api/login')
    .set('Authorization', 'Basic ')
    .expect(500)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      
      return assert.end()
    })
  })

  nest.test(`POST /api/login - password too short`, async assert => {

    request(botServer.app)
    .post('/api/login')
    .set('Authorization', 'Basic YWRtaW46cGFzcw==')
    .expect(500)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.deepEqual(res.body, { error: 'Validation error: Validation len failed' })
      
      return assert.end()
    })
  })
  
  nest.test(`POST /api/login - already exists`, async assert => {

    request(botServer.app)
    .post('/api/login')
    .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=')
    .expect(409)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.deepEqual(res.body, { error: 'Username already exists in the database.' })
      
      return assert.end()
    })
  })

  nest.test(`GET /api/login - success`, async assert => {
    
    request(botServer.app)
    .get('/api/login')
    .set('Authorization', `Basic ${basicAuthString}`)
    .expect(200)
    .expect(res => {
      if(typeof res.header.auth !== 'string') {
        throw new Error('Missing token.')
      }
    })
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.ok(
        Object.keys(res.body).every(key => {
          return ['createdAt', 'updatedAt', 'email', 'username']
          .includes(key)
        }), 'should return only the public user properties'
      )

      assert.equal(res.body.username, 'admin')      
      
      return assert.end()
    })
  })

  nest.test(`GET /api/login - invalid Auth header`, async assert => {
    
    request(botServer.app)
    .get('/api/login')
    .set('Authorization', `Basic `)
    .expect(401)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }    
      
      return assert.end()
    })
  })

  nest.test(`GET /api/login - invalid username or password`, async assert => {
    
    request(botServer.app)
    .get('/api/login')
    .set('Authorization', `Basic YWRtaW46cGFzc3dv`)
    .expect(401)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }    
      
      assert.deepEqual(res.body, { error: 'Username or password is incorrect.' })

      return assert.end()
    })
  })

  // nest.test(`closeDB`, async assert => {
  //   db.sequelize.close()
  //   assert.end()
  // })

})

test(`/api/logout`, nest => {
  
  nest.test(`GET /api/logout - success`, async assert => {
    
    await db.sequelize.sync({force: true})
    const { token } = await authService.signup('admin', 'password')

    request(botServer.app)
    .post('/api/logout')
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }    
      
      return assert.end()
    })
  })
  
  nest.test(`GET /api/logout - unauthorized`, async assert => {
    
    request(botServer.app)
    .post('/api/logout')
    .set('Authorization', `Bearer notexistingtoken`)
    .expect(401)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.deepEqual(res.body, { error: 'HTTP 401: Unauthorized' })
      
      return assert.end()
    })
  })

  // nest.test(`closeDB`, async assert => {
  //   db.sequelize.close()
  //   assert.end()
  // })
})

test(`/api/profile`, async nest => {
  
  // 'admin:password'
  const basicAuthString = 'YWRtaW46cGFzc3dvcmQ='
  await db.sequelize.sync({force: true})
  const { token } = await authService.signup('admin', 'password')

  nest.test(`PUT /api/profile - success`, async assert => {
    
    const expectedEmail = 'new@email.com'

    request(botServer.app)
    .put('/api/profile')
    .set('Authorization', `Bearer ${token}`)
    .set('Auth-Basic', `Basic ${basicAuthString}`)
    .send({ email: expectedEmail })
    .expect(200)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.ok(
        Object.keys(res.body).every(key => {
          return ['createdAt', 'updatedAt', 'email', 'username']
          .includes(key)
        }), 'should return only the public user properties'
      )

      assert.equal(res.body.email, expectedEmail)  
      
      return assert.end()
    })
  })

  nest.test(`PUT /api/profile - invalid Basic Auth`, async assert => {

    request(botServer.app)
    .put('/api/profile')
    .set('Authorization', `Bearer ${token}`)
    .set('Auth-Basic', `Basic invalid`)
    .send({ email: 'new@email.com'})
    .expect(500)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      
      return assert.end()
    })
  })

  nest.test(`PUT /api/profile - success: change only password`, async assert => {

    const basicAuthString = 'OnBhMzN3b3Jk'
    const expectedUsername = 'admin'
    request(botServer.app)
    .put('/api/profile')
    .set('Authorization', `Bearer ${token}`)
    .set('Auth-Basic', `Basic ${basicAuthString}`)
    .send({ email: 'new@email.com'})
    .expect(200)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.ok(
        Object.keys(res.body).every(key => {
          return ['createdAt', 'updatedAt', 'email', 'username']
          .includes(key)
        }), 'should return only the public user properties'
      )

      assert.equal(res.body.username, expectedUsername) 
      
      return assert.end()
    })
  })

  nest.test(`PUT /api/profile - unauthorized`, async assert => {

    request(botServer.app)
    .put('/api/profile')
    .expect(401)
    .end((error, res) => {    
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      return assert.end()
    })
  })

  // nest.test(`closeDB`, async assert => {
  //   db.sequelize.close()
  //   assert.end()
  // })
})

test(`/api/dashboard`, async nest => {
  
  await db.sequelize.sync({force: true})
  const { token } = await authService.signup('admin', 'password')

  nest.test(`GET /api/dashboard - success`, async assert => {

    request(botServer.app)
    .get('/api/dashboard')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      } 
      
      return assert.end()
    })
  })

  nest.test(`GET /api/dashboard - unauthorized`, async assert => {

    request(botServer.app)
    .get('/api/dashboard')
    .expect(401)
    .end((error, res) => {    
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      return assert.end()
    })
  })

  // nest.test(`closeDB`, async assert => {
  //   db.sequelize.close()
  //   assert.end()
  // })
})

test(`/api/conversations`, async nest => {
  
  await db.sequelize.sync({force: true})
  const { token } = await authService.signup('admin', 'password')
  await db.Conversation.create({ id: 1 })
  await db.Conversation.create({ id: 2 })

  nest.test(`GET /api/conversations - success`, async assert => {

    request(botServer.app)
    .get('/api/conversations')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.equal(res.body.data.length, 2)
      assert.ok(res.body.data.every(convo => {
        return [1,2].includes(convo.id)
      }))
      
      return assert.end()
    })
  })
  
  nest.test(`GET /api/conversations - unauthorized`, async assert => {

    request(botServer.app)
    .get('/api/conversations')
    .expect(401)
    .end((error, res) => {    
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      return assert.end()
    })
  })

  // nest.test(`closeDB`, async assert => {
  //   db.sequelize.close()
  //   assert.end()
  // })
})

test(`/api/conversations/text`, async nest => {
  
  const firstMessage = { text: 'First Message', conversationId: 1 }
  const secondMessage = { text: 'Second Message', conversationId: 1 }
  const helloMessage = { text: 'Hello', conversationId: 2 }
  const worldMessage = { text: 'World', conversationId: 2 }

  await db.sequelize.sync({force: true})
  const { token } = await authService.signup('admin', 'password')
  await db.Conversation.create({ id: 1 })
  await db.Message.create(firstMessage)
  await db.Message.create(secondMessage)
  await db.Conversation.create({ id: 2 })
  await db.Message.create(helloMessage)
  await db.Message.create(worldMessage)

  nest.test(`GET /api/conversations/text - success`, async assert => {

    request(botServer.app)
    .get('/api/conversations/text')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.equal(res.body.data.length, 2)
      assert.ok(res.body.data.every(convo => {
        return [1,2].includes(convo.id)
      }))

      const [numberConvo] = res.body.data.filter(convo => convo.id === firstMessage.conversationId)
      const [helloWorldConvo] = res.body.data.filter(convo => convo.id === helloMessage.conversationId)

      assert.ok(numberConvo.messages.includes(firstMessage.text, secondMessage.text))
      assert.ok(helloWorldConvo.messages.includes(helloMessage.text, worldMessage.text))
      
      return assert.end()
    })
  })
  
  nest.test(`GET /api/conversations/text - unauthorized`, async assert => {

    request(botServer.app)
    .get('/api/conversations/text')
    .expect(401)
    .end((error, res) => {    
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      return assert.end()
    })
  })

  nest.test(`PUT /api/conversations/text - empty body`, async assert => {

    request(botServer.app)
    .put('/api/conversations/text')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.deepEqual(res.body, { result: '0 conversations were updated' })
      
      return assert.end()
    })
  })

  nest.test(`PUT /api/conversations/text - success`, async assert => {

    const putData = {
      data: [
        { id: firstMessage.conversationId, clusterLabel: ['label1', 'label2'] },
        { id: helloMessage.conversationId, clusterLabel: ['label3'] }
      ]
    }

    request(botServer.app)
    .put('/api/conversations/text')
    .set('Authorization', `Bearer ${token}`)
    .send(putData)
    .expect(200)
    .end((error, res) => {
      
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.deepEqual(res.body, { result: `${putData.data.length} conversations were updated` })
      
      return assert.end()
    })
  })
  
  nest.test(`PUT /api/conversations/text - unauthorized`, async assert => {

    request(botServer.app)
    .put('/api/conversations/text')
    .expect(401)
    .end((error, res) => {    
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      return assert.end()
    })
  })

  nest.test(`GET /api/conversations/:id - success`, async assert => {

    const id = 1

    request(botServer.app)
    .get(`/api/conversations/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .end((error, res) => {    
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.ok(
        Object.keys(res.body.data).every(key => {
          return ['end', 'id', 'label', 'messages', 'participant', 'start']
          .includes(key)
        }), 'should return only the public user properties'
      )

      assert.ok(
        res.body.data.messages.every(msg => Object.keys(msg).every(key => {
          return ['direction', 'error', 'id', 'message', 'response', 'sentiment', 'text', 'timestamp', 'type']
          .includes(key)
        })), 'should return only the public user properties'
      )

      assert.equal(res.body.data.id, id, 'should return the correct conversation')  
      
      return assert.end()
    })

  })
  
  nest.test(`GET /api/conversations/:id - id doesn't exist`, async assert => {

    request(botServer.app)
    .get('/api/conversations/44')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .end((error, res) => {    
      if(error) {
        assert.fail(error)
        return assert.end()
      }

      assert.deepEqual(res.body, { data: null })
      
      return assert.end()
    })

  })

  nest.test(`GET /api/conversations/:id - unauthorized`, async assert => {
    request(botServer.app)
    .get('/api/conversations/1')
    .expect(401)
    .end((error, res) => {    
      if(error) {
        assert.fail(error)
        return assert.end()
      }
      
      return assert.end()
    })
  })

  nest.test(`closeDB`, async assert => {
    db.sequelize.close()
    assert.end()
  })
})