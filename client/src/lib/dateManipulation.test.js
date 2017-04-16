import { 
  formatDate, 
  calculateDuration, 
  isBetween, 
  getMinDateFromList, 
  getMaxDateFromList,
  getDateRangeOfList,
  formatMessageTimestamp  
} from './dateManipulation'

describe(`dateManipulation`, () => {

  test(`#formatDate: returns undefined for undefined date`, () => {
    expect(formatDate(undefined)).not.toBeDefined()
  })
  
  test(`#formatDate: returns the formatted date as a string`, () => {
    const actual = formatDate(new Date('2017-04-28 12:00'))
    const expected = 'April 28th 2017 12:00'
    expect(actual).toEqual(expected)
  })
  
  test(`#calculateDuration: returns undefined for undefined date`, () => {
    expect(calculateDuration(undefined)).not.toBeDefined()
  })
  
  test(`#calculateDuration: returns the duration as a string`, () => {
    const actual = calculateDuration(new Date('2017-04-28 12:00'), new Date('2017-04-28 12:13:04'))
    const expected = '13:04'
    expect(actual).toEqual(expected)
  })
  
  test(`#isBetween: returns a Boolean`, () => {
    let actual = isBetween('2017-04-28', new Date('2017-04-28 12:00'), new Date('2017-04-28 12:13:04'))
    let expected = true
    expect(actual).toEqual(expected)
    
    actual = isBetween('2017-04-29', new Date('2017-04-28 12:00'), new Date('2017-04-28 12:13:04'))
    expected = false
    expect(actual).toEqual(expected)
  })

  test(`#getMinDateFromList: returns undefined for undefined date`, () => {
    expect(getMinDateFromList(undefined)).not.toBeDefined()
  })
  
  test(`#getMinDateFromList: returns the formatted date as a string`, () => {
    const actual = getMinDateFromList(['2017-04-28 12:04', '2017-04-29 12:10', '2017-03-28 00:04'])
    const expected = '2017-03-28'
    expect(actual).toEqual(expected)
  })

  test(`#getMaxDateFromList: returns undefined for undefined date`, () => {
    expect(getMaxDateFromList(undefined)).not.toBeDefined()
  })
  
  test(`#getMaxDateFromList: returns the formatted date as a string`, () => {
    const actual = getMaxDateFromList(['2017-04-28 12:04', '2017-04-29 12:10', '2017-03-28 00:04'])
    const expected = '2017-04-29'
    expect(actual).toEqual(expected)
  })
  
  test(`#getDateRangeOfList: returns undefined for undefined date`, () => {
    expect(getDateRangeOfList(undefined)).toEqual({
      endDate: undefined,
      startDate: undefined
    })
  })
  
  test(`#getDateRangeOfList: returns the formatted date as a string`, () => {
    const actual = getDateRangeOfList(['2017-04-28 12:04', '2017-04-29 12:10', '2017-03-28 00:04'])
    const expected = {
      endDate: '2017-04-29',
      startDate: '2017-03-28'
    }
    expect(actual).toEqual(expected)
  })
  
  test(`#formatMessageTimestamp: returns undefined for undefined date`, () => {
    expect(formatMessageTimestamp(undefined)).not.toBeDefined()
  })
  
  test(`#formatMessageTimestamp: returns the formatted date as a string`, () => {
    const actual = formatMessageTimestamp(new Date('2017-04-28 12:04:28'))
    const expected = "12:04:28"
    expect(actual).toEqual(expected)
  })

})