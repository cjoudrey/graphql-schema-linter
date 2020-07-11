import assert from 'assert';
import { relative as pathRelative } from 'path';
import { loadSchema } from '../src/schema';
import { createReadStream, readFileSync } from 'fs';

describe('loadSchema', () => {
  it('concatenates multiple files when given a glob', async () => {
    const schemaPath = `${__dirname}/fixtures/schema/**/*.graphql`;

    const expectedSchema = `type Comment {
  body: String!
  author: User!
}

# lint-disable fields-have-descriptions
extend type Query {
  comments: [Comment!]!
}
# lint-enable fields-have-descriptions

type Post {
  id: ID!
  title: String! # lint-disable-line fields-have-descriptions
  description: String!
  author: User!
}

type Obvious {
  one: String!
  two: Int
}

type DontPanic {
  obvious: Boolean
}

type Query {
  something: String!
}

schema {
  query: Query
}

type User {
  username: String!
  email: String!
}

extend type Query {
  viewer: User!
}
`;

    const schema = await loadSchema({ schemaPaths: [schemaPath] });
    assert.equal(schema.definition, expectedSchema);
  });

  it('reads schema from file when provided', async () => {
    const fixturePath = `${__dirname}/fixtures/schema.graphql`;
    const schema = await loadSchema({ schemaPaths: [fixturePath] });
    assert.equal(schema.definition, readFileSync(fixturePath).toString('utf8'));
  });

  it('reads schema from stdin when --stdin is set', async () => {
    const fixturePath = `${__dirname}/fixtures/schema.graphql`;
    const stdin = createReadStream(fixturePath);

    const schema = await loadSchema({ stdin: true }, stdin);
    assert.equal(schema.definition, readFileSync(fixturePath).toString('utf8'));
  });

  it('normalizes schema files paths', async () => {
    const fixturePath = `${__dirname}/fixtures/schema.graphql`;
    const duplicatePath = pathRelative(
      process.cwd(),
      `${__dirname}/fixtures/schema.graphql`
    );

    assert.notEqual(fixturePath, duplicatePath);

    const schema = await loadSchema({
      schemaPaths: [fixturePath, duplicatePath],
    });

    assert.equal(schema.definition, readFileSync(fixturePath).toString('utf8'));
  });
});
