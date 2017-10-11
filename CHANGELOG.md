# Changelog

### Breaking changes

### Deprecations

### New features

### Bug fixes

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
