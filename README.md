# graphql-schema-linter

This package provides a command line tool to validate GraphQL schema definitions against a set of rules.

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

## Current rules

### `DeprecationsHaveAReason`

This rule will validate that all deprecations have a reason.

### `FieldsHaveDescriptions`

This rule will validate that all fields have a description.

### `TypesAreCapitalized`

This rule will validate that interface types and object types have capitalized names.

### `TypesHaveDescriptions`

This will will validate that interface types and object types have descriptions.
