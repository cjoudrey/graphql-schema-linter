import columnify from 'columnify';
import figures from '../figures';
import chalk from 'chalk';

export default function TextFormatter(errorsGroupedByFile) {
  const files = Object.keys(errorsGroupedByFile);

  const errorsText = files
    .map((file) => {
      return generateErrorsForFile(file, errorsGroupedByFile[file]);
    })
    .join('\n\n');

  const summary = generateSummary(errorsGroupedByFile);

  return errorsText + '\n\n' + summary + '\n';
}

function generateErrorsForFile(file, errors) {
  const formattedErrors = errors.map((error) => {
    const location = error.locations[0];

    return {
      location: chalk.dim(`${location.line}:${location.column}`),
      message: error.message,
      rule: chalk.dim(` ${error.ruleName}`),
    };
  });

  const errorsText = columnify(formattedErrors, {
    showHeaders: false,
  });

  return chalk.underline(file) + '\n' + errorsText;
}

function generateSummary(errorsGroupedByFile) {
  const files = Object.keys(errorsGroupedByFile);

  const errorsCount = files.reduce((sum, file) => {
    return sum + errorsGroupedByFile[file].length;
  }, 0);

  if (errorsCount == 0) {
    return chalk.green(`${figures.tick} 0 errors detected\n`);
  }

  const summary = chalk.red(
    `${figures.cross} ${errorsCount} error` +
      (errorsCount > 1 ? 's' : '') +
      ' detected'
  );

  return summary;
}
