import { Expose, Exclude } from 'class-transformer';

export class JwtDto {
  @Expose()
  access_token: string;

  @Exclude()
  scope: string;

  @Expose()
  expires_in: number;

  @Expose()
  token_type: string;
}
