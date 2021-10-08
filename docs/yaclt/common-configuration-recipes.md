---
sidebar_position: 4
---

# Common Configuration Recipes

## Require a changelog be added for a branch

```js
const execSync = require("child_process").execSync;

const getDefaultBranch = () => execSync(
  "git remote show origin | awk '/HEAD branch/ {print $NF}'"
)
  .toString()
  .replace(/\n/g, "")
  .trim();

const allChangedFiles = () => {
  const defaultBranch = getDefaultBranch();
  execSync(`git fetch origin ${defaultBranch}`);
  const currentRevision = execSync("git rev-parse HEAD").toString().replace(/\n/g, "");
  return execSync(
    `git --no-pager diff --name-only origin/${defaultBranch} ${currentRevision}`
  )
    .toString()
    .split("\n")
    .map((filename) => filename.trim())
    .filter(Boolean); // filter empty strings
};

module.exports = {
  preValidate: () => {
    const changedFiles = allChangedFiles();
    if (changedFiles.length > 0 && !changedFiles.some((filename) => filename.startsWith("changelogs/"))) {
      console.error(
        "No changelog has been added for the current change set. Create a new changelog entry for this change set."
      );
      return false;
    }
  }
}
```

## Use `package.json` version as release number

```js
module.exports = {
  releaseNumber: () => require("./package.json").version
}
```

## Require work tree be clean before preparing a release

```js
const execSync = require("child_process").execSync;

module.exports = {
  prePrepare: () => {
    // if work tree is not clean, can't prepare a release
    if (execSync("git diff --stat").toString().replace(/\n/g, "").trim()) {
      console.error(
        "Work tree is not clean. Releases can only be prepared from a clean work tree."
      );
      return false;
    }
  }
}
```

## Require releases be prepared from the default branch

```js
const execSync = require("child_process").execSync;

const getDefaultBranch = () =>
  execSync("git remote show origin | awk '/HEAD branch/ {print $NF}'")
    .toString()
    .replace(/\n/g, "")
    .trim();

const getCurrentBranch = () =>
  execSync("git branch --show-current").toString().replace(/\n/g, "").trim();

module.exports = {
  prePrepare: () => {
    const defaultBranch = getDefaultBranch();
    if (defaultBranch !== getCurrentBranch()) {
      console.error(
        `Releases can only be prepared from ${defaultBranch}! There should be no changes from ${defaultBranch} before preparing the changelog.`
      );
      return false;
    }
  }
}
```
