export const createServiceApi = (fetch) => {
  const baseUrl = (window.config && window.config.baseUrl) ? window.config.baseUrl : 'http://localhost:5000/api'
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.apiToken}`,
    }
  }

  console.log(options)

  return ({
    loadConversations: () => 
      fetch(`${baseUrl}/conversations`, options)
      .then(res => res.json())
      .then(res => res.data),
    
    loadMessages: id =>
      fetch(`${baseUrl}/conversations/${id}`, options)
      .then(res => res.json())
      .then(res => res.data),

    loadDashboard: () => 
      fetch(`${baseUrl}/dashboard`, options)
      .then(res => res.json())
      .then(res => res.data)
  })
}

