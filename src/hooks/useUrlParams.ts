import { useCallback, useEffect, useState } from 'react';

type QueryDataType = Record<string, string | undefined>

export function useUrlParams() {
  const [queryData, setQueryData] = useState<QueryDataType>({});

  const generateUrlParams = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const newUrl: QueryDataType = {};
    const entries: IterableIterator<[string, string]> = searchParams.entries();
    for (const pair of entries) {
      newUrl[pair[0]] = pair[1];
    }

    setQueryData(newUrl);

  }, []);


  useEffect(() => {
    generateUrlParams();
  }, [generateUrlParams]);

  return { queryData };
}