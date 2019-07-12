# Changelog

### Breaking changes

### Deprecations

### New features

### Bug fixes

## 0.2.1 (July 12th, 2019)

### Bug fixes

- Catch invalid `--custom-rule-paths` and report them as errors instead of crashing. [#181](https://github.com/cjoudrey/graphql-schema-linter/pull/181) (Thanks @jizhang27)

## 0.2.0 (January 16th, 2019)

### New features

- Add built-in validation for invalid GraphQL schema definitions. Rather than assume GraphQL schemas are valid and crash when they are not, `graphql-schema-linter` will report these errors. [#163](https://github.com/cjoudrey/graphql-schema-linter/pull/163)

## 0.1.6 (May 16th, 2018)

### Bug fixes

- Fixed an issue that caused certain rules to run twice. [#133](https://github.com/cjoudrey/graphql-schema-linter/pull/133)

## 0.1.5 (April 7th, 2018)

### New features

- Add `--old-implements-syntax` option to support the old SDL syntax for `implements`. [#124](https://github.com/cjoudrey/graphql-schema-linter/pull/124). (Thanks @ruiaraujo for initial report.)

## 0.1.4 (April 7th, 2018)

### New features

- Add `relay-connection-arguments-spec` rule. See [README.md](https://github.com/cjoudrey/graphql-schema-linter#relay-connection-arguments-spec) for details. [#116](https://github.com/cjoudrey/graphql-schema-linter/pull/116)

### Bug fixes

- The `fields-are-camel-cased` and `input-object-values-are-camel-cased` rules now allow consecutive capital letters. [#121](https://github.com/cjoudrey/graphql-schema-linter/pull/121) (Thanks @gracenoah)

## 0.1.3 (March 14th, 2018)

### New features

- Add `relay-page-info-spec` rule. See [README.md](https://github.com/cjoudrey/graphql-schema-linter#relay-page-info-spec) for details. [#115](https://github.com/cjoudrey/graphql-schema-linter/pull/115)

## 0.1.2 (March 8th, 2018)

### Bug fixes

- Allow non-null list for `edges` field. [#112](https://github.com/cjoudrey/graphql-schema-linter/pull/112)

## 0.1.1 (February 13th, 2018)

### Bug fixes

- Removed dependency on `graphql-config` until it is actually used.

## 0.1.0 (February 12th, 2018)

### Breaking change

Descriptions must now be defined as strings instead of comments [as outlined in the spec](https://github.com/facebook/graphql/pull/90).

In order to provide a graceful upgrade path, users can use the `--comment-descriptions` option to use the old way of defining descriptions.

More information available in [#95](https://github.com/cjoudrey/graphql-schema-linter/pull/95).

## 0.0.30 (February 12th, 2018)

### Bug fixes

- `defined-types-are-used` should not report errors for `Mutation` as that the naming convention for a schema's mutation root. [#94](https://github.com/cjoudrey/graphql-schema-linter/pull/94)
- `defined-types-are-used` should not report unreferenced types that implement an interface that is used. [#94](https://github.com/cjoudrey/graphql-schema-linter/pull/94)
- Return useful error when --stdin is specified but no schema is provided. [#96](https://github.com/cjoudrey/graphql-schema-linter/pull/96)

## 0.0.29 (February 11th, 2018)

### New features

- Add `relay-connection-types-spec` rule. See [README.md](https://github.com/cjoudrey/graphql-schema-linter#relay-connection-types-spec) for details. (Thanks @ruiaraujo)

### Bug fixes

- Add support for node v6. [#90](https://github.com/cjoudrey/graphql-schema-linter/pull/90) (Thanks @bwillis)
- Fix crash when no schema is provided to the linter. [#88](https://github.com/cjoudrey/graphql-schema-linter/pull/88) (Thanks @ruiaraujo)

## 0.0.28 (January 16th, 2018)

### New features

- Add support for custom rules. [#79](https://github.com/cjoudrey/graphql-schema-linter/pull/79) (Thanks @bwillis)

## 0.0.27 (January 14th, 2018)

### Bug fixes

- Fix crash when duplicate paths are passed to the linter. [#82](https://github.com/cjoudrey/graphql-schema-linter/pull/82) (Thanks @boopathi)

## 0.0.26 (January 10th, 2018)

### New features

- Add `fields-are-camel-cased` rule. [#81](https://github.com/cjoudrey/graphql-schema-linter/pull/81) (Thanks @ruiaraujo)
- Add `input-object-values-are-camel-cased` rule. [#81](https://github.com/cjoudrey/graphql-schema-linter/pull/81) (Thanks @ruiaraujo)

## 0.0.25 (December 8th, 2017)

### Bug fixes

- Validate configuration options and report when they are invalid. [#76](https://github.com/cjoudrey/graphql-schema-linter/pull/76) (Thanks @bwillis)

## 0.0.24 (November 30th, 2017)

### Bug fixes

- Fixed an issue where `--text` formatter was not returning the right `column` for errors. [#74](https://github.com/cjoudrey/graphql-schema-linter/pull/74)

## 0.0.23 (November 28th, 2017)

### New features

- Errors now include the name of the rule that caused the error. [#71](https://github.com/cjoudrey/graphql-schema-linter/pull/71)

## 0.0.22 (November 27th, 2017)

### New features

- Enable [`defined-types-are-used`](https://github.com/cjoudrey/graphql-schema-linter#defined-types-are-used) rule. [#73](https://github.com/cjoudrey/graphql-schema-linter/pull/73) (Thanks @bwillis)

## 0.0.21 (November 26th, 2017)

### Bug fixes

- Fix a crash when running `graphql-schema-linter`. [#68](https://github.com/cjoudrey/graphql-schema-linter/issues/68)

## 0.0.20 (November 26th, 2017)

### New features

- Add `input-object-values-have-descriptions` rule. [#65](https://github.com/cjoudrey/graphql-schema-linter/pull/65)
- Add `enum-values-have-descriptions` rule. [#66](https://github.com/cjoudrey/graphql-schema-linter/pull/66)

## 0.0.19 (November 25th, 2017)

### New features

- The `types-have-descriptions` rule now validates that `union` types have a description. [#56](https://github.com/cjoudrey/graphql-schema-linter/pull/56)
- The `types-have-descriptions` rule now validates that `input` types have a description. [#57](https://github.com/cjoudrey/graphql-schema-linter/pull/57)
- The `types-have-descriptions` rule now validates that `scalar` types have a description. [#60](https://github.com/cjoudrey/graphql-schema-linter/pull/60)
- The `types-have-descriptions` rule now validates that `enum` types have a description. [#61](https://github.com/cjoudrey/graphql-schema-linter/pull/61)
- GraphQL syntax errors will now be reported like other errors instead of crashing. [#59](https://github.com/cjoudrey/graphql-schema-linter/pull/59)

### Bug fixes

- Fix a crash that occured when a `.graphql` file had no line breaks. [#58](https://github.com/cjoudrey/graphql-schema-linter/pull/58)

## 0.0.18 (October 11th, 2017)

- Remove dependency on `git`. [#50](https://github.com/cjoudrey/graphql-schema-linter/pull/50) (Thanks @Caerbannog)

## 0.0.17 (September 10th, 2017)

- Fix broken dependency on `cosmiconfig#3.0`. [#48](https://github.com/cjoudrey/graphql-schema-linter/pull/48) (Thanks @goldcaddy77)

## 0.0.16 (August 29th, 2017)

### Bug fixes

- Fix issue that prevented `graphql-schema-linter` from running on `lts/*` version of node. [#46](https://github.com/cjoudrey/graphql-schema-linter/pull/46) (Thanks @goldcaddy77)

## 0.0.15 (August 28th, 2017)

### Bug fixes

- Fix crash when `graphql-schema-linter` is given an invalid schema. [#42](https://github.com/cjoudrey/graphql-schema-linter/pull/42)

## 0.0.14 (August 27th, 2017)

### Bug fixes

- Do not require descriptions on type extension definitions. [#41](https://github.com/cjoudrey/graphql-schema-linter/pull/41)

## 0.0.13 (August 27th, 2017)

### New features

- Add support for schemas that are split amongst multiple files. [#39](https://github.com/cjoudrey/graphql-schema-linter/pull/39)
- Add what `file` an error occurred in to `JSONFormatter` output. [#39](https://github.com/cjoudrey/graphql-schema-linter/pull/39)

## 0.0.12 (August 16th, 2017)

### New features

- Add `enum-values-all-caps` rule. [#30](https://github.com/cjoudrey/graphql-schema-linter/pull/30) (Thanks @goldcaddy77)

## 0.0.11 (August 15th, 2017)

### Deprecations

- Deprecate `--only` and `--except` in favour of `--rules`. [#29](https://github.com/cjoudrey/graphql-schema-linter/pull/29)

## 0.0.10 (August 15th, 2017)

### New features

- Add ability to configure `graphql-schema-linter` via configuration files. [#26](https://github.com/cjoudrey/graphql-schema-linter/pull/26) (Thanks @goldcaddy77)

## 0.0.9 (August 10th, 2017)

### Bug fixes

- Fix a bug where the wrong location (column/line) was being reported for `DeprecationsHaveAReason` rule. [#13](https://github.com/cjoudrey/graphql-schema-linter/issues/13)
- Fix a bug where the wrong location (column/line) was being reported for `TypesAreCapitalized` rule. [#14](https://github.com/cjoudrey/graphql-schema-linter/issues/14)

## 0.0.8 (August 10th, 2017)

### New features

- Add `defined-types-are-used` rule. [#24](https://github.com/cjoudrey/graphql-schema-linter/pull/24)

## 0.0.7 (August 7th, 2017)

### Deprecations

- Rule names passed to `--only` and `--except` should now be passed in kebab-case instead of UpperCamelCase. [#19](https://github.com/cjoudrey/graphql-schema-linter/pull/19)

## 0.0.6 (August 7th, 2017)

### New features

- Add `EnumValuesSortedAlphabetically` rule. [#15](https://github.com/cjoudrey/graphql-schema-linter/pull/15) (Thanks @goldcaddy77)

## 0.0.5 (August 5th, 2017)

### New features

- Add some color to `--text` output format.

## 0.0.4 (August 4th, 2017)

### New features

- Added `--only` and `--except` to control what rules get used to validate the schema.
- Added `--help` and usage.
- Added `--version` to obtain the version of `graphql-schema-linter`.

## 0.0.3 (August 3rd, 2017)

### New features

- Exit code is `1` when a linter rule failed against the provided schema. Otherwise exit code will be `0`.

## 0.0.2 (August 2nd, 2017)

Bogus test release.

## 0.0.1 (August 2nd, 2017)

Bogus test release.
