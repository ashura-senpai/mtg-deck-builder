import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { getModelToken } from '@nestjs/mongoose';
import { Card } from './schema/cards.schema';

describe('CardsService', () => {
    let service: CardsService;
    let mockCardModel: any;

    beforeEach(async () => {
        mockCardModel = {
            create: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue([]),
            findByIdAndUpdate: jest.fn().mockResolvedValue({}),
            findByIdAndDelete: jest.fn().mockResolvedValue({}),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardsService,
                { provide: getModelToken(Card.name), useValue: mockCardModel },
            ],
        }).compile();

        service = module.get<CardsService>(CardsService);
    });

    it('deve ser definido', () => {
        expect(service).toBeDefined();
    });

    it('deve criar uma nova carta', async () => {
        const cardData = { name: 'Sample Card', type: 'Creature', manaCost: 3 };
        await service.create(cardData);
        expect(mockCardModel.create).toHaveBeenCalledWith(cardData);
    });

    it('deve retornar todas as cartas', async () => {
        await service.findAll();
        expect(mockCardModel.find).toHaveBeenCalled();
    });

    it('deve atualizar uma carta existente', async () => {
        const cardId = 'sampleCardId';
        const updateData = { name: 'Updated Card' };
        await service.update(cardId, updateData);
        expect(mockCardModel.findByIdAndUpdate).toHaveBeenCalledWith(cardId, updateData, { new: true });
    });

    it('deve excluir uma carta existente', async () => {
        const cardId = 'sampleCardId';
        await service.delete(cardId);
        expect(mockCardModel.findByIdAndDelete).toHaveBeenCalledWith(cardId);
    });
});