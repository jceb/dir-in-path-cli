#!/usr/bin/env -S deno run --allow-env=PATH --allow-read
// LICENSE: MIT
// Copyright (C) 2021 Jan Christoph Ebersbach. All rights reserved.

import * as path from "https://deno.land/std@0.93.0/path/mod.ts";

const VERSION = "1.0.3"

if (
  Deno.args.length === 1 &&
  ["-v", "--version"].includes(Deno.args[0])
) {
  console.log(VERSION);
  Deno.exit(0);
} else if (Deno.args.length < 1) {
  console.log("Usage: dir-in-path DIR...");
  console.log("exit code 0 if all directories are in $PATH");
  console.log("exit code 1 if not all directories are in $PATH");
  Deno.exit(1);
}

const PATH = Deno.env.get('PATH').split(":");

const normalize = (p) => path.normalize(p).trimEnd(path.sep);

const includes = (list) => (dir) => list.includes(dir);

const inPATH = includes(PATH.map(normalize));

const directoriesNotInPath = Deno.args
  .map((p) => path.resolve(p))
  .map(normalize)
  .filter((dir) => !inPATH(dir));

if (directoriesNotInPath.length > 0) {
  console.log("Directories not found in $PATH:");
  console.log(directoriesNotInPath.join("\n"));
  Deno.exit(1);
}
