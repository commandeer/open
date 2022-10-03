export interface ITrackable {
  id?: string;

  isActive?: boolean;

  createdAt?: Date;
  createdBy?: any;
  deletedAt?: Date;
  deletedBy?: any;
  updatedAt?: Date;
  updatedBy?: any;
}
