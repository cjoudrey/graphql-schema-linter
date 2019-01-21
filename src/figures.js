const { platform } = process;

const main = {
  tick: '✔',
  cross: '✖',
  warning: '⚠',
};

const windows = {
  tick: '√',
  cross: '×',
  warning: '‼',
};

const figures = platform === 'win32' ? windows : main;

module.exports = figures;
