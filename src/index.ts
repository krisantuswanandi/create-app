import { Command } from "commander";
import prompts from "prompts";
import { version } from "../package.json";

async function inputProjectName() {
  const response = await prompts({
    type: "text",
    name: "value",
    message: "Project name?",
    validate(val: string) {
      if (!val) return "Project name is required";
      if (!val.match(/^[a-z0-9-]+$/)) return "Invalid project name";
      return true;
    },
  });

  if (!response.value) {
    console.log("Operation cancelled");
    process.exit(0);
  }

  return response.value as string;
}

async function inputTemplate() {
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Template?",
    choices: [
      { title: "Default", value: "default" },
      { title: "User Script", value: "user-script" },
    ],
  });

  if (!response.value) {
    console.log("Operation cancelled");
    process.exit(0);
  }

  return response.value as string;
}

export async function run(args: string[]) {
  const program = new Command();
  program
    .name("create-app")
    .argument("[name]", "Project name")
    .option("-t, --template <name>", "Choose template")
    .option("-v, --version", "Show version")
    .parse(args);

  const options = program.opts();

  if (options.version) {
    console.log(version);
    process.exit(0);
  }

  let projectName = program.args[0];
  let template = options.template;

  if (!projectName) {
    projectName = await inputProjectName();
  } else if (!projectName.match(/^[a-z0-9-]+$/)) {
    console.error("Invalid project name");
    process.exit(1);
  } else if (!template) {
    template = "default";
  }

  if (!template) {
    template = await inputTemplate();
  } else if (!["default", "user-script"].includes(template)) {
    console.error("Unsupported template");
    process.exit(1);
  }

  console.log(`Creating ${projectName} with ${template} template...`);
}
