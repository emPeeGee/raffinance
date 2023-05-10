export interface RegistrationModel {
  username: string;
  password: string;
  email: string;
  name: string;
  phone: string;
}

export interface CredentialsModel {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface UserModel {
  name: string;
  username: string;
  email: string;
  phone: string;
  latestLogins: [string];
  createdAt: string;
  updatedAt: string;
}
