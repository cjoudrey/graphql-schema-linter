export default function JSONFormatter(errorsGroupedByFile) {
  const files = Object.keys(errorsGroupedByFile);

  var errors = [];

  files.forEach((file) => {
    Array.prototype.push.apply(
      errors,
      errorsGroupedByFile[file].map((error) => {
        return {
          message: error.message,
          location: {
            line: error.locations[0].line,
            column: error.locations[0].column,
            file: file,
          },
          rule: error.ruleName,
        };
      })
    );
  });

  return JSON.stringify({
    errors,
  });
}
