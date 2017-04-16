import moment from 'moment'
import _ from 'lodash'

export const formatDate = date => {
  if(!date) {
    return undefined
  }
  return moment(date).format('MMMM Do YYYY HH:mm')
}

export const calculateDuration = (start, end) => {
  if(!start || !end) {
    return undefined
  }
  const startDate = moment(start)
  const endDate = moment(end)
  return moment(endDate - startDate).format('mm:ss')
}

export const isBetween = (date, from, to) => moment(date).isBetween(from, to, 'day', '[]')

export const getMinDateFromList = dates => {
  const min = _.chain(dates)
    .map(date => moment(date))
    .map(date => date.valueOf())
    .min()
    .value()

  if(!min) {
    return undefined
  }
  return moment(min).format('YYYY-MM-DD')
}

export const getMaxDateFromList = dates => {
  const max = _.chain(dates)
    .map(date => moment(date))
    .map(date => date.valueOf())
    .max()
    .value()

  if(!max) {
    return undefined
  }
  return moment(max).format('YYYY-MM-DD')
}

export const getDateRangeOfList = dates => ({
  startDate: getMinDateFromList(dates),
  endDate: getMaxDateFromList(dates)
})

export const formatMessageTimestamp = timestamp => {
  if(!timestamp) {
    return undefined
  }
  return moment(timestamp).format('HH:mm:ss')
}