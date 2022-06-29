# `git` Workflow

## Starting a new feature or task

- Make sure all files on current branch are committed
- Switch to master branch by running `git checkout main`
- Fetch any changes from the server by running `git pull`
- Branch name format: "feature/<name-of-feature>"
- Create a new branch by running `git checkout -b feature/<name-of-feature>`
- Create the branch on the server by running `git push -u origin feature/<name-of-feature>`
- Create a new `Merge Request` to the main branch with the title of `[WIP] Description of feature`
- For reviewing, create a new branch from the feature branch and name it `review/<name-of-feature>`
- After reviewing, merge review branch into feature branch and add comments about requested changes (if applicable)
- Start working!

## Working on a feature or task

- You should commit your changes frequently. The more you commit, the easier it will be to detect when a bug is introduced.
- Once you made some changes, you can review them by running `git diff`
  - You can also run `git diff path/to/file` to see the changes made to the specified file
- Config an alias to remove diff log clutter from lock files
    - Run command: `git config --global alias.gd "diff -- . ':lock.json',':yarn.lock'"`
    - `git gd` - Shows output without lock file diff
- After reviewing you can add files to be committed using `git add path/to/files`
  - You can run `git add` multiple times to add more files before you commit
- To create the commit, you run `git commit` and enter a short commit message describing your changes
- Push your commits frequently

## Preparing the branch for review

- When the work is completed, make sure all files are committed and pushed
- Open the project in [GitLab](https://pear-labs.io/mono-projects/development) and navigate to your branch
- Request an approval from `Tim Raddish`, `Hierophant` or `T3rl`
- Feedback will be given via a review branch merge request / comments
- Once feedback is resolved, remove `[WIP]` from the title of the merge request
- Once the code is approved and merged, it will be available in the `main` branch
- Run `git checkout main` and then `git pull` to get the latest code
  - You are now ready to move on to the next task
