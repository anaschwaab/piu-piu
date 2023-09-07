export type User = {
  handle: string;
  name: string;
  image_url: string;
  verified?: boolean;
  description?: string;
  posts?: number;
};

export interface LoginProps {
  handle: string,
  password: string
}

export interface RegisterProps {
  name: string,
  handle: string, 
  password: string
}