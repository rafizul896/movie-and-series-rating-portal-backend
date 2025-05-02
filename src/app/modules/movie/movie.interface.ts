export type TMovieFilterRequest = {
    genres?: string | undefined;
    platforms?: string | undefined;
    rating?: number | undefined;
    searchTerm?: string | string[] | number  | undefined;
}