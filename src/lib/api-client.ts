 export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  cookies?: string
) {
  // Get token from cookies if not provided
  const token = cookies?.split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1]

  const headers:any = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(`https://your-node-api.com${url}`, {
    ...options,
    headers,
  })
}