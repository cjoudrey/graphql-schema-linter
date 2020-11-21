import { TokenKind } from 'graphql/language/tokenKind';

// Return the start-character-offset of the logical-block, for re-ordering
// purposes, containing this node, defined as the end of the last token on the
// line containing the most recent non-comment token.  For more context see
// comments near blockBoundaries, below.
function blockStart(node) {
  let token = node.loc.startToken;
  if (token == null) {
    return node.loc.start;
  }

  // walk to just after the next non-comment token
  while (token.prev && token.prev.kind === TokenKind.COMMENT) {
    token = token.prev;
  }

  const line = token.line;
  if (token.prev && token.prev.line === line) {
    // if there are other tokens on the same line, walk back forwards to
    // the end of that line if needed.
    while (token && token.kind === TokenKind.COMMENT && token.line === line) {
      token = token.next;
    }
  }

  return token.prev.end;
}

// Return the end-character-offset of the logical-block, for re-ordering
// purposes, containing this node, defined as the end of the last token before
// the next newline or non-comment token.  For more context see comments near
// blockBoundaries, below.
function blockEnd(node) {
  let token = node.loc.endToken;
  if (token == null) {
    return node.loc.end;
  }

  const line = token.line;
  while (
    token.next &&
    token.next.kind === TokenKind.COMMENT &&
    token.next.line === line
  ) {
    token = token.next;
  }

  let end = token.end;
  while ('\r\n'.includes(node.loc.source.body[end + 1])) {
    end++;
  }

  return end;
}

/**
 * Return information about how a list of nodes should be sorted.
 *
 * Determining if the list is sorted is fairly easy; the complex part of this
 * is constructing the fixed text, which requires moving comments and
 * whitespace around too.  The details of the algorithm are discussed inline.
 *
 * Arugments:
 *  nodes: a list of GraphQL nodes
 *  nameFunc: a function to get the name of each node, e.g. n => n.name.value.
 *
 * Returns: {isSorted: true} if the list is sorted correctly, or
 * {
 *  isSorted: false,
 *  sortedNames: String[],
 *  fix: <as for ValidationError>,
 * }
 * if not.
 */
export default function alphabetizeNodes(nodes, nameFunc) {
  if (nodes.length < 1) {
    return { isSorted: true };
  }

  const withIndices = nodes.map((node, i) => {
    return { node, index: i, name: nameFunc(node) };
  });
  withIndices.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });

  if (withIndices.every((item, i) => item.index === i)) {
    return { isSorted: true };
  }

  const sortedNames = withIndices.map((item) => item.name);

  // Now construct the fix.  We need to move each node's comments and
  // whitespace along with it, so we find the boundaries of the "blocks"
  // containing each node, and manipulate those blocks instead.  The blocks
  // include the full-line comments preceding the node, and any comments on
  // the same line following the node.  We also attach newlines to the
  // preceding node.
  const blockBoundaries = [blockStart(nodes[0])];
  blockBoundaries.push(...nodes.map(blockEnd));
  const blocks = blockBoundaries
    .slice(0, -1)
    .map((start, i) =>
      nodes[i].loc.source.body.slice(start, blockBoundaries[i + 1])
    );

  // The block-based approach doesn't do a great job with the whitespace at
  // the start and end of the list.  (This is relevant when you have, for
  // example, a double-newline in between elements, and a single-newline
  // before the first and after the last.)  So we swap the old and new last
  // blocks' trailing whitespace (including commas), and similarly for
  // the first blocks' leading whitespace.
  // See examples in test/rules/enum_values_sorted_alphabetically.js.
  const getTrailingNewlines = (text) => text.match(/[ ,\r\n]*$/)[0];
  const oldLastIndex = blocks.length - 1;
  const newLastIndex = withIndices[oldLastIndex].index;
  const oldLastBlock = blocks[oldLastIndex];
  const newLastBlock = blocks[newLastIndex];
  blocks[oldLastIndex] =
    oldLastBlock.replace(/[ ,\r\n]*$/, '') + getTrailingNewlines(newLastBlock);
  blocks[newLastIndex] =
    newLastBlock.replace(/[ ,\r\n]*$/, '') + getTrailingNewlines(oldLastBlock);

  const getLeadingNewlines = (text) => text.match(/^[ ,\r\n]*/)[0];
  const oldFirstIndex = 0;
  const newFirstIndex = withIndices[0].index;
  const oldFirstBlock = blocks[oldFirstIndex];
  const newFirstBlock = blocks[newFirstIndex];
  blocks[oldFirstIndex] =
    getLeadingNewlines(newFirstBlock) + oldFirstBlock.replace(/^[ ,\r\n]*/, '');
  blocks[newFirstIndex] =
    getLeadingNewlines(oldFirstBlock) + newFirstBlock.replace(/^[ ,\r\n]*/, '');

  // Finally, assemble the fix!
  const loc = { start: blockBoundaries[0], end: blockBoundaries[nodes.length] };
  const replacement = withIndices.map((item) => blocks[item.index]).join('');

  return {
    isSorted: false,
    sortedNames,
    fix: { loc, replacement },
  };
}
