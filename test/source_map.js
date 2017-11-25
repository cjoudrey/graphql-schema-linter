import assert from 'assert';
import { SourceMap } from '../src/source_map';

const sourceFiles = {
  'query.graphql': `type Query {
  a: String!
}`,

  'user.graphql': `type User {
  username: String!
  email: String!
}`,

  'schema.graphql': 'schema { query: Query }',
  'comment.graphql': 'type Comment { user: User! body: String! }',
};

describe('SourceMap', () => {
  describe('getCombinedSource', () => {
    it('returns combined source files', () => {
      const sourceMap = new SourceMap(sourceFiles);

      assert.equal(
        sourceMap.getCombinedSource(),
        `type Query {
  a: String!
}
type User {
  username: String!
  email: String!
}
schema { query: Query }
type Comment { user: User! body: String! }`
      );
    });
  });

  describe('getOriginalPathForLine', () => {
    it('returns the path of the file that contains the source on the specified line number of the combined file', () => {
      const sourceMap = new SourceMap(sourceFiles);

      assert.equal('query.graphql', sourceMap.getOriginalPathForLine(1));
      assert.equal('query.graphql', sourceMap.getOriginalPathForLine(2));
      assert.equal('query.graphql', sourceMap.getOriginalPathForLine(3));
      assert.equal('user.graphql', sourceMap.getOriginalPathForLine(4));
      assert.equal('user.graphql', sourceMap.getOriginalPathForLine(5));
      assert.equal('user.graphql', sourceMap.getOriginalPathForLine(6));
      assert.equal('user.graphql', sourceMap.getOriginalPathForLine(7));
      assert.equal('schema.graphql', sourceMap.getOriginalPathForLine(8));
      assert.equal('comment.graphql', sourceMap.getOriginalPathForLine(9));
    });
  });
});
