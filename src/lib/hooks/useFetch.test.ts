import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFetch } from '@/lib/hooks/useFetch';
import { ERROR_CODES, FALLBACK_STATUS_CODE, STATUS_CODE_BY_CODE } from '@/lib/api/errors';

const TEST_ENDPOINT = '/api/data';

type ResolveFunction<T> = (value: (T | PromiseLike<T>)) => void;

function createDeferred<T>() {
  let resolve: ResolveFunction<T> = (value) => {};

  const promise = new Promise<T>((result) => { resolve = result; });

  return { promise, resolve };
}

describe('useFetch', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading state', () => {
    test('Starts as false', () => {
      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      expect(result.current.loading).toBe(false);
    });

    test('Becomes true when executeFetch is called and false after completion', async () => {
      const deferred = createDeferred<{
        ok: boolean;
        json: () => Promise<{ title: string }>
      }>();

      fetchMock.mockReturnValue(deferred.promise);

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));

      act(() => {
        result.current.executeFetch();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      await act(async () => {
        deferred.resolve({
          ok: true,
          json: () => Promise.resolve({ title: 'test' }),
        });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Error state', () => {
    test('Starts as null', () => {
      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      expect(result.current.error).toBeNull();
    });

    test('Sets error when response is not ok', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ error: 'Resource not found' }),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(result.current.error).toEqual({
          message: 'Resource not found',
          code: ERROR_CODES.NOT_FOUND,
          statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.NOT_FOUND],
          ok: false,
        });
      });
    });

    test('Sets error when fetch throws', async () => {
      fetchMock.mockRejectedValue(new Error('Network failure'));

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(result.current.error).toEqual({
          message: 'Network failure',
          code: ERROR_CODES.NETWORK,
          statusCode: FALLBACK_STATUS_CODE,
          ok: false,
        });
      });
    });

    test('Sets default message when error is not an Error instance', async () => {
      fetchMock.mockRejectedValue('something');

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(result.current.error).toEqual({
          message: 'Something went wrong',
          code: ERROR_CODES.UNKNOWN,
          statusCode: FALLBACK_STATUS_CODE,
          ok: false,
        });
      });
    });

    test('Clears previous error on subsequent success', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
          json: () => Promise.resolve({ error: 'fail' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: 'ok' }),
        });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));

      await result.current.executeFetch();

      await waitFor(() => {
        expect(result.current.error).toEqual({
          message: 'fail',
          code: ERROR_CODES.INTERNAL_SERVER,
          statusCode: STATUS_CODE_BY_CODE[ERROR_CODES.INTERNAL_SERVER],
          ok: false,
        });
      });

      await result.current.executeFetch();
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('Data', () => {
    test('Starts as undefined', () => {
      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      expect(result.current.data).toBeUndefined();
    });

    test('Sets data on successful response', async () => {
      const payload = { title: 'test', count: 42 };
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(payload),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(payload);
      });
    });

    test('Does not set data on error response', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ error: 'bad' }),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(result.current.data).toBeUndefined();
      });
    });
  });

  describe('Params and searchParams', () => {
    test('Sends params as JSON body for non-GET requests', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'POST'));
      const body = { name: 'Alice', role: 'admin' };
      await result.current.executeFetch(body);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          TEST_ENDPOINT,
          expect.objectContaining({ body: JSON.stringify(body) })
        );
      });
    });

    test('Does not send body for GET requests', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch({ id: '1' });

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          TEST_ENDPOINT,
          expect.not.objectContaining({ body: expect.anything() })
        );
      });
    });

    test('Appends searchParams to URL', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      const { result } = renderHook(() => useFetch('/api/search', 'GET'));
      await result.current.executeFetch(undefined, { q: 'hello', page: '2' });

      await waitFor(() => {
        const calledUrl = fetchMock.mock.calls[0][0];
        expect(calledUrl).toBe('/api/search?q=hello&page=2');
      });
    });

    test('Works with both params and searchParams on POST', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ created: true }),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'POST'));
      await result.current.executeFetch(
        { name: 'widget' },
        { ref: 'abc' }
      );

      await waitFor(() => {
        const [calledUrl, init] = fetchMock.mock.calls[0];
        expect(calledUrl).toContain(`${TEST_ENDPOINT}?ref=abc`);
        expect(JSON.parse(init.body)).toEqual({ name: 'widget' });
      });
    });
  });

  describe('Url', () => {
    test('Passes the URL directly to fetch', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(TEST_ENDPOINT, expect.anything());
      });
    });

    test('Uses the full URL when searchParams are provided', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch(undefined, { sort: 'desc' });

      await waitFor(() => {
        const calledUrl = fetchMock.mock.calls[0][0];
        expect(calledUrl).toBe(`${TEST_ENDPOINT}?sort=desc`);
      });
    });
  });

  describe('Method', () => {
    test('Passes GET method to fetch', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          TEST_ENDPOINT,
          expect.objectContaining({ method: 'GET' })
        );
      });
    });

    test('Passes POST method to fetch', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'POST'));
      await result.current.executeFetch({ key: 'value' });

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          TEST_ENDPOINT,
          expect.objectContaining({ method: 'POST' })
        );
      });
    });

    test('Passes DELETE method to fetch', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'DELETE'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          TEST_ENDPOINT,
          expect.objectContaining({ method: 'DELETE' })
        );
      });
    });
  });

  describe('Headers', () => {
    test('Includes default content-type header', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() => useFetch(TEST_ENDPOINT, 'GET'));
      await result.current.executeFetch();

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          TEST_ENDPOINT,
          expect.objectContaining({
            headers: expect.objectContaining({
              'content-type': 'application/json',
            }),
          })
        );
      });
    });

    test('Merges custom headers with default content-type', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const customHeaders = { Authorization: 'Bearer token123' };

      const { result } = renderHook(() =>
        useFetch(TEST_ENDPOINT, 'GET', customHeaders)
      );

      await result.current.executeFetch();

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          TEST_ENDPOINT,
          expect.objectContaining({
            headers: {
              'content-type': 'application/json',
              Authorization: 'Bearer token123',
            },
          })
        );
      });
    });

    test('Allows overriding default content-type via custom headers', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const customHeaders = { 'content-type': 'text/plain' };

      const { result } = renderHook(() =>
        useFetch(TEST_ENDPOINT, 'GET', customHeaders)
      );
      await result.current.executeFetch();

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          TEST_ENDPOINT,
          expect.objectContaining({
            headers: { 'content-type': 'text/plain' },
          })
        );
      });
    });
  });
});
