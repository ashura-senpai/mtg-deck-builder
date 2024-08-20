import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should validate and return a user', async () => {
            const user = { username: 'test', validatePassword: jest.fn().mockResolvedValue(true) };
            jest.spyOn(usersService, 'findOne').mockResolvedValue(user as any);

            const result = await service.validateUser('test', 'password');
            expect(result).toEqual(user);
        });

        it('should return null if validation fails', async () => {
            jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

            const result = await service.validateUser('test', 'password');
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return a JWT token', async () => {
            const token = 'test-token';
            jest.spyOn(jwtService, 'sign').mockReturnValue(token);

            const result = await service.login({ username: 'test', _id: '1' });
            expect(result).toEqual({ access_token: token });
        });
    });
});
