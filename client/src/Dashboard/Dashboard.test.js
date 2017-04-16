import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Dashboard } from './Dashboard'

describe(`Dashboard`, () => {
  
  beforeEach(() => {
    global.localStorage = {
      clear: jest.fn()
    }
  })

  test('renders Redirect to /login when state.error.status is 401: Unauthorized', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Dashboard error={{ status: 401 }}/>
      </MemoryRouter>
    )
    expect(global.localStorage.clear).toHaveBeenCalled()
    expect(wrapper.find('Redirect').prop('to')).toEqual('/login')
  })

  test('renders Error when state.error is truthy', () => {
    const wrapper = mount(<Dashboard />)
    wrapper.setState({ error: { status: 500 } })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders correctly', () => {
    const wrapper = mount(<Dashboard />)
    expect(toJson(wrapper)).toMatchSnapshot()

    wrapper.setState({ 
      "users": {
        "totalUsers": 1,
        "activeUsersToday": 0,
        "activeUsersYesterday": 0,
        "activeUsersLastMonth": 1,
        "activeUsersTwoMonthsAgo": 0,
        "activeUsersByMonth": [
          {
            "month": "April",
            "count": 1
          }
        ]
      },
      "messages": {
        "totalMessages": 34,
        "avgMessages": 5.666666666666667,
        "avgLength": "00:08",
        "outgoingMessages": 17,
        "deliveredAndReadMessages": 16,
        "deliveredNotReadMessages": 0,
        "notDeliveredMessages": 1,
        "messageErrors": 0
      }
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})