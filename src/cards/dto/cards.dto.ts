import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateCardDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly type: string;

    @IsInt()
    readonly manaCost: number;

    @IsString()
    @IsOptional()
    readonly description?: string;
}

export class UpdateCardDto {
    @IsString()
    @IsOptional()
    readonly name?: string;

    @IsString()
    @IsOptional()
    readonly type?: string;

    @IsInt()
    @IsOptional()
    readonly manaCost?: number;

    @IsString()
    @IsOptional()
    readonly description?: string;
}
