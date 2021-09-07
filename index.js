const { Octokit } = require("@octokit/core");

const octokit = new Octokit({ auth: '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' });

const start = async () => {
    const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner: 'ayocodingit',
        repo: 'boilerplate-adonis-js'
    });
    console.log(response);
}

start()
