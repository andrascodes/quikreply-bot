import moment from 'moment'
import _ from 'lodash'

export const formatDate = date => moment(date).format('MMMM Do YYYY HH:MM')

export const calculateDuration = (startDate, endDate) => moment(endDate - startDate).format('mm:ss')