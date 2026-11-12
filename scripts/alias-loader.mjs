import { pathToFileURL } from "node:url";
import { resolve as pathResolve } from "node:path";
import fs from "node:fs";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    let target = pathResolve(process.cwd(), "src", rel);
    if (!fs.existsSync(target)) {
      if (fs.existsSync(target + ".ts")) target = target + ".ts";
      else if (fs.existsSync(target + ".tsx")) target = target + ".tsx";
      else if (fs.existsSync(target + "/index.ts")) target = target + "/index.ts";
    }
    return nextResolve(pathToFileURL(target).href, context);
  }
  return nextResolve(specifier, context);
}
