import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model } from 'mongoose';

describe('UsersService', () => {
    let service: UsersService;
    let model: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        new: jest.fn().mockResolvedValue({}),
                        constructor: jest.fn().mockResolvedValue({}),
                        find: jest.fn(),
                        create: jest.fn(),
                        exec: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        model = module.get<Model<User>>(getModelToken(User.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const userDTO = { username: 'testuser', password: 'password' };
            jest.spyOn(model, 'create').mockResolvedValueOnce(userDTO as any);
            const newUser = await service.create(userDTO);
            expect(newUser).toEqual(userDTO);
        });
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const users = [{ username: 'testuser', password: 'password' }];
            jest.spyOn(model, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(users),
            } as any);
            const foundUsers = await service.findAll();
            expect(foundUsers).toEqual(users);
        });
    });
});
