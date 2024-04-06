import { exec } from "child_process";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import ora from "ora";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

function copy(src: string, dest: string, options?: Record<string, string>) {
  const replaceStrings: Record<string, string> = {
    "[PROJECTNAME]": options?.projectName || "santus-app",
    "[YEAR]": new Date().getFullYear().toString(),
  };

  const stat = statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest, options);
  } else {
    let content = readFileSync(src, { encoding: "utf-8" });
    Object.keys(replaceStrings).forEach((key) => {
      content = content.replaceAll(key, replaceStrings[key]);
    });
    writeFileSync(dest, content);
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

  mkdirSync(destDir, { recursive: true });
  for (const file of readdirSync(srcDir)) {
    const newFile = renameFiles[file] || file;
    const srcFile = resolve(srcDir, file);
    const destFile = resolve(destDir, newFile);
    copy(srcFile, destFile, options);
  }
}

export async function create(projectName: string) {
  const templatePath = join(
    fileURLToPath(import.meta.url),
    "../default-template"
  );
  const projectPath = join(process.cwd(), projectName);

  const spinner = ora().start();
  rmSync(projectPath, { recursive: true, force: true });

  spinner.text = "Creating project folder...";
  mkdirSync(projectPath);

  spinner.text = "Copying files from template...";
  copyDir(templatePath, projectPath, { projectName });

  exec(`git init ${projectPath}`);
  spinner.succeed(`${projectName} created!`);
}
