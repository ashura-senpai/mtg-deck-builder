import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDeckDto {
  @IsOptional()
  @IsArray()
  commander?: Record<string, any>[];

  @IsOptional()
  @IsArray()
  cards?: Record<string, any>[];


}
