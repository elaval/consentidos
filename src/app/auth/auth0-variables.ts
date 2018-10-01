interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

const BASEHREF = (document.getElementsByTagName('base')[0] || {})['href'];


export const AUTH_CONFIG: AuthConfig = {
  clientID: 'd364BOJ6EpUlT2YoZkuD2vZxF2VcSfj4',
  domain: 'meaningfuldata.auth0.com',
  callbackURL: `${BASEHREF}callback`
};
