export type Account = {
  id: string;
  email: string;
  name: string;
  role: string;
};

declare global {
  namespace Express {
    export interface Request {
      account?: Account;
    }
  }
}
