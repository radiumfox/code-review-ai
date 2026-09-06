import { describe, expect, test, vi, beforeEach } from 'vitest';

const mockConnect = vi.fn();
const MONGOOSE_CACHE = Symbol.for('mongoose-cache');

const TEST_MONGODB_URI = 'mongodb://localhost:27017/test';
const TEST_RESOLVED_VALUE = 'fake-connection';
const TEST_CONNECTION_ERROR = 'connection refused';

vi.mock('mongoose', () => ({
  default: { connect: mockConnect }
}));

beforeEach(() => {
  vi.resetModules();
  delete (globalThis as Record<symbol, unknown>)[MONGOOSE_CACHE];
});

describe('MongoDB connection', () => {
  test('No MONGODB_URI - throws at import', async() => {
    delete process.env.MONGODB_URI;
    vi.resetModules();

    await expect(import('./mongoose')).rejects.toThrow('Missing MongoDB URI environment variable');
  });

  test('First call - calls mongoose.connect and returns connection', async() => {
    process.env.MONGODB_URI = TEST_MONGODB_URI;

    mockConnect.mockResolvedValue(TEST_RESOLVED_VALUE);
    vi.resetModules();

    const { connectToDatabase } = await import('./mongoose');
    const result = await connectToDatabase();

    expect(mockConnect).toHaveBeenCalledWith(TEST_MONGODB_URI, { bufferCommands: false });
    expect(result).toBe(TEST_RESOLVED_VALUE);
  });

  test('Second call - returns cached connection, no second connect call', async() => {
    process.env.MONGODB_URI = TEST_MONGODB_URI;

    mockConnect.mockResolvedValue(TEST_RESOLVED_VALUE);
    vi.resetModules();

    const { connectToDatabase } = await import('./mongoose');
    await connectToDatabase();
    mockConnect.mockClear();

    const result = await connectToDatabase();
    expect(mockConnect).not.toHaveBeenCalled();
    expect(result).toBe(TEST_RESOLVED_VALUE);
  });

  test('Connection error - clears cache, re-throws', async () => {
    process.env.MONGODB_URI = TEST_MONGODB_URI;

    mockConnect.mockRejectedValueOnce(new Error(TEST_CONNECTION_ERROR));
    vi.resetModules();

    const { connectToDatabase } = await import('./mongoose');

    await expect(connectToDatabase()).rejects.toThrow(TEST_CONNECTION_ERROR);
  });
});
