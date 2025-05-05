export const movieSearchAbleFields =  [
    { field: 'genres', operator: 'hasSome' },
    { field: 'platforms', operator: 'hasSome' },
    { field: 'releaseYear', operator: 'equals' },
    { field: 'title', operator: 'contains' },
];

// export const movieSearchAbleFields = ['genres', 'platforms', 'releaseYear'];

// ***************  (get all movie)  ************
// 1. searchTerm => genres, platforms, releaseYear, title(optional)
// 2. filter => genres, platforms, rating
// 3. sortBy => highest-rated, most-reviewed,  latest releases. (i would completed this part today)
// 4. pagination => limit, page, sortBy, sortOrder


// ***************  (get a movie)  ************
// 1. 
// * here  if a user is logged in then pass the userId in the body so that it will fetch single movie data with all approval review + unapproval user review

// * if a user is not logged in then it will fetch single movie data with all approval review only

// 2. review pagination => limit, page, sortBy, sortOrder