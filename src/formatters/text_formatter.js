import columnify from 'columnify';
import figures from 'figures';
import chalk from 'chalk';

export default function TextFormatter(errors) {
  const formattedErrors = errors.map((error) => {
    const location = error.locations[0];

    return {
      location: chalk.dim(`${location.line}:${location.column*4}`),
      message: error.message,
      // TODO: Add rule name
    }
  });

  if (errors.length == 0) {
    return chalk.green(`${figures.tick} 0 errors detected\n`);
  }

  const summary = chalk.red(`${figures.cross} ${errors.length} error` +
    (errors.length > 1 ? 's' : '') + ' detected');

  const errorsText = columnify(formattedErrors, {
    showHeaders: false,
  })

  return errorsText + "\n\n" + summary + "\n";
}
