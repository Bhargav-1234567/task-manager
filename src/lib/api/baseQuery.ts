// lib/api/baseQuery.ts
import { 
  fetchBaseQuery, 
  BaseQueryFn, 
  FetchArgs, 
  FetchBaseQueryError 
} from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include', // This ensures cookies are sent with requests
})

export const authBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  
  // If unauthorized, redirect to login
  if (result.error && result.error.status === 401) {
    // For client-side, redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
  
  return result
}