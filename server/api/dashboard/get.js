'use strict'

const moment = require('moment')
const { reduceEachToData, completeWithMissingMonths } = require('./lib')

const createGetConversationsHandler = db => async (req, res) => {
  const ConversationModel = db.Conversation
  const MessageModel = db.Message
  const sequelize = db.sequelize

  try {
    const getDateAMonthAgo = () => moment().utc().subtract(1, 'months').format('YYYY-MM-DD')

    const getDateTwoMonthsAgo = () => moment().utc().subtract(2, 'months').format('YYYY-MM-DD')

    const dashboardQueries = await Promise.all([
      // totalUsers
      sequelize.query( "SELECT COUNT(DISTINCT participant) AS data FROM conversations", { type: sequelize.QueryTypes.SELECT} ),
      // activeUsersToday
      sequelize.query( 
        `SELECT COUNT(DISTINCT participant) AS data FROM conversations WHERE DATE("startTimestamp") = ?`,
        { 
          replacements: [moment().utc().format('YYYY-MM-DD')], 
          type: sequelize.QueryTypes.SELECT
        } 
      ),
      // activeUsersYesterday
      sequelize.query( 
        `SELECT COUNT(DISTINCT participant) AS data FROM conversations WHERE DATE("startTimestamp") = ?`,
        { 
          replacements: [moment().utc().subtract(1, 'days').format('YYYY-MM-DD')], 
          type: sequelize.QueryTypes.SELECT
        } 
      ),
      // activeUsersLastMonth
      sequelize.query( 
        `SELECT COUNT(DISTINCT participant) AS data  FROM conversations WHERE "startTimestamp" BETWEEN :monthAgo AND :now`,
        { 
          replacements: {
            monthAgo: moment().utc().subtract(1, 'months').format('YYYY-MM-DD'),
            now: moment().utc().add(1, 'days').format('YYYY-MM-DD')
          }, 
          type: sequelize.QueryTypes.SELECT
        } 
      ),
      // activeUsersTwoMonthsAgo
      sequelize.query( 
        `SELECT COUNT(DISTINCT participant) AS data  FROM conversations WHERE "startTimestamp" BETWEEN :twoMonthsAgo AND :monthAgo`,
        { 
          replacements: {
            twoMonthsAgo: moment().utc().subtract(2, 'months').format('YYYY-MM-DD'),
            monthAgo: moment().utc().add(1, 'days').subtract(1, 'months').format('YYYY-MM-DD')
          }, 
          type: sequelize.QueryTypes.SELECT
        } 
      ),

      // totalMessages
      sequelize.query( "SELECT COUNT(*) AS data FROM messages", { type: sequelize.QueryTypes.SELECT} ),
      // avgMessages
      sequelize.query( 
        `SELECT AVG(count) AS data FROM (SELECT COUNT(*) FROM messages GROUP BY "conversationId") AS "messageCounts"`, 
        { type: sequelize.QueryTypes.SELECT} 
      ),
      // avgLength
      sequelize.query( 
        `SELECT AVG("endTimestamp" - "startTimestamp") AS data FROM conversations`, 
        { type: sequelize.QueryTypes.SELECT} 
      ),
      // outgoingMessages
      sequelize.query( 
        `SELECT COUNT(*) AS data FROM messages WHERE (direction = 'outgoing' OR direction IS null)`, 
        { type: sequelize.QueryTypes.SELECT} 
      ),
      // deliveredAndReadMessages
      sequelize.query( 
        `SELECT COUNT(*) AS data FROM messages WHERE delivered = TRUE AND read = TRUE AND (direction = 'outgoing' OR direction IS null)`, 
        { type: sequelize.QueryTypes.SELECT} 
      ),
      // deliveredNotReadMessages
      sequelize.query( 
        `SELECT COUNT(*) AS data FROM messages WHERE delivered = TRUE AND (read = FALSE OR read IS null) AND (direction = 'outgoing' OR direction IS null)`, 
        { type: sequelize.QueryTypes.SELECT} 
      ),
      // notDeliveredMessages
      sequelize.query( 
        `SELECT COUNT(*) AS data FROM messages WHERE (delivered = FALSE OR delivered IS null) AND (direction = 'outgoing' OR direction IS null)`, 
        { type: sequelize.QueryTypes.SELECT} 
      ),
      // messageErrors
      sequelize.query( 
        `SELECT COUNT(*) AS data FROM messages WHERE (error IS NOT null) AND (direction = 'outgoing' OR direction IS null)`, 
        { type: sequelize.QueryTypes.SELECT} 
      ),

      // Queries returning an array with multiple elements:
      // activeUsersByMonth
      sequelize.query( 
        `SELECT count(participant), month FROM (
          SELECT DISTINCT participant, to_char(date_trunc('month', "startTimestamp"), 'YYYY-MM') AS month FROM conversations
        ) AS activeusers
        GROUP BY month
        ORDER BY month ASC`, 
        { type: sequelize.QueryTypes.SELECT} 
      ),

    ])

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
      messageErrors
    ] = dashboardQueries.map(reduceEachToData)

    const [ activeUsersData ] = dashboardQueries.slice(-1)
    const activeUsersByMonth = completeWithMissingMonths(activeUsersData)

    return res.status(200).json({
      data: {
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
    })

  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }

}

module.exports = createGetConversationsHandler;