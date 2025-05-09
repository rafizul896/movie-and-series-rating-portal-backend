export type TUser = {
  id: string;
  name: string;
  profileImage?: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  createdAt: string;
  updatedAt: string;
};
