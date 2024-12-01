import type {
  Auth0ResponseError,
  Auth0Jwt,
  Auth0UserInfo,
} from '@/types/auth0.js';
import { Either, Left, Right } from '@/utils/either.js';

export class Auth0Service {
  constructor(
    private readonly domain: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly audience?: string,
  ) {}

  public async authenticateUser(email: string, password: string) {
    const response = await this.post('/oauth/token', {
      grant_type: 'password',
      username: email,
      password,
      scope: 'openid profile email offline_access',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
    });

    return this.parseApiResponse<Auth0Jwt>(response);
  }

  public async getUserInfo(accessToken: string) {
    const response = await this.get(
      '/userinfo',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return this.parseApiResponse<Auth0UserInfo>(response);
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

  private post(
    url: string,
    body: Record<string, unknown>,
    options?: Omit<RequestInit, 'method' | 'body'>,
  ) {
    return fetch(`https://${this.domain}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...options,
    });
  }

  private get(
    url: string,
    query: Record<string, string>,
    options?: Omit<RequestInit, 'method'>,
  ) {
    return fetch(
      `https://${this.domain}${url}?${new URLSearchParams(query).toString()}`,
      {
        method: 'GET',
        ...options,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      },
    );
  }
}
