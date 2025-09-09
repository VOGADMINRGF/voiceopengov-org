// apps/web/scripts/pii.ensureIndexes.ts
import { config } from "dotenv";
config({ path: ".env.local" }); // lädt apps/web/.env.local

import mongoose from "mongoose";
import UserProfile from "@/models/pii/UserProfile";
import UserDemographics from "@/models/pii/UserDemographics";

async function run() {
  try {
    const uri = process.env.PII_MONGODB_URI;
    const dbName = process.env.PII_DB_NAME;

    if (!uri || !dbName) {
      throw new Error("❌ Missing PII_MONGODB_URI or PII_DB_NAME in .env.local");
    }

    // Verbindung zu PII-Cluster herstellen
    await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 8000,
    });

    // Indexe erstellen
    await Promise.all([
      UserProfile.createIndexes(),
      UserDemographics.createIndexes(),
    ]);

    console.log("✔︎ PII indexes ensured.");
  } catch (err) {
    console.error("❌ Failed to ensure PII indexes:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
