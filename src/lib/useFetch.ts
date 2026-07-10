import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useFetch<P extends object, T = unknown>(
  url: string,
  options?: RequestInit
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

  const memoizedOptions = useMemo(() => options, [options]);

  const executeFetch = useCallback(async (params?: P) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(
        url, {
          ...memoizedOptions,
          body: JSON.stringify(params),
          signal: controller.signal
        });
      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error ?? 'Error fetching data';
        setError(errorMessage);

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
  }, [url, memoizedOptions]);

  return {
    executeFetch,
    loading,
    error,
    data
  };
}