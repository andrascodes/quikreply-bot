export const createServiceApi = (fetch) => {
  const baseUrl = (window.config && window.config.baseUrl) ? window.config.baseUrl : 'http://localhost:5000/api'
  return ({
    loadConversations: () => 
      fetch(`${baseUrl}/conversations`)
      .then(res => res.json())
      .then(res => res.data),
    
    loadMessages: id =>
      fetch(`${baseUrl}/${id}`)
      .then(res => res.json())
      .then(res => res.data),

    loadDashboard: () => 
      fetch(`${baseUrl}/dashboard`)
      .then(res => res.json())
      .then(res => res.data)
  })
}

