export const createServiceApi = (fetch, baseUrl) => ({
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

