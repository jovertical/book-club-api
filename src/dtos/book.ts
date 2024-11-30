import { AuthorDto } from '@/dtos/author.js';
import { GenreDto } from '@/dtos/genre.js';
import { Expose, Transform, Type } from 'class-transformer';

export class BookDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  info: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Type(() => AuthorDto)
  author: AuthorDto;

  @Transform(({ value }) => value.map((pivot) => pivot.genre))
  @Type(() => GenreDto)
  genres: GenreDto[];
}
