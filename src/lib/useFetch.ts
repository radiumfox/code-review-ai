import { useCallback, useEffect, useRef, useState } from 'react';

export function useFetch<T>(
  url: string,
  options: RequestInit
) {
  const [state, setState] = useState<{
        loading: boolean;
        data?: T;
        error?: string
    }>({ loading: false });

  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  const fetchData = useCallback(async () => {
    setState({ loading: true });

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error ?? 'Error fetching data';
        setState({ loading: false, error: errorMessage });

        console.error(responseData);
        return;
      }

      setState({
        loading: false,
        data: responseData as T
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching data';
      setState({ loading: false, error: errorMessage });

      console.error(error);
    }
  }, [url, options]);

  return {
    ...state,
    fetchData
  };
}