import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  throw new Error('Missing MongoDB URI environment variable');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const MONGOOSE_CACHE = Symbol.for('mongoose-cache');

function getGlobalCache() {
  return (
    globalThis as Record<symbol, CachedConnection>
  )[MONGOOSE_CACHE];
}

function setGlobalCache(value: CachedConnection) {
  (globalThis as Record<symbol, CachedConnection>)[MONGOOSE_CACHE] = value;
}

export const connectToDatabase = async() => {
  let cached = getGlobalCache();

  if (!cached) {
    cached = { conn: null, promise: null };
    setGlobalCache(cached);
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

