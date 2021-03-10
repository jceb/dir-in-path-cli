#!/usr/bin/env node
// LICENSE: MIT
// Copyright (C) 2021 Jan Christoph Ebersbach. All rights reserved.
"use strict";

const path = require("path");

const VERSION = require("./package.json").version;

if (
  process.argv.length === 3 &&
  ["-v", "--version"].includes(process.argv[2])
) {
  console.log(VERSION);
  process.exit(0);
} else if (process.argv.length < 3) {
  console.log("Usage: dir-in-path DIR...");
  console.log("exit code 0 if all directories are in $PATH");
  console.log("exit code 1 if not all directories are in $PATH");
  process.exit(1);
}

const PATH = process.env.PATH.split(":");

const normalize = (p) => path.normalize(p).trimEnd(path.sep);

const includes = (list) => (dir) => list.includes(dir);

const inPATH = includes(PATH.map(normalize));

const directoriesNotInPath = process.argv
  .slice(2)
  .map((p) => path.resolve(p))
  .map(normalize)
  .filter((dir) => !inPATH(dir));

if (directoriesNotInPath.length > 0) {
  console.log("Directories not found in $PATH:");
  console.log(directoriesNotInPath.join("\n"));
  process.exit(1);
}
