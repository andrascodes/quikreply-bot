import moment from 'moment'
import _ from 'lodash'

export const formatDate = date => moment(date).format('MMMM Do YYYY HH:mm')

export const calculateDuration = (start, end) => {
  const startDate = moment(start)
  const endDate = moment(end)
  return moment(endDate - startDate).format('mm:ss')
}

export const isBetween = (date, from, to) => moment(date).isBetween(from, to, 'day', '[]')

export const getMinDateFromList = dates => 
  _.chain(dates)
    .map(date => moment(date))
    .map(date => date.valueOf())
    .min()
    .thru(min => moment(min).format('YYYY-MM-DD'))
    .value()

export const getMaxDateFromList = dates => 
  _.chain(dates)
    .map(date => moment(date))
    .map(date => date.valueOf())
    .max()
    .thru(min => moment(min).format('YYYY-MM-DD'))
    .value()

export const getDateRangeOfList = dates => ({
  startDate: getMinDateFromList(dates),
  endDate: getMaxDateFromList(dates)
})