export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  company: {
    id: number;
    name: string;
  };
};

export type TAuthContextType = {
  user: TUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
