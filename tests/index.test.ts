import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { version } from "../package.json";
import { join } from "path";

function runApp(argument: string) {
  const app = join(__dirname, "..", "bin", "index.js");
  let output: Buffer | null = null;
  try {
    output = execSync(`node ${app} ${argument}`);
  } catch (error) {
    output = error.stderr;
  }
  return output?.toString().trim() || "";
}

describe("create app cli", () => {
  describe("print version", () => {
    const testCases = [
      "-v",
      "-v project-name",
      "-v -t default",
      "-v -t default project-name",
      "-v --template default",
      "-v --template default project-name",
      "--version",
      "--version --template default",
      "--version --template default project-name",
    ];

    it.each(testCases)("%s", (cmd) => {
      const output = runApp(cmd);
      expect(output).toBe(version);
    });
  });

  describe("default template", () => {
    const testCases = [
      "project-name",
      "project-name -t default",
      "project-name --template default",
    ];

    it.each(testCases)("%s", (cmd) => {
      const output = runApp(cmd);
      expect(output).toBe("Creating project-name with default template...");
    });
  });

  describe("project name prompt", () => {
    const testCases = ["", "-t default", "--template default"];

    it.each(testCases)("%s", (cmd) => {
      const output = runApp(cmd);
      expect(output).toContain("Project name?");
    });
  });

  describe("project name validation", () => {
    const testCases = [
      "ProjectName",
      "project_name",
      "'project name'",
      "ProjectName -t default",
      "project_name --template default",
    ];

    it.each(testCases)("%s", (cmd) => {
      const output = runApp(cmd);
      expect(output).toBe("Invalid project name");
    });
  });

  describe("template validation", () => {
    const testCases = [
      "project-name -t unknown",
      "project-name --template unknown",
    ];

    it.each(testCases)("%s", (cmd) => {
      const output = runApp(cmd);
      expect(output).toBe("Unsupported template");
    });
  });
});
