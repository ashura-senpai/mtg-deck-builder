import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/schemas/users.service';
import { UserDocument } from '../users/schemas/users.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username) as UserDocument;
        if (user && await user.validatePassword(pass)) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
