'use strict'

const createGetConversationsHandler = db => async (req, res) => {
  const ConversationModel = db.Conversation
  const MessageModel = db.Message
  const sequelize = db.sequelize

  try {
    const getTodaysDate = () => {
      const today = new Date()

      return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
    }

    const getDateAMonthAgo = () => {
      const today = new Date()
      const monthAgo = new Date(today.setMonth(today.getMonth() - 1))

      return `${monthAgo.getFullYear()}-${monthAgo.getMonth()+1}-${monthAgo.getDate()}`
    }

    const dashboardQueries = await Promise.all([
      // totalUsers
      sequelize.query( "SELECT COUNT(DISTINCT participant) AS data FROM conversations", { type: sequelize.QueryTypes.SELECT} ),
      // totalMessages
      sequelize.query( "SELECT COUNT(*) AS data FROM messages", { type: sequelize.QueryTypes.SELECT} ),
      // dailyActiveUsers
      sequelize.query( 
        `SELECT COUNT(DISTINCT participant) AS data FROM conversations WHERE DATE("startTimestamp") = ?`,
        { 
          replacements: [getTodaysDate()], 
          type: sequelize.QueryTypes.SELECT
        } 
      ),
      // monthlyActiveUsers
      sequelize.query( 
        `SELECT COUNT(DISTINCT participant) AS data  FROM conversations WHERE "startTimestamp" BETWEEN :monthAgo AND :now`,
        { 
          replacements: {
            monthAgo: getDateAMonthAgo(),
            now: getTodaysDate()
          }, 
          type: sequelize.QueryTypes.SELECT
        } 
      ),
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

    ])

    const extractData = array => {
      const data = array.reduce(x => x).data
      
      if(typeof data === 'string') {
        return Number(data)
      }
      return data

    }

    const [
      totalUsers, 
      totalMessages, 
      dailyActiveUsers, 
      monthlyActiveUsers,
      avgMessages,
      avgLength,
      outgoingMessages,
      deliveredAndReadMessages,
      deliveredNotReadMessages,
      notDeliveredMessages,
      messageErrors
    ] = dashboardQueries.map(extractData)
    
    return res.status(200).json({
      totalUsers, 
      totalMessages, 
      dailyActiveUsers,
      monthlyActiveUsers,
      avgMessages,
      avgLength,
      deliveredAndReadRatio: deliveredAndReadMessages / outgoingMessages,
      deliveredNotReadRatio: deliveredNotReadMessages / outgoingMessages,
      notDeliveredRatio: notDeliveredMessages / outgoingMessages,
      messageErrorRatio: messageErrors / outgoingMessages,
    })

  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }

}

module.exports = createGetConversationsHandler;