import cron from "node-cron";
import { deleteOldProjectsService } from "../modules/project/project.service.js";

cron.schedule("0 0 * * *", async () => {
  try {
    await deleteOldProjectsService();
    console.log("Cleanup done");
  } catch (err) {
    console.error("Cleanup cron failed:", err.message);
  }
});