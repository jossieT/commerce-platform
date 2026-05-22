import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(2) firstName: string;
  @ApiProperty() @IsString() @MinLength(2) lastName: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
  @ApiProperty({ required: false }) @IsOptional()
  @Matches(/^\+?[1-9]\d{7,14}$/) phone?: string;
}
