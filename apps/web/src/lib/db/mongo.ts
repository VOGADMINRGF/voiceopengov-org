import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "voiceopengov";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

type MongoGlobal = {
  _mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as MongoGlobal;

const clientPromise = globalForMongo._mongoClientPromise ?? new MongoClient(MONGODB_URI).connect();

if (!globalForMongo._mongoClientPromise) {
  globalForMongo._mongoClientPromise = clientPromise;
}

export async function getMongoClient() {
  return clientPromise;
}

export async function getMongoDb() {
  const client = await clientPromise;
  return client.db(MONGODB_DB);
}
