import { createServiceApi } from './serviceApi'

describe(`ServiceApi`, () => {
  
  beforeEach(() => {
    global.localStorage = {
      apiToken: 'token'
    }
  })

  test(`#loadConversations: returns a valid response`, () => {
    const result = { data: { id: 1 } }
    const response = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => (result)
    }
    const fetch = () => Promise.resolve(response)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadConversations().then(res => {
      expect(res).toEqual(result.data)
    })
  })
  
  test(`#loadConversations: rejects when response status is not ok`, () => {
    const response = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => (result)
    }
    const fetch = () => Promise.resolve(response)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadConversations().catch(err => {
      const expected = {
        status: response.status,
        statusText: response.statusText
      }
      expect(err).toEqual(expected)
    })
  })
  
  test(`#loadConversations: rejects when API call results in rejected Promise`, () => {
    const error = { error: 'rejection' }
    const fetch = () => Promise.reject(error)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadConversations().catch(err => {
      expect(err).toEqual(error)
    })
  })

  test(`#loadMessages: returns a valid response`, () => {
    const result = { data: { id: 1 } }
    const response = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => (result)
    }
    const fetch = () => Promise.resolve(response)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadMessages().then(res => {
      expect(res).toEqual(result.data)
    })
  })
  
  test(`#loadMessages: rejects when response status is not ok`, () => {
    const response = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => (result)
    }
    const fetch = () => Promise.resolve(response)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadMessages().catch(err => {
      const expected = {
        status: response.status,
        statusText: response.statusText
      }
      expect(err).toEqual(expected)
    })
  })
  
  test(`#loadMessages: rejects when API call results in rejected Promise`, () => {
    const error = { error: 'rejection' }
    const fetch = () => Promise.reject(error)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadMessages().catch(err => {
      expect(err).toEqual(error)
    })
  })
  
  test(`#loadDashboard: returns a valid response`, () => {
    const result = { data: { id: 1 } }
    const response = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => (result)
    }
    const fetch = () => Promise.resolve(response)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadDashboard().then(res => {
      expect(res).toEqual(result.data)
    })
  })
  
  test(`#loadDashboard: rejects when response status is not ok`, () => {
    const response = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => (result)
    }
    const fetch = () => Promise.resolve(response)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadDashboard().catch(err => {
      const expected = {
        status: response.status,
        statusText: response.statusText
      }
      expect(err).toEqual(expected)
    })
  })
  
  test(`#loadDashboard: rejects when API call results in rejected Promise`, () => {
    const error = { error: 'rejection' }
    const fetch = () => Promise.reject(error)
    const serviceApi = createServiceApi(fetch)

    return serviceApi.loadDashboard().catch(err => {
      expect(err).toEqual(error)
    })
  })

})