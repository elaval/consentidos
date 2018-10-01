interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'd364BOJ6EpUlT2YoZkuD2vZxF2VcSfj4',
  domain: 'meaningfuldata.auth0.com',
  callbackURL: 'http://localhost:4300/callback'
};
