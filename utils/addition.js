import moment from 'moment'

const properties = {
  github: {
    repository_name: ['body', 'pull_request', 'head', 'repo', 'name'],
    repository_url: ['body', 'pull_request', 'head', 'repo', 'html_url'],
    platform: ['git'],
    url: ['body', 'pull_request', 'html_url'],
    author_username: ['body', 'pull_request', 'user', 'login']
  },
  gitlab: {
    repository_name: ['body', 'repository', 'name'],
    repository_url: ['body', 'repository', 'homepage'],
    platform: ['git'],
    url: ['body', 'object_attributes', 'url'],
    author_username: ['body', 'user', 'username']
  }
}

const addition = (data) => {
  const property = properties[data.git]
  const item = {}
  for (const key in property) {
    let payload = data
    for (const path of property[key]) {
      payload = payload[path]
    }
    item[key] = payload
  }
  item.created_at = moment().toISOString()
  return item
}

export default addition
