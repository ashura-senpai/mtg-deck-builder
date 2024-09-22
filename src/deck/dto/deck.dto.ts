import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty()
  commander: string;

  @IsArray()
  @IsString({ each: true })
  cards: string[];
}
