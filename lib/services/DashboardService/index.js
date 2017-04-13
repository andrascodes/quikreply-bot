'use strict'

const moment = require('moment')
const _ = require('lodash')

const reduceEachToData = array => {
  if(array.length <= 0) {
    return 0;
  }
  const data = array.reduce(x => x).data
  
  if(typeof data === 'string') {
    return Number(data)
  }
  if(data === null) {
    return 0;
  }
  return data
}

const createGetTotalUsers = (dbInstance) => () => {
  return dbInstance
    .query( "SELECT COUNT(DISTINCT participant) AS data FROM conversations", { type: dbInstance.QueryTypes.SELECT} )
    .then(result => reduceEachToData(result))
}

const createGetActiveUsersToday = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT COUNT(DISTINCT participant) AS data FROM conversations WHERE DATE("startTimestamp") = ?`,
      { 
        replacements: [moment().utc().format('YYYY-MM-DD')], 
        type: dbInstance.QueryTypes.SELECT
      } 
    )
    .then(result => reduceEachToData(result))
}

const createGetActiveUsersYesterday = (dbInstance) => () => {
  return dbInstance
  .query( 
    `SELECT COUNT(DISTINCT participant) AS data FROM conversations WHERE DATE("startTimestamp") = ?`,
    { 
      replacements: [moment().utc().subtract(1, 'days').format('YYYY-MM-DD')], 
      type: dbInstance.QueryTypes.SELECT
    } 
  )
  .then(result => reduceEachToData(result))
}

const createGetActiveUsersLastMonth = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT COUNT(DISTINCT participant) AS data  FROM conversations WHERE "startTimestamp" BETWEEN :monthAgo AND :now`,
      { 
        replacements: {
          monthAgo: moment().utc().subtract(1, 'months').format('YYYY-MM-DD'),
          now: moment().utc().add(1, 'days').format('YYYY-MM-DD')
        }, 
        type: dbInstance.QueryTypes.SELECT
      } 
    )
    .then(result => reduceEachToData(result))
}

const createGetActiveUsersTwoMonthsAgo = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT COUNT(DISTINCT participant) AS data  FROM conversations WHERE "startTimestamp" BETWEEN :twoMonthsAgo AND :monthAgo`,
      { 
        replacements: {
          twoMonthsAgo: moment().utc().subtract(2, 'months').format('YYYY-MM-DD'),
          monthAgo: moment().utc().add(1, 'days').subtract(1, 'months').format('YYYY-MM-DD')
        }, 
        type: dbInstance.QueryTypes.SELECT
      } 
    )
    .then(result => reduceEachToData(result))
}

const createGetTotalMessages = (dbInstance) => () => {
  return dbInstance
    .query( "SELECT COUNT(*) AS data FROM messages", { type: dbInstance.QueryTypes.SELECT} )
    .then(result => reduceEachToData(result))
}

const createGetAvgNumberOfMessages = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT AVG(count) AS data FROM (SELECT COUNT(*) FROM messages GROUP BY "conversationId") AS "messageCounts"`, 
      { type: dbInstance.QueryTypes.SELECT} 
    )
    .then(result => reduceEachToData(result))
}

const createGetAvgLengthOfConversation = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT AVG("endTimestamp" - "startTimestamp") AS data FROM conversations`, 
      { type: dbInstance.QueryTypes.SELECT} 
    )
    .then(result => reduceEachToData(result))
}

const createGetNumberOfOutgoingMessages = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT COUNT(*) AS data FROM messages WHERE (direction = 'outgoing' OR direction IS null)`, 
      { type: dbInstance.QueryTypes.SELECT} 
    )
    .then(result => reduceEachToData(result))
}

const createGetNumberOfDeliveredAndReadMessages = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT COUNT(*) AS data FROM messages WHERE delivered = TRUE AND read = TRUE AND (direction = 'outgoing' OR direction IS null)`, 
      { type: dbInstance.QueryTypes.SELECT} 
    )
    .then(result => reduceEachToData(result))
}

const createGetNumberOfDeliveredMessages = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT COUNT(*) AS data FROM messages WHERE delivered = TRUE AND (read = FALSE OR read IS null) AND (direction = 'outgoing' OR direction IS null)`, 
      { type: dbInstance.QueryTypes.SELECT} 
    )
    .then(result => reduceEachToData(result))
}

