export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export type LoadingErrors =
  | 'there is no posts'
  | 'Something went wrong, please try again'
  | '';
