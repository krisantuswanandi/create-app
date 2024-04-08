import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const tag = core.getInput("tag", { required: true });
    const version = tag.replace("refs/tags/", "");

    const token = core.getInput("token", { required: true });
    const octokit = github.getOctokit(token);

    await octokit.rest.repos.createRelease({
      owner: "krisantuswanandi",
      repo: "create-app",
      tag_name: version,
      name: version,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