const createGetNumberOfUndeliveredMessages = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT COUNT(*) AS data FROM messages WHERE (delivered = FALSE OR delivered IS null) AND (direction = 'outgoing' OR direction IS null)`, 
      { type: dbInstance.QueryTypes.SELECT} 
    )
    .then(result => reduceEachToData(result))
}

const createGetNumberOfErrors = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT COUNT(*) AS data FROM messages WHERE (error IS NOT null) AND (direction = 'outgoing' OR direction IS null)`, 
      { type: dbInstance.QueryTypes.SELECT} 
    )
    .then(result => reduceEachToData(result))
}

const completeWithMissingMonths = array => {

  if(array.length <= 0) {
    return [0,1,2,3,4,5,6,7,8,9,10,11]
      .map(val => moment().subtract(val, 'months'))
      .reverse()
      .map(date => ({
        month: date.format('MMMM'),
        count: 0
      }))
  }

  const activeUsersData = array
    .map(data => ({
      month: moment(data.month),
      count: Number(data.count)
    }))

  const countsForPastYear = [0,1,2,3,4,5,6,7,8,9,10,11]
    .map(val => moment().subtract(val, 'months'))
    .reverse()
    .map(date => ({
      month: date,
      count: 0
    }))
    .map(({ month: date }) => {
      const month = date.format('MMMM')
      let count = activeUsersData.find(data => moment(data.month).isSame(date, 'month'))
      if(!count) {
        return ({
          month,
          count: 0
        })
      }
      return ({
        month,
        count: count.count
      })
    })
  
    return _.dropWhile(countsForPastYear, (data) => data.count <= 0)
}

const createGetActiveUsersByMonth = (dbInstance) => () => {
  return dbInstance
    .query( 
      `SELECT count(participant), month FROM (
        SELECT DISTINCT participant, to_char(date_trunc('month', "startTimestamp"), 'YYYY-MM') AS month FROM conversations
      ) AS activeusers
      GROUP BY month
      ORDER BY month ASC`, 
      { type: dbInstance.QueryTypes.SELECT} 
    )
    .then(data => completeWithMissingMonths(data))
}

const createGetAll = (dbInstance) => async () => {
  const [
      totalUsers,
      activeUsersToday,
      activeUsersYesterday,
      activeUsersLastMonth,
      activeUsersTwoMonthsAgo,
      totalMessages,
      avgMessages,
      avgLength,
      outgoingMessages,
      deliveredAndReadMessages,
      deliveredNotReadMessages,
      notDeliveredMessages,
      messageErrors,
      activeUsersByMonth
    ] =  await Promise.all([
    createGetTotalUsers(dbInstance)(),
    createGetActiveUsersToday(dbInstance)(),
    createGetActiveUsersYesterday(dbInstance)(),
    createGetActiveUsersLastMonth(dbInstance)(),
    createGetActiveUsersTwoMonthsAgo(dbInstance)(),
    createGetTotalMessages(dbInstance)(),
    createGetAvgNumberOfMessages(dbInstance)(),
    createGetAvgLengthOfConversation(dbInstance)(),
    createGetNumberOfOutgoingMessages(dbInstance)(),
    createGetNumberOfDeliveredAndReadMessages(dbInstance)(),
    createGetNumberOfDeliveredMessages(dbInstance)(),
    createGetNumberOfUndeliveredMessages(dbInstance)(),
    createGetNumberOfErrors(dbInstance)(),
    createGetActiveUsersByMonth(dbInstance)(),
  ])

  return {
    users: {
      totalUsers,
      activeUsersToday,
      activeUsersYesterday,
      activeUsersLastMonth,
      activeUsersTwoMonthsAgo,
      activeUsersByMonth,
    },
    messages: {
      totalMessages,
      avgMessages,
      avgLength: moment(avgLength).format('mm:ss'),
      outgoingMessages,
      deliveredAndReadMessages: (deliveredNotReadMessages === 0 && notDeliveredMessages === 0) ? 1 : deliveredAndReadMessages,
      deliveredNotReadMessages,
      notDeliveredMessages,
      messageErrors
    }
  }
}

module.exports = (db) => {
  if(!db) {
    return undefined
  }

  return {
    getAll: createGetAll(db.sequelize),
  }
}