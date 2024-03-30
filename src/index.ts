import { Command } from "commander";
import prompts from "prompts";
import ora from "ora";
import path from "path";
import url from "url";
import fs from "node:fs";
import child from "node:child_process";

const program = new Command();
program.parse();

const getProjectName = async () => {
  const projectName = program.args[0];

  if (projectName) {
    return Promise.resolve(projectName);
  } else {
    try {
      const response = await prompts({
        type: "text",
        name: "projectName",
        message: "Project name?",
        validate: (val: string) =>
          val.includes(" ") ? "Cannot contain space" : true,
      });

      return response.projectName as string;
    } catch {
      console.log("Create santus app cancelled");
      return "";
    }
  }
};

function copy(src: string, dest: string, options?: Record<string, string>) {
  const replaceStrings: Record<string, string> = {
    "[PROJECTNAME]": options?.projectName || "santus-app",
    "[YEAR]": new Date().getFullYear().toString(),
  };

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest, options);
  } else {
    let content = fs.readFileSync(src, { encoding: "utf-8" });
    Object.keys(replaceStrings).forEach((key) => {
      content = content.replaceAll(key, replaceStrings[key]);
    });
    fs.writeFileSync(dest, content);
  }
}

function copyDir(
  srcDir: string,
  destDir: string,
  options?: Record<string, string>
) {
  const renameFiles: Record<string, string | undefined> = {
    _gitignore: ".gitignore",
  };

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const newFile = renameFiles[file] || file;
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, newFile);
    copy(srcFile, destFile, options);
  }
}

getProjectName().then((projectName) => {
  if (projectName) {
    const templatePath = path.join(
      url.fileURLToPath(import.meta.url),
      "../..",
      "template"
    );
    const projectPath = path.join(process.cwd(), projectName);

    const spinner = ora().start();
    fs.rmSync(projectPath, { recursive: true, force: true });

    spinner.text = "Creating project folder...";
    fs.mkdirSync(projectPath);

    spinner.text = "Copying files from template...";
    copyDir(templatePath, projectPath, { projectName });

    child.spawnSync("git", ["init", projectPath]);
    spinner.succeed(`${projectName} created!`);
  }
});
