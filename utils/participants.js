export default async (user, config, path, octokit) => {
    const participant = []
    participant.push(`@${user.login}`)
    const reviews = await octokit.request(`GET ${path}/reviews`, config);
    for (const item of reviews.data) {
        const user = `@${item.user.login}`
        if (!participant.includes(user)) {
            participant.push(user)
        }
    }

    return participant
}