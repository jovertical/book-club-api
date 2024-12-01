import { Expose, Exclude } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Exclude()
  auth0Id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  created_at: string;

  @Exclude()
  updated_at: string;
}
