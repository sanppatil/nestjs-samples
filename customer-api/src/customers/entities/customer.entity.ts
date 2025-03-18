/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, Min } from 'class-validator';
export class Customer {
  id: number;

  @ApiProperty({ description: 'Customer First Name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Customer Last Name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Customer Email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Customer Age', minimum: 18 })
  @IsInt()
  @Min(18)
  age: number;
}
