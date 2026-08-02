import { connectToDatabase } from '@/lib/server';

export async function register() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Failed to connect to MongoDB at startup:', error);
  }
}
