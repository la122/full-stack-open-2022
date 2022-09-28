import axios from 'axios'
import userService from './user'

const baseUrl = '/api/blogs'

const config = () => {
  return {
    headers: {
      Authorization: `bearer ${userService.getToken()}`
    }
  }
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, config())
  return response.data
}

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`, config())
}

const addComment = async (id, comment) => {
  const request = axios.post(`${baseUrl}/${id}/comments`, { comment })
  const response = await request
  return response.data
}

export default { getAll, create, update, remove, addComment }
