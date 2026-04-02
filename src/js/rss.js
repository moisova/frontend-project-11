import axios from 'axios'

export const fetchRSS = (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get'
  const encodedUrl = encodeURIComponent(url)
  const requestUrl = `${proxyUrl}?disableCache=true&url=${encodedUrl}`

  return axios.get(requestUrl)
    .then((response) => {
      return response.data.contents
    })
    .catch(() => {
      throw new Error('errors.network')
    })
}

export const parseRSS = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'text/xml')

  const parserError = doc.querySelector('parsererror')
  if (parserError) {
    throw new Error('errors.invalidRSS')
  }

  const title = doc.querySelector('channel > title').textContent
  const description = doc.querySelector('channel > description').textContent
  const items = doc.querySelectorAll('item')

  const posts = Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
  }))

  return {
    title,
    description,
    posts,
  }
}
