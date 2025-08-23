// lib/api/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { authBaseQuery } from './baseQuery'

interface LoginResponse {
  ok: boolean
  message?: string
  user?: {
    id: string
    name: string
    email: string
    avatar: string
    token:string
  }
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: authBaseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginResponse, 
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getSession: builder.query({
      query: () => '/auth/session',
      providesTags: ['Auth'],
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useGetSessionQuery } = authApi