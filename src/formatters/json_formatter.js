export default class {
  constructor(options) {
    this.errors = [];
  }

  start() {

  }

  error(error) {
    this.errors.push({
      message: error.message,
      location: error.locations[0],
    });
  }

  output() {
    return JSON.stringify({ errors: this.errors });
  }
}
