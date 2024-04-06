import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { version } from "../package.json";
import { join } from "path";

function runApp(argument: string) {
  const app = join(__dirname, "..", "bin", "index.js");
  return execSync(`node ${app} ${argument}`, { stdio: "pipe" })
    .toString()
    .trim();
}

describe("create app cli", () => {
  describe("version flag", () => {
    const testCases = [
      "--version",
      "-v",
      "-v project",
      "-v -t default",
      "-v -t default project",
    ];

    it.each(testCases)("%s", (cmd) => {
      const stdout = runApp(cmd);
      expect(stdout).toBe(version);
    });
  });

  describe("default template", () => {
    const testCases = ["project-name", "project-name -t default"];

    it.each(testCases)("%s", (cmd) => {
      const stdout = runApp(cmd);
      expect(stdout).toBe("Creating project-name with default template...");
    });
  });
});
