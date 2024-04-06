import { describe, it, expect, afterEach, beforeAll } from "vitest";
import { execSync } from "child_process";
import { version } from "../package.json";
import { join } from "path";
import { rmSync, readdirSync } from "fs";

const projectName = "tmp";
const generatedProject = join(__dirname, "..", projectName);

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

function cleanup() {
  rmSync(generatedProject, {
    recursive: true,
    force: true,
  });
}

describe("create app cli", () => {
  beforeAll(cleanup);
  afterEach(cleanup);

  describe("print version", () => {
    const testCases = [
      "-v",
      `-v ${projectName}`,
      "-v -t default",
      `-v -t default ${projectName}`,
      "-v --template default",
      `-v --template default ${projectName}`,
      "--version",
      "--version --template default",
      `--version --template default ${projectName}`,
    ];

    it.each(testCases)("%s", (cmd) => {
      const output = runApp(cmd);
      expect(output).toBe(version);
    });
  });

  describe("default template", () => {
    const testCases = [
      `${projectName}`,
      `${projectName} -t default`,
      `${projectName} --template default`,
    ];

    it.each(testCases)("%s", (cmd) => {
      const output = runApp(cmd);
      const files = readdirSync(generatedProject);
      expect(output).toContain("Project created!");
      expect(files.length).toBeTruthy();
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
      `${projectName} -t unknown`,
      `${projectName} --template unknown`,
    ];

    it.each(testCases)("%s", (cmd) => {
      const output = runApp(cmd);
      expect(output).toBe("Unsupported template");
    });
  });
});
