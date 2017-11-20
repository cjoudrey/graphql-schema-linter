# Contributing

Thanks for being willing to contribute!

We love pull requests from everyone. By participating in this project, you agree to abide by the thoughtbot [code of conduct](https://github.com/cjoudrey/graphql-schema-linter/blob/master/CODE_OF_CONDUCT.md).

**Working on your first Pull Request?** You can learn how from this free series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Project setup

1. Fork and clone the repository.
2. Run `npm install` to install dependencies

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork.
> To do this, run:
>
> ```
> git remote add upstream https://github.com/cjoudrey/graphql-schema-linter.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream",
> then fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`.
> Then you can make all of your pull request branches based on this `master`
> branch. Whenever you want to update your version of `master`, do a regular
> `git pull`.

## Committing and Pushing changes

Please make sure to run the tests `npm run test` before you commit your changes.

