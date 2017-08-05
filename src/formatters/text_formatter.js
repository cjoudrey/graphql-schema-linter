export default function TextFormatter(errors) {
  const errorsText = errors.map((error) => {
    const location = error.locations[0];

    return `${location.line}:${location.column} ${error.message}`;
  });

  var summary;

  if (errors.length == 1) {
    summary = "1 error detected";
  } else {
    summary = `${errors.length} errors detected`;
  }

  return errorsText.join("\n") + "\n" + summary + "\n";
}
