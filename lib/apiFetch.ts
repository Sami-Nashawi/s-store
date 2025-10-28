import { cookies } from "next/headers";

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/${url}`,
    {
      ...options,
      headers: {
        ...options.headers,
        Cookie: `token=${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};
