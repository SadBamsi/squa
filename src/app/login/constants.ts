export const LOGIN_SCHEMA = {
  username: "username",
  password: "password",
} as const;

export type LoginFields = typeof LOGIN_SCHEMA;
