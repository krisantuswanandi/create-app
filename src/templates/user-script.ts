import degit from "degit";

export async function create(projectName: string) {
  const emitter = degit("krisantuswanandi/user-script-boilerplate", {
    force: true,
  });
  return emitter.clone(projectName);
}
