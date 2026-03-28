import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const digioApi = createApi({
  reducerPath: 'digioApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    ocrIdCardApi: builder.mutation({
      query: (data) => ({
        url: '/digio-ocr',
        method: 'POST',
        body: data,
      }),
    })
  }),
})

export const { useOcrIdCardApiMutation } = digioApi
