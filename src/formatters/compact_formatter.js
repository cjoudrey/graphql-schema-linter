// Text format for easy machine parsing.
import columnify from 'columnify';

export default function CompactFormatter(errorsGroupedByFile) {
  const files = Object.keys(errorsGroupedByFile);

  const errorsText = files
    .map((file) => {
      return generateErrorsForFile(file, errorsGroupedByFile[file]);
    })
    .join('\n');
  return errorsText + '\n';
}

function generateErrorsForFile(file, errors) {
  const formattedErrors = errors.map((error) => {
    const location = error.locations[0];
    return `${file}:${location.line}:${location.column} ${error.message} (${error.ruleName})`;
  });

  return formattedErrors.join('\n');
}
