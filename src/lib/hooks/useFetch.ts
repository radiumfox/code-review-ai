import { useCallback, useEffect, useRef, useState } from 'react';
import { toApiError } from '@/lib/api/errors';
import { isApiFailure, isApiSuccess } from '@/lib/api/result';
import type { ApiError } from '@/lib/api/errors';

export function useFetch<P extends object, T = unknown>(
  url: string,
  method: string,
  headers?: Record<string, string>
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  const executeFetch = useCallback(async (
    params?: P,
    searchParams?: Record<string, string>
  ) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchUrl = searchParams
      ? `${url}?${new URLSearchParams(searchParams)}`
      : url;

    const isGet = method?.toUpperCase() === 'GET';

    try {
      const response = await fetch(
        fetchUrl, {
          method,
          ...(isGet ? {} : { body: JSON.stringify(params) }),
          signal: controller.signal,
          headers: {
            'content-type': 'application/json',
            ...headers
          }
        });

      const responseData: unknown = await response.json().catch(() => null);

      if (isApiFailure(responseData)) {
        setError(responseData);

        console.error(responseData);
        return;
      }

      if (isApiSuccess<T>(responseData)) {
        setData(responseData.data);
        return;
      }

      const apiError = toApiError({
        ...(typeof responseData === 'object' && responseData !== null ? responseData : {}),
        statusCode: response.status,
      });

      setError(apiError);

      console.error(apiError);
    } catch (error) {
      setError(toApiError(error));

      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [url, method, headers]);

  return {
    executeFetch,
    loading,
    error,
    data,
    setError
  };
}