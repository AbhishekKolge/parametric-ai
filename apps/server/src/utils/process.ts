import { disconnectDB } from "@parametric-ai/db";

export const shutdown = () => {
  process.stdout.write("Disconnecting from database...\n");
  disconnectDB();
  process.exit();
};
