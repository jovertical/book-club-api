import { RegisterFormSchema } from '@/schemas/auth.js';
import { Static } from '@sinclair/typebox';
import { AuthenticationClient, UserInfoClient } from 'auth0';

export class Auth0Service {
  private authenticationClient: AuthenticationClient;
  private userInfoClient: UserInfoClient;

  constructor(
    private readonly domain: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly audience?: string,
  ) {
    this.authenticationClient = new AuthenticationClient({
      clientId: this.clientId,
      domain: this.domain,
      clientSecret: this.clientSecret,
    });

    this.userInfoClient = new UserInfoClient({ domain: this.domain });
  }

  public async createUser(data: Static<typeof RegisterFormSchema>) {
    return this.authenticationClient.database.signUp({
      connection: 'Username-Password-Authentication',
      name: data.name,
      username: data.email,
      email: data.email,
      password: data.password,
    });
  }

  public async authenticateUser(email: string, password: string) {
    return this.authenticationClient.oauth.passwordGrant({
      username: email,
      password,
      scope: 'openid profile email offline_access',
      audience: this.audience,
    });
  }

  public async getUserInfo(accessToken: string) {
    return this.userInfoClient.getUserInfo(accessToken);
  }
}
