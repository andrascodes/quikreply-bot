import React from 'react'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import { GenericMessage } from './GenericMessage'

describe(`GenericMessage`, () => {

  const elements = [
    {
      image_url: 'https://www.google.com',
      title: 'Title1',
      subtitle: 'Subtitle1',
      default_action: {
        url: 'https://www.google.com'
      },
      buttons: [
        {
          title: 'Btn1 title1',
        },
        {
          title: 'Btn1 title2',
        },
      ]
    },
    {
      image_url: 'https://www.google.com',
      title: 'Title2',
      subtitle: 'Subtitle2',
      default_action: {
        url: 'https://www.google.com'
      },
      buttons: [
        {
          title: 'Btn2 title1',
        },
        {
          title: 'Btn2 title2',
        },
      ]
    }
  ]
  
  // attachement: payload: elements
  test('renders first element from elements by default', () => {
    const wrapper = mount(
      <GenericMessage 
        attachment={{
          payload: {
            elements,
          }
        }}
      />
    )
    expect(wrapper.find('.GenericElementTitle').text()).toEqual(elements[0].title)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders second element when clicked on next button', () => {
    const wrapper = mount(
        <GenericMessage 
          attachment={{
            payload: {
              elements,
            }
          }}
        />
      )
      wrapper.find('.GenericPagingButton > .fa-chevron-right').parent().simulate('click', { 
        persist: () => {}, 
        preventDefault: () => {} 
      })
      expect(wrapper.find('.GenericElementTitle').text()).toEqual(elements[1].title)
      expect(toJson(wrapper)).toMatchSnapshot()
  })
  
  test('renders first element when clicked on previous button', () => {
    const wrapper = mount(
      <GenericMessage 
        attachment={{
          payload: {
            elements,
          }
        }}
      />
    )
    wrapper.find('.GenericPagingButton > .fa-chevron-right').parent().simulate('click', { 
      persist: () => {}, 
      preventDefault: () => {} 
    })
    wrapper.find('.GenericPagingButton > .fa-chevron-left').parent().simulate('click', { 
      persist: () => {}, 
      preventDefault: () => {} 
    })
    expect(wrapper.find('.GenericElementTitle').text()).toEqual(elements[0].title)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})