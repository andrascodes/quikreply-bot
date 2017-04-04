import base64 from 'base-64'

export const createAuthApi = (fetch) => {
  const baseUrl = (window.config && window.config.baseUrl) ? window.config.baseUrl : 'http://localhost:5000/api'
  const authHeader = { 'Authorization': `Bearer ${localStorage.apiToken}` }
  
  return ({
    login: (username, password) => {

      const encoded = base64.encode(`${username}:${password}`)
      
      return fetch(`${baseUrl}/login`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${encoded}`,
        }
      })
      .then(res => Promise.all([res.ok, res.headers.get('Auth'), res.json()]))
      .then(([status, token, body]) => {
        if(!status) {
          return Promise.reject(body)
        }
        return ({ status, token, body })
      })
    },

    logout: () => {
      return fetch(`${baseUrl}/logout`, {
        method: 'POST',
        headers: authHeader
      })
      .then(res => Promise.all([ res.ok, res.statusText ]))
      .then(([status, text]) => {
        if(!status) {
          return Promise.reject(text)
        }
        return text
      })
    },

    putUserProfile: (username, password, email) => {
      const encoded = base64.encode(`${username}:${password}`)
      const authString = { 'Auth-Basic': `Basic ${encoded}` }

      return fetch(`${baseUrl}/profile`, {
        method: 'PUT',
        headers: Object.assign({}, authHeader, authString, {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ email })
      })
      .then(res => Promise.all([res.status, res.ok, res]))
      .then(([status, ok, res]) => {
        if(!ok) {
          return Promise.reject({status, statusText: res.statusText})
        }
        return res
      })
    }  

  })
}

