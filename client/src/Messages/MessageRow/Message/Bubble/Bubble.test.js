import React from 'react'
import renderer from 'react-test-renderer'

import { Bubble } from './Bubble'

describe.only('Bubble', () => {

  test('renders incoming Text Bubble correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'text'}
        direction={'incoming'} 
        message={{
          message: {
            text: 'Incoming text message'
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders outgoing Text Bubble correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'text'}
        direction={'outgoing'} 
        message={{
          message: {
            text: 'Outgoing text message'
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders Error tooltip correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'text'}
        direction={'outgoing'} 
        message={{
          message: {
            text: 'Outgoing text message'
          }
        }}
        error={true}
        response={{
          error: {
            message: 'Something went wrong'
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders Quick Reply Bubble correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'quick_reply'}
        direction={'outgoing'} 
        message={{
          message: {
            text: 'Quick Reply',
            quick_reply: {
              payload: 'PAYLOAD'
            }
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders Attachment Bubbles correctly', () => {
    let tree = renderer.create(
      <Bubble 
        type={'image'}
        direction={'incoming'} 
        message={{
          message: {
            attachments: [
              {
                payload: {
                  url: 'https://www.google.com'
                }
              }
            ]
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()

    tree = renderer.create(
      <Bubble 
        type={'audio'}
        direction={'incoming'} 
        message={{
          message: {
            attachments: [
              {
                payload: {
                  url: 'https://www.google.com'
                }
              }
            ]
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    
    tree = renderer.create(
      <Bubble 
        type={'file'}
        direction={'incoming'} 
        message={{
          message: {
            attachments: [
              {
                payload: {
                  url: 'https://www.google.com'
                }
              }
            ]
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    
    tree = renderer.create(
      <Bubble 
        type={'video'}
        direction={'incoming'} 
        message={{
          message: {
            attachments: [
              {
                payload: {
                  url: 'https://www.google.com'
                }
              }
            ]
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders Location Bubble correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'location'}
        direction={'incoming'} 
        message={{
          message: {
            attachments: [
              {
                payload: {
                  coordinates: {
                    lat: '42.34',
                    long: '-35.45',
                  },
                  title: 'Location'
                }
              }
            ]
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders Unknown Bubble correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'unknown'}
        text={'Unknown message placeholder'}
        direction={'outgoing'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders List Bubble correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'list'}
        direction={'outgoing'} 
        message={{
          message: {
            attachment: {
              payload: {
                elements: [
                  {
                    title: 'Title 1',
                    subtitle: 'Subtitle 1',
                    default_action: {
                      url: 'https://www.google.com'
                    },
                    image_url: 'https://www.google.com',
                    buttons: [
                      {
                        title: 'ElemBtn 1'
                      }
                    ]
                  },
                  {
                    title: 'Title 2',
                    subtitle: 'Subtitle 2',
                    default_action: {
                      url: 'https://www.google.com'
                    },
                    image_url: 'https://www.google.com',
                    buttons: [
                      {
                        title: 'ElemBtn 2'
                      }
                    ]
                  },
                ],
                buttons: [
                  {
                    title: 'ListBtn'
                  }
                ]
              }
            }
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders Generic Bubble correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'generic'}
        direction={'outgoing'} 
        message={{
          message: {
            attachment: {
              payload: {
                elements: [
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
              }
            }
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders Button Bubble correctly', () => {
    const tree = renderer.create(
      <Bubble 
        type={'button'}
        direction={'outgoing'} 
        message={{
          message: {
            attachment: {
              payload: {
                text: 'Message Text',
                buttons: [
                  {
                    title: 'Btn title1',
                  },
                  {
                    title: 'Btn title2',
                  },
                ]
              }
            }
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})