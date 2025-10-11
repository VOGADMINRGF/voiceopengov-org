import { getDb } from "@core/db/triMongo";
export async function connectDB() { try { return await getDb("core"); } catch { return null as any; } }
export default connectDB;