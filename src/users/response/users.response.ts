import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserCreateResponse {
  @Expose()
  userName: string;

  @Expose()
  password: string;

  @Expose()
  emailId: string;

  @Expose()
  isActive: boolean;

  @Expose()
  contactNo?: string;

  @Expose()
  country?: string;
}
