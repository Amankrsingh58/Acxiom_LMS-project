import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
  }),
  tagTypes: ["Books", "Members", "Transactions", "Dashboard"],
  endpoints: (builder) => ({

    /* ---------- BOOKS ---------- */
    getBooks: builder.query({
      query: () => "/books",
      providesTags: ["Books"],
    }),

    addBook: builder.mutation({
      query: (data) => ({
        url: "/books",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),

    updateBook: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Books"],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Books"],
    }),

    /* ---------- MEMBERS ---------- */
    getMembers: builder.query({
      query: () => "/members",
      providesTags: ["Members"],
    }),

    addMember: builder.mutation({
      query: (data) => ({
        url: "/members",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Members"],
    }),

    updateMember: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/members/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Members"],
    }),

    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Members"],
    }),

    /* ---------- TRANSACTIONS ---------- */
    getTransactions: builder.query({
      query: () => "/transactions",
      providesTags: ["Transactions"],
    }),

    issueBook: builder.mutation({
      query: (data) => ({
        url: "/transactions/issue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books", "Transactions", "Dashboard"],
    }),

    returnBook: builder.mutation({
      query: (data) => ({
        url: "/transactions/return",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Books", "Transactions", "Dashboard"],
    }),

    /* ---------- DASHBOARD ---------- */
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,

  useGetMembersQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,

  useGetTransactionsQuery,
  useIssueBookMutation,
  useReturnBookMutation,

  useGetDashboardStatsQuery,
} = api;
