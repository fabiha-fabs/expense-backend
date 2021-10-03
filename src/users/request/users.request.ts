import {  IsEmail, isEmail, IsNotEmpty, IsOptional, Length } from "class-validator";


export class UserCreateRequest {

    @IsNotEmpty()
    userName: string;
 
    @IsNotEmpty()
    @Length(3, 5)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    emailId: string;

    @IsOptional()
    contactNo: string;

    @IsOptional()
    country: string;

  }

  export class UserFilterRequest{
    perPageDataCnt: number;
    pageNumber: number;
    userName?: string;
    emailId?: string;
    contactNo?: string;
    country?: string;
  }

  export class UserUpdateRequest {


    userName: string;
 
    @Length(3, 5)
    password: string;


    @IsEmail()
    emailId: string;


    contactNo: string;

    country: string;

  }