'use strict'

module.exports = ({
  BootBot: require('./bootbot/BootBot'),
  
  // The order of the modules can determines the incoming message's flow
  modules: [
    require('./modules/incoming'),
    require('./modules/outgoingButton'),
    require('./modules/outgoingList'),
    require('./modules/outgoingTemplate')
  ]
})