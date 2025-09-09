// apps/web/src/lib/mongo.ts
// import { MongoClient } from "mongodb";
// const uri = process.env.MONGODB_URI!;
// if (!uri) throw new Error("MONGODB_URI missing");
// let client: MongoClient | null = null;
//export async function getDb() {
//  if (!client) client = new MongoClient(uri);
//  if (!client.topology?.isConnected()) await client.connect();
//  return client.db(); // default DB aus URI
//}


// apps/web/src/lib/mongo.ts
export { getDb, getCol, getMongoClient } from "@/utils/mongoClient";
