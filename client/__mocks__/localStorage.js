export const LocalStorageMock = () => {
  const store = {}

  const clear = () => {
    store = {}
  }

  const getItem = key => store[key]

  const setItem = (key, value) => {
    store[key] = value.toString()
  }

  return ({
    clear,
    getItem,
    setItem
  })
}