export function extractInlineConfigs(ast) {
  var configurations = [];

  var token = ast.loc.startToken;

  while (token) {
    if (token.kind == 'Comment' && token.value.startsWith(' lint-')) {
      const previousToken = token.prev;
      const nextToken = token.next;

      previousToken.next = nextToken;
      nextToken.prev = previousToken;

      configurations.push(parseInlineComment(token));
    }

    token = token.next;
  }

  return configurations;
}

function parseInlineComment(token) {
  const matches = /^\s{0,}(lint-[^\s]+)(\s(.*))?$/g.exec(token.value);

  switch (matches[1]) {
    case 'lint-enable':
      return {
        command: 'enable',
        rules: parseRulesArg(matches[3]),
        line: token.line,
      };

    case 'lint-disable':
      return {
        command: 'disable',
        rules: parseRulesArg(matches[3]),
        line: token.line,
      };

    case 'lint-disable-line':
      return {
        command: 'disable-line',
        rules: parseRulesArg(matches[3]),
        line: token.line,
      };
  }
}

function parseRulesArg(value) {
  return value.split(/\,\s+/);
}
