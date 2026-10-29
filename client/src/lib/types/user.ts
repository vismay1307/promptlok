export type CurrentUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatar: string | null;
  accountStatus: string;
  role: string;
};