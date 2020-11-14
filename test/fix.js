import assert from 'assert';
import { parse } from 'graphql';
import { loadSchema } from '../src/schema.js';
import { fixSchema } from '../src/fix.js';
import { ValidationError } from '../src/validation_error.js';

function assertItemsEqual(expected, actual) {
  expected = expected.slice();
  actual = actual.slice();
  expected.sort();
  actual.sort();
  assert.deepEqual(expected, actual);
}

describe('fixSchema', () => {
  it('applies fixes to a single-file schema', async () => {
    const schemaPath = `${__dirname}/fixtures/schema.graphql`;
    const schema = await loadSchema({ schemaPaths: [schemaPath] });
    const ast = parse(schema.definition);
    const node = ast.definitions[0].fields[0].name;
    const errors = [
      new ValidationError(
        'fake-rule',
        'field-names should be more than one letter',
        [node],
        { loc: node.loc, replacement: 'betterName' }
      ),
    ];

    const fixedPaths = fixSchema(errors, schema.sourceMap);

    const expected = `type Query {\n` + `  betterName: String!\n` + `}\n`;
    assert.deepEqual(Object.keys(fixedPaths), [schemaPath]);
    assert.equal(fixedPaths[schemaPath], expected);
  });

  it('applies fixes to a multi-file schema', async () => {
    const schemaDir = `${__dirname}/fixtures/schema`;
    const schemaGlob = `${schemaDir}/*.graphql`;
    const schema = await loadSchema({ schemaPaths: [schemaGlob] });
    const ast = parse(schema.definition);

    const usernameNode = ast.definitions.find(
      (node) =>
        node.kind === 'ObjectTypeDefinition' && node.name.value === 'User'
    ).fields[0];
    const obviousNode = ast.definitions.find(
      (node) =>
        node.kind === 'ObjectTypeDefinition' && node.name.value === 'Obvious'
    );
    const errors = [
      new ValidationError(
        'fake-rule',
        'this field should be optional',
        [usernameNode],
        { loc: usernameNode.loc, replacement: 'maybeUsername: String' }
      ),
      new ValidationError('fake-rule', "this isn't obvious", [obviousNode], {
        loc: { start: obviousNode.loc.start, end: obviousNode.loc.start },
        replacement: `"""A node with a truly obvious purpose."""\n`,
      }),
    ];

    const fixedPaths = fixSchema(errors, schema.sourceMap);

    const userPath = `${schemaDir}/user.graphql`;
    const expectedUser =
      `type User {\n` +
      `  maybeUsername: String\n` +
      `  email: String!\n` +
      `}\n\n` +
      `extend type Query {\n` +
      `  viewer: User!\n` +
      `}\n`;
    const obviousPath = `${schemaDir}/obvious.graphql`;
    const expectedObvious =
      `"""A node with a truly obvious purpose."""\n` +
      `type Obvious {\n` +
      `  one: String!\n` +
      `  two: Int\n` +
      `}\n\n` +
      `type DontPanic {\n` +
      `  obvious: Boolean\n` +
      `}\n`;

    assertItemsEqual(Object.keys(fixedPaths), [userPath, obviousPath]);
    assert.equal(fixedPaths[userPath], expectedUser);
    assert.equal(fixedPaths[obviousPath], expectedObvious);
  });
});
