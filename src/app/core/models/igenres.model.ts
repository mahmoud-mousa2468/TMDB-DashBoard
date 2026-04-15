export interface IGenresResponse {
  genres: MovieGenre[];
}

export interface MovieGenre {
  id: number;
  name: string;
}