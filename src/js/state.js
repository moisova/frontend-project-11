import { proxy } from 'valtio/vanilla';

const state = proxy({
  form: {
    processState: 'filling',
    valid: true,
    error: null,
    fields: {
      url: '',
    },
  },
  feeds: [],
  posts: [], 
})

export default state