import { createAuthApi } from './authApi'

describe(`AuthApi`, () => {
  
  beforeEach(() => {
    global.localStorage = {
      apiToken: 'token'
    }
  })

  test(`#login: returns a valid response`, () => {
    const result = { data: { id: 1 } }
    const token = 'token'
    const response = {
      ok: true,
      headers: {
        get: () => (token)
      },
      json: () => (result)
    }
    const fetch = () => Promise.resolve(response)
    const authApi = createAuthApi(fetch)

    return authApi.login().then(res => {
      const expected = {
        token,
        status: true,
        body: result
      }
      expect(res).toEqual(expected)
    })
  })
  
  test(`#login: rejects when response status is not ok`, () => {
    const error = { error: 'server error' }
    const response = {
      ok: false,
      headers: {
        get: () => ('token')
      },
      json: () => (error)
    }
    const fetch = () => Promise.resolve(response)
    const authApi = createAuthApi(fetch)

    return authApi.login().catch(err => {
      expect(err).toEqual(error)
    })
  })
  
  test(`#login: rejects when API call results in rejected Promise`, () => {
    const error = { error: 'rejection' }
    const fetch = () => Promise.reject(error)
    const authApi = createAuthApi(fetch)

    return authApi.login().catch(err => {
      expect(err).toEqual(error)
    })
  })
  
  test(`#logout: returns a valid response`, () => {
    const token = 'token'
    const response = {
      ok: true,
      statusText: 'OK'
    }
    const fetch = () => Promise.resolve(response)
    const authApi = createAuthApi(fetch)

    return authApi.logout().then(res => {
      const expected = 'OK'
      expect(res).toEqual(expected)
    })
  })
  
  test(`#logout: rejects when response status is not ok`, () => {
    const token = 'token'
    const response = {
      ok: false,
      statusText: 'Unauthorized'
    }
    const fetch = () => Promise.resolve(response)
    const authApi = createAuthApi(fetch)

    return authApi.logout().catch(err => {
      const expected = 'Unauthorized'
      expect(err).toEqual(expected)
    })
  })
  
  test(`#logout: rejects when API call results in rejected Promise`, () => {
    const error = { error: 'rejection' }
    const fetch = () => Promise.reject(error)
    const authApi = createAuthApi(fetch)

    return authApi.logout().catch(err => {
      expect(err).toEqual(error)
    })
  })
  
  test(`#putUserProfile: returns a valid response`, () => {
    const response = {
      ok: true,
      status: 200,
      statusText: 'OK'
    }
    const fetch = () => Promise.resolve(response)
    const authApi = createAuthApi(fetch)

    return authApi.putUserProfile().then(res => {
      expect(res).toEqual({ ok: response.ok, status: response.status, statusText: response.statusText})
    })
  })
  
  test(`#putUserProfile: rejects when response status is not ok`, () => {
    const response = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    }
    const fetch = () => Promise.resolve(response)
    const authApi = createAuthApi(fetch)

    return authApi.putUserProfile().catch(err => {
      expect(err).toEqual({ status: response.status, statusText: response.statusText})
    })
  })
  
  test(`#putUserProfile: rejects when API call results in rejected Promise`, () => {
    const error = { error: 'rejection' }
    const fetch = () => Promise.reject(error)
    const authApi = createAuthApi(fetch)

    return authApi.putUserProfile().catch(err => {
      expect(err).toEqual(error)
    })
  })

})