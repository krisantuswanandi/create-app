import { describe, it, expect, vi, afterEach } from "vitest";
import { run } from "../src/index";
import { version } from "../package.json";

async function runApp(argument: string) {
  const args = argument.split(" ");
  return run(["node", "app", ...args]);
}

describe("create app cli", () => {
  const logMock = vi.spyOn(console, "log").mockImplementation(() => undefined);
  const errorMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);
  const exitMock = vi
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

  afterEach(() => {
    logMock.mockReset();
    errorMock.mockReset();
    exitMock.mockReset();
  });

  describe("version flag", () => {
    const testCases = [
      "--version",
      "-v",
      "-v project",
      "-v -t template",
      "-v -t template project",
    ];

    it.each(testCases)("%s", async (cmd) => {
      await runApp(cmd);
      expect(logMock).toHaveBeenCalledOnce();
      expect(logMock).toHaveBeenLastCalledWith(version);
      expect(exitMock).toHaveBeenCalledOnce();
      expect(exitMock).toHaveBeenLastCalledWith(0);
    });
  });
});
