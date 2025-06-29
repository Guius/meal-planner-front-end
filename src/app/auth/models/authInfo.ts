/**
 * This class represents the data returns from the auth service whenever you login or refresh
 */

export class AuthUser {
  role: string;
  email: string;
  email_verified_date: number;
  first_name: string;
  last_name: string;
  id: string;
  default_currency: string;
  preferred_language: string;
  address: string;

  constructor(
    role: string,
    email: string,
    email_verified_date: string,
    first_name: string,
    last_name: string,
    id: string,
    default_currency: string,
    preferred_language: string,
    address: string
  ) {
    this.role = role;
    this.email = email;
    this.email_verified_date = parseInt(email_verified_date);
    this.first_name = first_name;
    this.last_name = last_name;
    this.id = id;
    this.default_currency = default_currency;
    this.preferred_language = preferred_language;
    this.address = address;
  }
}
export class AuthInfo {
  user: AuthUser;
  access_token_expiry: string;

  constructor(user: AuthUser, access_token_expiry: string) {
    this.user = user;
    this.access_token_expiry = access_token_expiry;
  }
}
