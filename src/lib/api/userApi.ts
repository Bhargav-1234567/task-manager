// lib/api/userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { authBaseQuery } from './baseQuery'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: authBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/user/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi