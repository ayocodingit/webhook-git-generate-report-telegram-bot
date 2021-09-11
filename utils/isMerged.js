const PULL_REQUEST_MERGED = {
  github: {
    locations: ['pull_request', 'merged'],
    condition: true
  },
  gitlab: {
    locations: ['object_attributes', 'action'],
    condition: 'merge'
  }
}

const isMerged = (git, body) => {
  const locations = PULL_REQUEST_MERGED[git].locations
  let state = body
  for (const location of locations) {
    state = state[location]
  }
  return state === PULL_REQUEST_MERGED[git].condition
}

export default isMerged
