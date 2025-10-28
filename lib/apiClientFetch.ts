export const apiClientFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/${url}`,
    {
      ...options,
      headers: {
        ...options.headers,
      },
    }
  );
  const data = await response.json();
  return data;
};
