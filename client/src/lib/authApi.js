import base64 from 'base-64'

export const createAuthApi = (fetch) => {
  const baseUrl = (window.config && window.config.baseUrl) ? window.config.baseUrl : 'http://localhost:5000/api'
  
  return ({
    login: (email, password) => {

      const encoded = base64.encode(`${email}:${password}`)
      
      return fetch(`${baseUrl}/login`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${encoded}`,
        }
      })
      .then(res => Promise.all([res.status, res.headers.get('Auth'), res.json()]))
      .then(([status, token, body]) => {
        if(status !== 200) {
          return Promise.reject(body)
        }

        return ({ status, token, body })
      })
    },
    logout: (token) => {

    }  

  })
}

