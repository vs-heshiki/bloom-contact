export type ContactAttributes = {
  id: number;
  name: string;
  address: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};
