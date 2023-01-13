import { boolean } from "yup";

enum AccountEnum {
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_USER = "ROLE_USER",
  ROLE_MODERATOR = "ROLE_MODERATOR",
}

export interface ILogin {
  message: string;
  object: AccountEnum[];
  success: boolean;
}
