export type Auth0StdResponseErrorCode =
  | 'invalid_request'
  | 'invalid_scope'
  | 'invalid_client'
  | 'requires_validation'
  | 'unauthorized_client'
  | 'access_denied'
  | 'invalid_grant'
  | 'access_denied'
  | 'invalid_grant'
  | 'endpoint_disabled'
  | 'method_not_allowed'
  | 'too_many_requests'
  | 'unsupported_response_type'
  | 'unsupported_grant_type'
  | 'temporarily_unavailable';

export interface Auth0ResponseError {
  error: Auth0StdResponseErrorCode;
  error_description: string;
}

export interface Auth0Jwt {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}
