import assert from "assert";
import { parse } from "graphql";
import { validate } from "graphql/validation";
import { buildASTSchema } from "graphql/utilities/buildASTSchema";

import { EnumsSortedAlphabetically } from "../../src/rules/enums_sorted_alphabetically";

describe("EnumsSortedAlphabetically rule", () => {
  it("catches object types that are not sorted alphabetically", () => {
    const ast = getGraphQLAst(`
      enum Stage {
        ZZZ
        AAA
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [EnumsSortedAlphabetically]);

    assert.equal(errors.length, 1);

    assert.equal(errors[0].message, "The enum `Stage` should be sorted alphabetically: ZZZ,AAA");
    assert.deepEqual(errors[0].locations, [{ line: 7, column: 7 }]);
  });

  it("allows enums that are sorted alphabetically ", () => {
    const ast = getGraphQLAst(`
      enum Stage {
        AAA

        ZZZ
      }
    `);

    const schema = buildASTSchema(ast);
    const errors = validate(schema, ast, [EnumsSortedAlphabetically]);

    assert.equal(errors.length, 0);
  });
});

function getGraphQLAst(string) {
  return parse(`
    type QueryRoot {
      a: String
    }

    ${string}

    schema {
      query: QueryRoot
    }
  `);
}
