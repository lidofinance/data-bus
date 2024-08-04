import { runLocalNode } from "./lib/local-node";

async function main() {
  await runLocalNode();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
