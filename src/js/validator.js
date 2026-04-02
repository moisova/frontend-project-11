import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.duplicate',
  },
  string: {
    url: 'errors.url',
  },
})

const getSchema = (feeds) => {
  return yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .notOneOf(
        feeds.map(feed => feed.url)),
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
