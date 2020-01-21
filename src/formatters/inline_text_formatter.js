// Text format for easy machine parsing.
import columnify from 'columnify';

export default function InlineTextFormatter(errorsGroupedByFile) {
  const files = Object.keys(errorsGroupedByFile);

  const errorsText = files
    .map(file => {
      return generateErrorsForFile(file, errorsGroupedByFile[file]);
    })
    .join('\n');
  return errorsText + '\n';
}

function generateErrorsForFile(file, errors) {
  const formattedErrors = errors.map(error => {
    const location = error.locations[0];

    return {
      location: `${file}:${location.line}:${location.column}`,
      message: error.message,
      rule: ` ${error.ruleName}`,
    };
  });

  const errorsText = columnify(formattedErrors, {
    showHeaders: false,
  });

  return errorsText;
}
