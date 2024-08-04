import { spawn } from "child_process";

export const runProcess = (
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv
): Promise<void> =>
  new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
      stdio: "inherit",
      env: { ...process.env, ...env },
    });

    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });

    childProcess.on("error", (err) => {
      reject(err);
    });
  });
