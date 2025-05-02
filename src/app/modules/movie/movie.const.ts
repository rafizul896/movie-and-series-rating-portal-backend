export const movieFilterableFields =  [
    { field: 'genres', operator: 'hasSome' },
    { field: 'platforms', operator: 'hasSome' },
    { field: 'releaseYear', operator: 'equals' },
    { field: 'title', operator: 'contains' },
  ];

export const movieSearchAbleFields = ['genres', 'platforms', 'releaseYear'];