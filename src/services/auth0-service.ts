import type { Auth0ResponseError, Auth0Jwt } from '@/types/auth0.js';
import { Either, Left, Right } from '@/utils/either.js';

export class Auth0Service {
  constructor(
    private readonly domain: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly audience: string,
  ) {}

  public async authenticateUser(email: string, password: string) {
    const response = await this.post('/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username: email,
      password,
      realm: 'Username-Password-Authentication',
      audience: this.audience,
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
    });

    return this.parseApiResponse<Auth0Jwt>(response);
  }

  private async parseApiResponse<T>(
    response: Response,
  ): Promise<Either<{ status_code: number } & Auth0ResponseError, T>> {
    const json = await response.json();

    if (!response.ok && 'error' in json) {
      return new Left({
        status_code: response.status,
        ...(json as Auth0ResponseError),
      });
    }

    return new Right(json as T);
  }

  private post(url: string, body: Record<string, unknown>) {
    return fetch(`https://${this.domain}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
}
