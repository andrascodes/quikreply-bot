'use strict'

const _ = require('lodash')
const moment = require('moment')

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

const completeWithMissingMonths = activeUsersData => 
  _generateDatesOfPastYear()
  .map(date => ({
    month: date,
    count: _getValueByDate(activeUsersData, date)
  }))
  .dropWhile(data => data.count <= 0)
  .map(({ month, count }) => ({
    month: month.format('MMMM'),
    count
  }))
  .thru(array => _ifEmptyGenerateZeros(array))
  .value()
  
  
const _getValueByDate = (activeUsersData, momentDate) => 
  _.chain(activeUsersData)
  .find(data => moment(data.month).isSame(momentDate, 'month'))
  .thru(value => (_.isUndefined(value) ? 0 : Number(value.count)))
  .value()
  
const _ifEmptyGenerateZeros = array =>
  _.chain(array)
  .thru(array => 
    _.isEmpty(array) ? 
      _generateDatesOfPastYear()
      .map(date => ({
        month: date.format('MMMM'),
        count: 0
      }))
      .value()
    : 
      array
  )
  
const _generateDatesOfPastYear = () =>
  _.chain([0,1,2,3,4,5,6,7,8,9,10,11])
  .map(val => moment().subtract(val, 'months'))
  .reverse()

module.exports = {
  reduceEachToData,
  completeWithMissingMonths
}
