const Octokit = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

module.exports.webhook = async event => {
  const type = event.headers["X-GitHub-Event"];

	if (type !== "issue_comment") {
		return respond("Incorrect event type.");
	}

	const body = JSON.parse(event.body);
	const labels = body.issue.labels;
	const issueNumber = body.issue.number;
	const repoName = body.repository.name;
	const repoOwner = body.repository.owner.login;
	const commentAuthor = body.comment.user.login;
	const commentBody = body.comment.body;

	if (!commentBody.includes("/request")) {
		return respond("Not a relevant comment.");
	}

	const isAssigned = labels.find(({ name }) => name === "assigned");
	if (isAssigned) {
		await octokit.issues.createComment({
			repo: repoName,
			owner: repoOwner,
			issue_number: issueNumber,
			body: `Sorry @${commentAuthor}, this issue is already assigned.`
		});

		return respond("This issue is already assigned.");
	}

	await Promise.all([
		octokit.issues.addLabels({
			repo: repoName,
			owner: repoOwner,
			issue_number: issueNumber,
			labels: ["assigned", `assignee:${commentAuthor}`]
		}),
		octokit.issues.createComment({
			repo: repoName,
			owner: repoOwner,
			issue_number: issueNumber,
			body: `Hey @${commentAuthor}, this issue is all yours.`
		})
	]);

	return respond("The issue was assigned.");
};

function respond(payload, statusCode = 200) {
	return {
		statusCode,
		body: JSON.stringify({ payload })
	};
}
