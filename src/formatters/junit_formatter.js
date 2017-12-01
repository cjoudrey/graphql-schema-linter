const escapeHtml = require('escape-html');

export default function JUnitFormatter(errorsGroupedByFile) {
  const files = Object.keys(errorsGroupedByFile);

  var xml = '<?xml version="1.0" encoding="utf-8"?>\n';

  xml = xml + '<testsuites>\n';

  files.forEach(file => {
    var errorsCount = errorsGroupedByFile[file].length;

    xml =
      xml +
      `  <testsuite name="${file}" time="0" tests="${errorsCount}" errors="${errorsCount}">\n`;

    errorsGroupedByFile[file].forEach(error => {
      xml =
        xml +
        `    <testcase name="Line ${error.locations[0].line}, Column ${error
          .locations[0].column}: ${error.ruleName}">\n`;
      xml =
        xml +
        `      <failure type="error">${escapeHtml(error.message)}</failure>\n`;
      xml = xml + `    </testcase>\n`;
    });

    xml = xml + `  </testsuite>\n`;
  });

  xml = xml + '</testsuites>\n';

  return xml;
}
