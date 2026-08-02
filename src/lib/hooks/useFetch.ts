import { useCallback, useEffect, useRef, useState } from 'react';

export function useFetch<P extends object, T = unknown>(
  url: string,
  method: string,
  headers?: Record<string, string>
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>(null);
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

      const responseData = await response.json();

      if (!response.ok) {
        setError(`${response.statusText}: ${responseData.error}`);

        console.error(responseData);
        return;
      }

      setData(responseData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching data';
      setError(errorMessage);

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
