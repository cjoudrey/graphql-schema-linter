# graphql-schema-linter [![Travis CI](https://travis-ci.org/cjoudrey/graphql-schema-linter.svg?branch=master)](https://travis-ci.org/cjoudrey/graphql-schema-linter) [![npm version](https://badge.fury.io/js/graphql-schema-linter.svg)](https://yarnpkg.com/en/package/graphql-schema-linter)

This package provides a command line tool to validate GraphQL schema definitions against a set of rules.

![Screenshot](https://raw.githubusercontent.com/cjoudrey/graphql-schema-linter/master/screenshot-v0.0.24.png)

If you're looking to lint your GraphQL queries, check out this ESLint plugin: [apollographql/eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql).

## Install

Yarn:

```
yarn global add graphql-schema-linter
```

npm:

```
npm install -g graphql-schema-linter
```

## Usage

```
Usage: graphql-schema-linter [options] [schema.graphql ...]


Options:

  -r, --rules <rules>

    only the rules specified will be used to validate the schema

    example: --rules fields-have-descriptions,types-have-descriptions

  -f, --format <format>

    choose the output format of the report

    possible values: json, text

  -s, --stdin

    schema definition will be read from STDIN instead of specified file

  --version

    output the version number

  -h, --help

    output usage information
```

### Usage with pre-commit Hooks

Using [lint-staged](https://github.com/okonet/lint-staged) and [husky](https://github.com/typicode/husky), you can lint
your staged GraphQL schema file before you commit.  First, install these packages:

```bash
yarn add --dev lint-staged husky
```

Then add a `precommit` script and a `lint-staged` key to your `package.json` like so:

```json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "*.graphql": ["graphql-schema-linter path/to/*.graphql"]
  }
}
```

The above configuration assumes that you have either one `schema.graphql` file or multiple `.graphql` files that should
be concatenated together and linted as a whole.

If you have both client and server schema in the same project, you'll likely need to put
multiple entries in the `lint-staged` object above - one for client and one for server.  Something like:

```json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "client/*.graphql": ["graphql-schema-linter client/*.graphql"],
    "server/*.graphql": ["graphql-schema-linter server/*.graphql"]
  }
}
```

## Configuration file

In addition to being able to configure `graphql-schema-linter` via command line options, it can also be configured via
one of the following configuration files.

For now, only `rules` can be configured in a configuration file, but more options may be added in the future.

### In `package.json`

```json
{
  "graphql-schema-linter": {
    "rules": ["enum-values-sorted-alphabetically"]
  }
}
```

### In `.graphql-schema-linterrc`

```json
{
  "rules": ["enum-values-sorted-alphabetically"]
}
```

### In `graphql-schema-linter.config.js`

```js
module.exports = {
  rules: ['enum-values-sorted-alphabetically'],
};
```

## Built-in rules

### `defined-types-are-used`

This rule will validate that all defined types are used at least once in the schema.

### `deprecations-have-a-reason`

This rule will validate that all deprecations have a reason.

### `enum-values-all-caps`

This rule will validate that all enum values are capitalized.

### `enum-values-have-descriptions`

This rule will validate that all enum values have a description.

### `enum-values-sorted-alphabetically`

This rule will validate that all enum values are sorted alphabetically.

### `fields-are-camel-cased`

This rule will validate that object type field and interface type field names are camel cased.

### `fields-have-descriptions`

This rule will validate that object type fields and interface type fields have a description.

### `input-object-values-are-camel-cased`

This rule will validate that input object value names are camel cased.

### `input-object-values-have-descriptions`

This rule will validate that input object values have a description.

### `types-are-capitalized`

This rule will validate that interface types and object types have capitalized names.

### `types-have-descriptions`

This will will validate that interface types, object types, union types, scalar types, enum types and input types have descriptions.

## Output formatters

The format of the output can be controlled via the `--format` option.

The following formatters are currently available: `text`, `json`.

### `TextFormatter` (default)

Sample output:

```
5:1 The object type `QueryRoot` is missing a description.  types-have-descriptions
6:3 The field `QueryRoot.a` is missing a description.      fields-have-descriptions

2 errors detected
```

Each error is prefixed with the line number and column the error occurred on.

### `JSONFormatter`

Sample output:

```json
{
  "errors": [
    {
      "message": "The object type `QueryRoot` is missing a description.",
      "location": {
        "line": 5,
        "column": 1,
        "file": "schema.graphql"
      },
      "rule": "types-have-descriptions"
    },
    {
      "message": "The field `QueryRoot.a` is missing a description.",
      "location": {
        "line": 6,
        "column": 3,
        "file": "schema.graphql"
      },
      "rule": "fields-have-descriptions"
    }
  ]
}
```

## Exit codes

Verifying the exit code of the `graphql-schema-lint` process is a good way of programmatically knowing the
result of the validation.

If the process exits with `0` it means all rules passed.

If the process exits with `1` it means one or many rules failed. Information about these failures can be obtained by
reading the `stdout` and using the appropriate output formatter.

If the process exits with `2` it means an invalid configuration was provided. Information about this can be obtained by
reading the `stderr`.

If the process exits with `3` it means an uncaught error happened. This most likely means you found a bug.
