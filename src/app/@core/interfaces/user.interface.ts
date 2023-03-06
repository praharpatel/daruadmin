export interface IUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  registerdate?: string;
  role?: string;
  stripeCustomer?: string;
  active: boolean;
}
