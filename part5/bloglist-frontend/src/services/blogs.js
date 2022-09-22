import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (blogObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(
    `${baseUrl}/${blogObject.id}`,
    blogObject,
    config
  )
  return response.data
}

const remove = async (blogObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${blogObject.id}`, config)
  return response.data
}

export default { setToken, getAll, create, update, remove }
