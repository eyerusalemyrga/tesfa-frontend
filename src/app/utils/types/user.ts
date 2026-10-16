export type UserType = "Admin" | "Health Professional";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  user_type: UserType;
  country: string;
  organization: string;
  image: string | null;
  is_active: boolean;
  date_joined: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface SignUpData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  country: string;
  organization: string;
}
