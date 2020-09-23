import { apiInstance } from "utils/axios";

type Roles = "ROLE_USER";

export interface User {
  id: string;
  name: string;
  password: string;
  role: string;
  admin: boolean;
  projectRole: {
    [key: string]: string;
  };
  lastSignOn?: string;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  url?: string;
  company?: string;
  location?: string;
  email: string;
  root: boolean;
}

export interface JWT {
  jwt: string;
  expires: number;
  username: string;
  role: Roles[];
}

export const login = async (username: string, password: string) =>
  await apiInstance.post<JWT>(
    `/user/authenticate?username=${username}&password=${password}`
  );
