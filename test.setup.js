module.exports = {
  closeConnection: (db, endTest) => {
    db.sequelize.close()
    endTest()
  },
}