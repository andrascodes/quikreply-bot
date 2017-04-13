'use strict'

const test = require('tape')

const { testDatabaseUrl } = require('../../../config')
const db = require('../../../db')(testDatabaseUrl)

const createAuthService = require('./')

test(`AuthService`, nest => {

  const authService = createAuthService(db)

  nest.test(`AuthService: should return undefined if the passed db is undefined`, assert => {
    const authService = createAuthService(undefined)
    assert.equal(authService, undefined)
    assert.end()
  })

  nest.test(`AuthService: should create object if 'db' is passed`, assert => {
    assert.equal(typeof authService, 'object')
    assert.end()
  })

  nest.test(`AuthService: should have 'login' method`, assert => {
    assert.ok(Object.keys(authService).includes('login'))
    assert.ok(authService.login)
    assert.end()
  })
  
  nest.test(`AuthService: should have 'signup' method`, assert => {
    assert.ok(Object.keys(authService).includes('signup'))
    assert.ok(authService.signup)
    assert.end()
  })
  
  nest.test(`AuthService: should have 'authenticate' method`, assert => {
    assert.ok(Object.keys(authService).includes('authenticate'))
    assert.ok(authService.authenticate)
    assert.end()
  })

  nest.test(`AuthService: should have 'logout' method`, assert => {
    assert.ok(Object.keys(authService).includes('logout'))
    assert.ok(authService.logout)
    assert.end()
  })

  nest.test(`AuthService: should have 'updateUser' method`, assert => {
    assert.ok(Object.keys(authService).includes('updateUser'))
    assert.ok(authService.updateUser)
    assert.end()
  })

  nest.test(`AuthService#login`, async assert => {
    
    const auth = { username: 'admin', password: 'password' }
    try {
      await db.sequelize.sync({ force: true })
      await db.User.create(auth)
      const { user, token } = await authService.login(auth.username, auth.password)

      assert.equal(typeof user, 'object', 'should return a user object')
      assert.ok(
        Object.keys(user).every(key => {
          return ['createdAt', 'updatedAt', 'email', 'username']
          .includes(key)
        }), 'should return only the public user properties'
      )
      assert.equal(user.username, auth.username, 'should return the correct user')

      assert.equal(typeof token, 'string', 'should return a token string')
      const userByToken = await db.User.findByToken(token)
      assert.equal(userByToken.get('username'), auth.username, 'should return a token belonging to the user')

      assert.end()
    }
    catch(error) {
      assert.fail(error)
      db.sequelize.close()
      assert.end()
    }
  })

  nest.test(`AuthService#signup`, async assert => {
    
    const auth = { username: 'admin', password: 'password' }
    try {
      await db.sequelize.sync({ force: true })
      const { user, token } = await authService.signup(auth.username, auth.password)

      assert.equal(typeof user, 'object', 'should return a user object')
      assert.ok(
        Object.keys(user).every(key => {
          return ['createdAt', 'updatedAt', 'email', 'username']
          .includes(key)
        }), 'should return only the public user properties'
      )
      assert.equal(user.username, auth.username, 'should return the correct user')

      assert.equal(typeof token, 'string', 'should return a token string')
      const userByToken = await db.User.findByToken(token)
      assert.equal(userByToken.get('username'), auth.username, 'should return a token belonging to the user')

      assert.end()
    }
    catch(error) {
      assert.fail(error)
      db.sequelize.close()
      assert.end()
    }
  })

  nest.test(`AuthService#authenticate`, async assert => {
    
    const auth = { username: 'admin', password: 'password' }
    try {
      await db.sequelize.sync({ force: true })
      
      const { tokenFound, user } = await authService.authenticate('')
      assert.notOk(tokenFound, 'should return if token was found or not')
      assert.equal(user, undefined,
        'should return undefined user if tokenString is not valid'
      )
      
      const { token: savedToken, user: savedUser } = await authService.signup(auth.username, auth.password)
      const authResult = await authService.authenticate(savedToken)
      assert.equal(typeof authResult, 'object', 'should return an object')
      assert.equal(typeof authResult.tokenFound, 'boolean', 'should return an object with tokenFound property')

      assert.equal(typeof authResult.user, 'object', 'should return a user object')
      assert.ok(
        Object.keys(authResult.user).every(key => {
          return ['id', 'email', 'username']
          .includes(key)
        }), 'should return only the public user properties'
      )
      assert.equal(authResult.user.username, savedUser.username, 'should return the correct user')

      assert.end()
    }
    catch(error) {
      assert.fail(error)
      db.sequelize.close()
      assert.end()
    }
  })

  nest.test(`AuthService#logout`, async assert => {
    
    const auth = { username: 'admin', password: 'password' }
    try {
      await db.sequelize.sync({ force: true })
      
      const undefTokenResult = await authService.logout('')
      assert.deepEqual(undefTokenResult, { tokenFound: false, tokenDestroyed: false },
        'should return object with tokenFound and tokenDestoryed properties, both set to false'
      )

      const { token, user } = await authService.signup(auth.username, auth.password)
      const logoutResult = await authService.logout(token)
      
      assert.equal(typeof logoutResult, 'object', 'should return an object')
      assert.equal(typeof logoutResult.tokenFound, 'boolean', 'should return an object with tokenFound property')
      assert.ok(logoutResult.tokenFound, 'should set tokenFound to true')
      
      assert.equal(typeof logoutResult.tokenDestroyed, 'boolean', 'should return an object with tokenDestroyed property')
      assert.ok(logoutResult.tokenDestroyed, 'should set tokenFound to false')

      const savedToken = await db.Token.findOne({})
      assert.equal(savedToken, null, 'should destroy the only token in Database')
    
      assert.end()
    }
    catch(error) {
      assert.fail(error)
      db.sequelize.close()
      assert.end()
    }
  })

  nest.test(`AuthService#updateUser`, async assert => {
    
    const auth = { username: 'admin', password: 'password' }
    try {
      await db.sequelize.sync({ force: true })
      
      const noUser = await authService.updateUser(0, {})
      assert.deepEqual(noUser, undefined,
        'should return undefined if user is not found'
      )

      const newEmail = 'new@email.com'
      const { token } = await authService.signup(auth.username, auth.password)
      const { tokenFound, user } = await authService.authenticate(token)
      const updatedUser = await authService.updateUser(user.id, { email: newEmail })
      
      assert.equal(typeof updatedUser, 'object', 'should return an object')
      assert.ok(
        Object.keys(updatedUser).every(key => {
          return ['createdAt', 'updatedAt', 'email', 'username']
          .includes(key)
        }), 'should return only the public user properties'
      )

      const savedUser = await db.User.findOne({ where: { id: user.id }})
      assert.equal(savedUser.get('email'), newEmail, 'should update the user')
    
      db.sequelize.close()
      assert.end()
    }
    catch(error) {
      assert.fail(error)
      db.sequelize.close()
      assert.end()
    }
  })


})