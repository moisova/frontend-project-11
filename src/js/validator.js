import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.duplicate'
  },
  string: {
    url: 'errors.url'
  }
})

const getSchema = (feeds) => {
  return yup.object().shape({
    url: yup
    .string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(
      feeds.map(feed => feed.url),
      'RSS уже существует')
  })
}

const validate = (url, feeds) => {
  const schema = getSchema(feeds)
  
  return schema.validate({ url })
    .then(() => url) 
    .catch((err) => {
      throw err.message
    })

}

export default validate
