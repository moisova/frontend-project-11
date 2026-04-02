import state from './state'
import { fetchRSS, parseRSS } from './rss'

const updateFeeds = () => {
  const feeds = state.feeds

  const promises = feeds.map(feed => {
    const existingPosts = state.posts.filter((post) => post.feedId === feed.id)

    return fetchRSS(feed.url)
      .then(parseRSS)
      .then((feedData) => {
        const newPosts = feedData.posts.filter((post) => {
          return !existingPosts.some(existingPost => existingPost.link === post.link)
        })
        const postsWithId = newPosts.map(post => ({
          ...post,
          feedId: feed.id,
        }))
        state.posts.unshift(...postsWithId)
      })
  })
  Promise.all(promises)
    .finally(() => {
      setTimeout(updateFeeds, 5000)
    })
}
updateFeeds()
