#!/usr/bin/env node

import { run } from './runner';

const exitCode = run(process.stdout, process.argv);

process.exit(exitCode);
