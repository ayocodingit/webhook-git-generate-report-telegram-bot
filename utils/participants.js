export default async (user, config, path, octokit) => {
    const participant = []
    participant.push(user.login)
    const reviews = await octokit.request(`GET ${path}/reviews`, config);
    for(const item of reviews.data) {
        if (!participant.includes(item.user.login)) {
            participant.push(item.user.login)
        }
    }

    return participant
}