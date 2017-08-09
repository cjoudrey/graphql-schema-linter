export default function JSONFormatter(errors) {
  return JSON.stringify({
    errors: errors.map(error => {
      return {
        message: error.message,
        location: error.locations[0],
      };
    }),
  });
}
