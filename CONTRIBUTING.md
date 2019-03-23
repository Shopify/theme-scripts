# How to contribute

We ❤️ pull requests. If you'd like to fix a bug, contribute a feature or just correct a typo, please feel free to do so, as long as you follow our [Code of Conduct](https://github.com/Shopify/slate/blob/master/CODE_OF_CONDUCT.md).

If you're thinking of adding a big new feature, consider opening an issue first to discuss it to ensure it aligns to the direction of the project (and potentially save yourself some time!).

This repo is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) consisting of multiple packages and is managed using [Lerna](https://github.com/lerna/lerna).

## Getting Started

To start working on the codebase, first fork the repo, then clone it:

```
git clone git@github.com:your-username/theme-scripts.git
```

_Note: replace "your-username" with your GitHub handle_

Install all package dependencies and link local packages:

```
theme-scripts $ yarn bootstrap
```

Write some features. Run the tests with:

```
theme-scripts $ yarn test
```

## Linking a new themes package with Lerna

Adding dependency to all packages

```
theme-scripts $ yarn lerna add [package-name]
```

Adding dependency to a specific package

```
theme-scripts $ yarn lerna add [package-name] --scope=@shopify/theme-[name]
```

_Note: See the [lerna documentation](https://github.com/lerna/lerna/tree/2.x#add) for more information_

## How to test locally

The following details how to setup your local environment when you wish to create a new branch of a theme script package. It uses work on a new release of `@shopify/themes-a11y` as an example.

### Create a link to your local package to another project

Navigate to the package and type [`yarn link`](https://yarnpkg.com/en/docs/cli/link).

```bash
theme-scripts $ cd packages/themes-a11y
theme-a11y $ yarn link

# success Registered "@shopify/theme-a11y".
# info You can now run `yarn link "@shopify/theme-a11y"`
```

Go to a local project you want to test out the script in.

```bash
cd ../some-path/my-theme
my-theme $ yarn link "@shopify/theme-a11y"

# success Using linked package for "@shopify/theme-a11y".
```

### Removing a link to a package

To unlink your package so other local projects stop using it, use [`yarn unlink`](https://yarnpkg.com/en/docs/cli/unlink). This is also called “unregistering” the package.

```bash
theme-a11y $ yarn unlink

# success Unregistered "@shopify/theme-a11y".
```

When you don’t want your project to be using your local package, go to your local project and type `yarn unlink <package>`

```bash
cd ../projects/my-theme
my-theme $ yarn unlink "@shopify/theme-a11y"

# success Removed linked package "@shopify/theme-a11y".
# info You will need to run `yarn` to re-install the package that was linked.
```

## Documentation

If your change affects how people use the project (i.e. adding or removing
functionality, changing the return value of a function, etc),
please ensure the documentation is also updated to
reflect this.

## Publishing

⚠️ Note: You must have a Shopify Okta account ir order to login to Shipit and publish.

1. Merge any changes you want to include in your next release into `master`.

   _Note: If you are merging multiple PRs into `master` with a single PR (e.g. you are merging a working branch called v0.11.0 with multiple fixes made from multiple PRs into `master`), then **do not squash and merge this PR** because you will loose valuable details in the commit history_

2. Checkout `master` and pull the latest from the origin

   ```
   theme-scripts $ git checkout master && git pull origin master
   ```

3. You can verify that there are indeed packages to be published (optional)

   ```
   theme-scripts $ yarn lerna updated
   ...
   lerna info version 2.11.0
   lerna info Checking for updated packages...
   lerna info Comparing with v2.0.4.
   lerna info Checking for prereleased packages...
   lerna info result
   - @shopify/theme-a11y // This package was updated and can be published
   ✨Done in 0.63s.
   ```

4. Run the release step to choose the version bump desired

   ```
   theme-scripts $ yarn release
   ...
   lerna info version 2.11.0
   lerna info current version 2.0.4
   lerna info Checking for updated packages...
   lerna info Comparing with v2.0.4.
   lerna info Checking for prereleased packages...
   ? Select a new version (currently 2.0.4) (Use arrow keys)
   ❯ Patch (2.0.5)
   Minor (2.1.0)
   Major (3.0.0)
   Prepatch (2.0.5-0)
   Preminor (2.1.0-0)
   Premajor (3.0.0-0)
   Prerelease
   Custom
   ```

   This command will:

   1. Run the equivalent of lerna updated to determine which packages need to be published.
   2. If necessary, increment the version key in lerna.json.
   3. Update the package.json of all updated packages to their new versions.
   4. Update all dependencies of the updated packages with the new versions, specified with a caret (^).
   5. Create a new git commit and tag for the new version.
   6. Git push to origin master with the newly created tag.

   _Note: See the [lerna documentation](https://github.com/lerna/lerna/tree/2.x#publish) for more information_

5. Login to [Shipit](https://shipit.shopify.io/shopify/theme-scripts/production)
6. In the Undeployed Commits list, identify the commit with the name of the version that was created in step #4, wait for CI to be 🍏, click the 'Deploy' button to publish to npm's public registry.
