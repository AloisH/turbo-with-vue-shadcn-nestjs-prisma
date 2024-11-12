import { execSync } from "child_process";

export class CleanUp {
  constructor(private readonly paths: string[]) {}

  cleanUp() {
    console.log(`Formatting output`);
    execSync("cd ../../ && pnpm format");
  }
}
