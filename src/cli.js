#!/usr/bin/env node

import { run } from './runner';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2), {
  string: ["format"],
  boolean: ["stdin"],
  default: {format: "text"},
});

run(argv);
