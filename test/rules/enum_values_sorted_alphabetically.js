import { EnumValuesSortedAlphabetically } from '../../src/rules/enum_values_sorted_alphabetically';
import { expectFailsRule, expectPassesRule } from '../assertions';

describe('EnumValuesSortedAlphabetically rule', () => {
  it('allows enums that are sorted alphabetically ', () => {
    expectPassesRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        AAA
        ZZZ
      }
    `
    );
  });

  it('catches enums that are not sorted alphabetically', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        ZZZ
        AAA
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      enum Stage {
        AAA
        ZZZ
      }
    `
    );
  });

  it('fixes enums that are not sorted alphabetically, handling spacing neatly', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        ZZZ

        YYY

        AAA
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, YYY, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      enum Stage {
        AAA

        YYY

        ZZZ
      }
    `
    );
  });

  it('fixes enums that are not sorted alphabetically, handling multiple values on one line', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        ZZZ YYY AAA
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, YYY, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      enum Stage {
        AAA YYY ZZZ
      }
    `
    );
  });

  it('fixes enums that are not sorted alphabetically, handling multiple values on one line with commas', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        ZZZ, YYY, AAA
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, YYY, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      enum Stage {
        AAA, YYY, ZZZ
      }
    `
    );
  });

  it('fixes enums that are not sorted alphabetically, handling the whole enum on one line', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage { ZZZ YYY AAA }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, YYY, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      enum Stage { AAA YYY ZZZ }
    `
    );
  });

  it('fixes enums that are not sorted alphabetically, handling descriptions', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        """The letter Z, three times."""
        ZZZ

        """The letter Y, three times."""
        YYY

        """The letter A, three times."""
        AAA
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, YYY, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      enum Stage {
        """The letter A, three times."""
        AAA

        """The letter Y, three times."""
        YYY

        """The letter Z, three times."""
        ZZZ
      }
    `
    );
  });

  it('fixes enums that are not sorted alphabetically, handling simple comments', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage {
        # The letter Z, three times.
        ZZZ

        # The letter Y, three times.
        YYY

        # The letter A, three times.
        AAA
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, YYY, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      enum Stage {
        # The letter A, three times.
        AAA

        # The letter Y, three times.
        YYY

        # The letter Z, three times.
        ZZZ
      }
    `
    );
  });

  it('fixes complex comments on enums that are not sorted alphabetically', () => {
    expectFailsRule(
      EnumValuesSortedAlphabetically,
      `
      enum Stage { # this comment sticks to the open-brace
        # This comment goes with ZZZ
        "Omega, you might say"
        ZZZ  # This one does too

        # This goes with AAA

        # As does this
        """Alpha, or
        a really good grade."""
        AAA  # This stays with AAA too

        # But this sticks to the close-brace
      }
    `,
      [
        {
          message:
            'The enum `Stage` should be sorted alphabetically. Expected sorting: AAA, ZZZ',
          locations: [{ line: 2, column: 7 }],
        },
      ],
      `
      enum Stage { # this comment sticks to the open-brace
        # This goes with AAA

        # As does this
        """Alpha, or
        a really good grade."""
        AAA  # This stays with AAA too

        # This comment goes with ZZZ
        "Omega, you might say"
        ZZZ  # This one does too

        # But this sticks to the close-brace
      }
    `
    );
  });
});
