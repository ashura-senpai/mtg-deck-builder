import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/users.schema';
import * as bcrypt from "bcrypt";

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

    async loginUser(username: string, password: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(username);
    
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        console.log('User found:', user);
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        const payload = { username: user.username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
}
