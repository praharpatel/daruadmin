export interface ILoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface IResultLogin {
  status: boolean;
  message: string;
  token?: string;
}

export interface IRegisterForm {
  email: string;
  password: string;
}
