# Changelog

## 2.0.2 (May 5th, 2022)

### New features

- Export `ValidationError` to make it easier for folks to write custom rules. [#271](https://github.com/cjoudrey/graphql-schema-linter/pull/271) (Thanks @vvakame)

## 2.0.1 (December 14th, 2020)

### Bug fixes

- Fix a bug that prevented ignoring errors (`--ignore ...`) that originated from custom rules. [#267](https://github.com/cjoudrey/graphql-schema-linter/pull/267) (Thanks @steverice)

## 2.0.0 (December 14th, 2020)

### New rules

- [`interface-fields-sorted-alphabetically`](https://github.com/cjoudrey/graphql-schema-linter#interface-fields-sorted-alphabetically) has been added to validate that interface fields are sorted alphabetically. [#260](https://github.com/cjoudrey/graphql-schema-linter/pull/260) (Thanks @hipper)

### New features

- Rules that previously verified that elements were sorted alphabetically can now be configured to check for lexicographical sort order. This is useful for folks using schema stitching and sorting their schema at runtime using graphql-js' `lexicographicSortSchema`. The sort order can be configured per-rule using the new [`rulesOptions`](https://github.com/cjoudrey/graphql-schema-linter#in-packagejson) ([`--rule-options`](https://github.com/cjoudrey/graphql-schema-linter#usage)) feature and specifying a different `sortOrder`. When unspecified, `sortOrder` will default to the existing behaviour: `alphabetical`. [#256](https://github.com/cjoudrey/graphql-schema-linter/pull/256) (Thanks @dustinsgoodman)

### Bug fixes

- Fix a race condition where writing to stdout on certain platforms / streams would lead to partial results or corrupted JSON. [#262](https://github.com/cjoudrey/graphql-schema-linter/pull/262) (Thanks @steverice)

## 1.0.1 (September 10th, 2020)

### Bug fixes

- Fix a bug that would cause `graphql-schema-linter` to crash when configured via `package.json` and `ignore` config was not set. [#253](https://github.com/cjoudrey/graphql-schema-linter/pull/253) (Thanks @paramjitkaur)

## 1.0.0 (September 6th, 2020)

`graphql-schema-linter` has been in development since August 2017. During that time, 18 people have contributed 131 pull requests that make up the tool that we have today. :tada:

I believe the tool is now stable and can follow semantic versioning.

On that note, the addition or modification of existing rules will be considered a breaking change and thus will require bumping the MAJOR version of the library. By doing this, users of `graphql-schema-linter` won't get caught off guard by those changes.

### New features

- Add support for enabling / disabling rules for parts of the GraphQL schema using the `--ignore` option. This works functionally the same way as inline rule overrides, but is meant to be used when adding comments to the GraphQL schema is not possible. [#240](https://github.com/cjoudrey/graphql-schema-linter) (Thanks @id-ilych)

## 0.5.0 (July 4th, 2020)

### New features

- Add support for enabling / disabling rules for parts of the GraphQL schema using an inline rule override. See [usage information in README.md](https://github.com/cjoudrey/graphql-schema-linter#inline-rule-overrides). [#237](https://github.com/cjoudrey/graphql-schema-linter/pull/237) (Thanks @mshwery)

## 0.4.0 (May 5th, 2020)

### Breaking changes

- Support for comment descriptions were mistakenly dropped in `v0.3.0`. They were re-added in this version. [#230](https://github.com/cjoudrey/graphql-schema-linter/pull/230)

## 0.3.0 (May 4th, 2020)

### Breaking changes

- Support for comment descriptions has been dropped in favor of descriptions defined using strings. [#229](https://github.com/cjoudrey/graphql-schema-linter/pull/229)
- Bumped GraphQL dependency to v15.

## 0.2.6 (April 14th, 2020)

### Bug fixes

- Fix an issue with `--stdin` not working correctly in some cases. [#223](https://github.com/cjoudrey/graphql-schema-linter/pull/223) (Thanks @dnerdy)

## 0.2.5 (April 4th, 2020)

### New features

- Add `arguments-have-descriptions` rule. This rule will validate that all field arguments have a description. [#219](https://github.com/cjoudrey/graphql-schema-linter/pull/219) (Thanks @aldeed)
- Add `descriptions-are-capitalized` rule. This rule will validate that all descriptions, if present, start with a capital letter. [#219](https://github.com/cjoudrey/graphql-schema-linter/pull/219) (Thanks @aldeed)
- Add `input-object-fields-sorted-alphabetically` rule. This rule will validate that all input object fields are sorted alphabetically. [#219](https://github.com/cjoudrey/graphql-schema-linter/pull/219) (Thanks @aldeed)
- Add `type-fields-sorted-alphabetically` rule. This rule will validate that all type object fields are sorted alphabetically. [#219](https://github.com/cjoudrey/graphql-schema-linter/pull/219) (Thanks @aldeed)

## 0.2.4 (January 27th, 2020)

### New features

- Add a third output format named `compact` that can be used in conjunction with programs like `grep`. See [README.md](https://github.com/cjoudrey/graphql-schema-linter#output-formatters) for sample output. [#209](https://github.com/cjoudrey/graphql-schema-linter/pull/209) (Thanks @MatthewRines)

### Bug fixes

- Allow `first` argument to be a non-nullable integer when connection only supports forward pagination. [#203](https://github.com/cjoudrey/graphql-schema-linter/pull/203) (Thanks @swac)
- Allow `last` argument to be a non-nullable integer when connection only supports backward pagination. [#203](https://github.com/cjoudrey/graphql-schema-linter/pull/203) (Thanks @swac)

## 0.2.3 (December 1st, 2019)

### New features

- Add support for `schemaPaths` to be configured via `package.json`. See [README.md](https://github.com/cjoudrey/graphql-schema-linter/blob/5dfe1f0550ac80319b2550ddcaff7535b2ef7ee5/README.md#configuration-file) for examples. [#196](https://github.com/cjoudrey/graphql-schema-linter/pull/196) (Thanks @gagoar)

## 0.2.2 (October 31st, 2019)

### Bug fixes

- Gracefully handle validating schemas that are missing a query root. [#189](https://github.com/cjoudrey/graphql-schema-linter/pull/189)

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
