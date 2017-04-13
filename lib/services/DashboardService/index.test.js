'use strict'

const test = require('tape')

const { testDatabaseUrl } = require('../../../config')
const db = require('../../../db')(testDatabaseUrl)
const createDashboardService = require('./')

test(`DashboardService`, async assert => {
  const dashboardService = createDashboardService(db)

  await db.sequelize.sync({force: true})

  const todayConvoStart = new Date()
  const todayConvoEnd = new Date(todayConvoStart)
  todayConvoEnd.setMinutes(todayConvoStart.getMinutes() + 10)
  const yesterdayConvoStart = new Date(todayConvoStart)
  yesterdayConvoStart.setDate(yesterdayConvoStart.getDate() - 1)
  const twoMonthsAgoStart = new Date(todayConvoStart)
  twoMonthsAgoStart.setMonth(twoMonthsAgoStart.getMonth() - 2)
  const firstMsgLength = '10:00'
  const diffInMonths = 2

  const convo = {
    id: 3, 
    participant: '123', 
    startTimestamp: todayConvoStart, 
    endTimestamp: todayConvoEnd
  }

  const messages = {
    correct: { conversationId: 3, delivered: true, read: true },
    unread: { conversationId: 3, delivered: true, read: false },
    error: { conversationId: 3, delivered: false, read: false, error: "OAuthException" }
  }

  await db.Conversation.create({ id: 2, participant: '123', startTimestamp: yesterdayConvoStart })
  await db.Conversation.create(convo)
  await db.Conversation.create({ id: 1, participant: '234', startTimestamp: twoMonthsAgoStart })
  await db.Message.create(messages.correct)
  await db.Message.create(messages.unread)
  await db.Message.create(messages.error)

  const result = await dashboardService.getAll()
  assert.equal(typeof result, 'object', 'should return an object')
  assert.equal(typeof result.users, 'object', 'should have a users prop')
  assert.equal(typeof result.messages, 'object', 'should have a messages prop')

  assert.equal(result.messages.totalMessages, 3, 'should count the total no. of messages correctly')
  assert.equal(result.messages.avgLength, firstMsgLength, 'should count the avgLength of conversations correctly')
  assert.equal(result.messages.avgMessages, Object.keys(messages).length, 
    'should count the avg no. messages in a conversation correctly'
  )
  assert.equal(result.messages.outgoingMessages, Object.keys(messages).length, 'should count outgoing no. messages correctly')
  assert.equal(result.messages.deliveredAndReadMessages, 1, 'should count delivered and read messages correctly')
  assert.equal(result.messages.deliveredNotReadMessages, 1, 'should count unread messages correctly')
  assert.equal(result.messages.notDeliveredMessages, 1, 'should count undelivered messages correctly')
  assert.equal(result.messages.messageErrors, 1, 'should count messages with errors correctly')
  
  
  assert.equal(result.users.activeUsersByMonth.length, diffInMonths + 1,
    'should count months correctly'
  )
  assert.equal(result.users.totalUsers, 2, 'should count total users correctly')
  assert.equal(result.users.activeUsersLastMonth, 1, 'should count users during last month correctly')
  assert.equal(result.users.activeUsersTwoMonthsAgo, 1, 'should count users during last two months correctly')
  assert.equal(result.users.activeUsersToday, 1, 'should count users today correctly')
  assert.equal(result.users.activeUsersYesterday, 1, 'should count users yesterday correctly')

  db.sequelize.close()
  assert.end()
})