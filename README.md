# graphql-schema-linter

This package provides a command line tool to validate GraphQL schema definitions against a set of rules.

If you're looking to lint your GraphQL queries, check out this ESLint plugin: [apollographql/eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql).

_This is still work in progress._

## Install

Yarn:

```
yarn global add graphql-schema-linter
```

NPM:

```
npm install -g graphql-schema-linter
```

## Usage

```
Usage: graphql-schema-linter [options] [schema.graphql]

Options:

  --format

    Choose the output format of the report.

    Possible values: json, text

  --stdin

    Schema definition will be read from STDIN instead of specified file.
```

## Output formatters

The format of the output can be controlled via the `--format` option.

The following formatters are currently available:

### `TextFormatter` (default)

Sample output:

```
5:1 The object type `QueryRoot` is missing a description.
6:3 The field `QueryRoot.a` is missing a description.
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
        "column": 1
      }
    },
    {
      "message": "The field `QueryRoot.a` is missing a description.",
      "location": {
        "line": 6,
        "column": 3
      }
    }
  ]
}
```

## Built-in rules

### `DeprecationsHaveAReason`

This rule will validate that all deprecations have a reason.

### `FieldsHaveDescriptions`

This rule will validate that all fields have a description.

### `TypesAreCapitalized`

This rule will validate that interface types and object types have capitalized names.

### `TypesHaveDescriptions`

This will will validate that interface types and object types have descriptions.
