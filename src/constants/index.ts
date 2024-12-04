export const findBookQueryOptions = {
  columns: {
    id: true,
    title: true,
    info: true,
    createdAt: true,
    updatedAt: true,
  },
  with: {
    author: {
      columns: {
        name: true,
        bio: true,
      },
    },
    genres: {
      columns: {
        bookId: true,
        genreId: true,
      },
      with: {
        genre: {
          columns: {
            name: true,
            description: true,
          },
        },
      },
    },
  },
} as const;

export const findAuthorQueryOptions = {
  columns: {
    id: true,
    name: true,
    bio: true,
    createdAt: true,
    updatedAt: true,
  },
} as const;
