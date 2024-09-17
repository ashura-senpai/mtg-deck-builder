import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"


export class LoginUserDTO{
    @IsString()
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @MinLength(6)
    password: string
}