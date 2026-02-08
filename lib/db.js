import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;

let client;
let clientPromise;

if (!uri) {
  throw new Error("Missing MONGODB_URL");
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDB() {
  const client = await clientPromise;
  return client.db();
}
