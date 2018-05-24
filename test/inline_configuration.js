import assert from 'assert';
import { parse } from 'graphql';
import { extractInlineConfigs } from '../src/inline_configuration';

describe('extractInlineConfigs', () => {
  it('removes Comment tokens that are inline configs', () => {
    const ast = parse(`
      # lint-disable types-have-descriptions
      type Query {
        viewer: User!
      }

      # lint-enable types-have-descriptions
      # User description
      type User {
        email: String! # lint-disable-line fields-have-descriptions
      }
`);

    const previousTokens = astToTokens(ast);
    extractInlineConfigs(ast);
    const afterTokens = astToTokens(ast);

    assert.equal(3, previousTokens.filter(inlineConfigurationToken).length);
    assert.equal(0, afterTokens.filter(inlineConfigurationToken).length);

    assert.equal('<SOF>', afterTokens[0].kind);
    assert.equal('type', afterTokens[0].next.value);
  });

  it('extracts lint-enable configuration', () => {
    const ast = parse(`
      type Query {
        viewer: User!
      }

      # lint-enable types-have-descriptions
      # User description
      type User {
        # lint-enable fields-have-descriptions, types-have-descriptions
        email: String!
      }
`);

    const configs = extractInlineConfigs(ast);

    assert.deepEqual(
      [
        { command: 'enable', rules: ['types-have-descriptions'], line: 6 },
        {
          command: 'enable',
          rules: ['fields-have-descriptions', 'types-have-descriptions'],
          line: 9,
        },
      ],
      configs
    );
  });

  it('extracts lint-disable configuration', () => {
    const ast = parse(`
      type Query {
        viewer: User!
      }

      # lint-disable types-have-descriptions, another-rule
      # User description
      type User {
        # lint-disable fields-have-descriptions
        email: String!
      }
`);

    const configs = extractInlineConfigs(ast);

    assert.deepEqual(
      [
        {
          command: 'disable',
          rules: ['types-have-descriptions', 'another-rule'],
          line: 6,
        },
        { command: 'disable', rules: ['fields-have-descriptions'], line: 9 },
      ],
      configs
    );
  });

  it('extracts lint-disable-line configuration', () => {
    const ast = parse(`
      type Query {
        viewer: User!
      }

      # User description
      type User { # lint-disable-line types-have-descriptions, another-rule
        email: String! # lint-disable-line fields-have-descriptions
      }
`);

    const configs = extractInlineConfigs(ast);

    assert.deepEqual(
      [
        {
          command: 'disable-line',
          rules: ['types-have-descriptions', 'another-rule'],
          line: 7,
        },
        {
          command: 'disable-line',
          rules: ['fields-have-descriptions'],
          line: 8,
        },
      ],
      configs
    );
  });
});

function astToTokens(ast) {
  var tokens = [];
  var token = ast.loc.startToken;

  while (token) {
    tokens.push(token);
    token = token.next;
  }

  return tokens;
}

function inlineConfigurationToken(token) {
  return token.kind == 'Comment' && token.value.startsWith(' lint-');
}
