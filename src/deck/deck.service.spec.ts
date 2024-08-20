import { Test, TestingModule } from '@nestjs/testing';
import { DeckService } from './deck.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck } from './schemas/deck.schema';

describe('DeckService', () => {
    let service: DeckService;
    let model: Model<Deck>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeckService,
                {
                    provide: getModelToken(Deck.name),
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

        service = module.get<DeckService>(DeckService);
        model = module.get<Model<Deck>>(getModelToken(Deck.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createDeck', () => {
        it('should create a new deck', async () => {
            const deckDTO = { commander: 'Gisa', cards: ['card1', 'card2'] };
            jest.spyOn(model, 'create').mockResolvedValueOnce(deckDTO as any);
            const newDeck = await service.createDeck(deckDTO);
            expect(newDeck).toEqual(deckDTO);
        });
    });

    describe('findAll', () => {
        it('should return all decks', async () => {
            const decks = [{ commander: 'Gisa', cards: ['card1', 'card2'] }];
            jest.spyOn(model, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(decks),
            } as any);
            const foundDecks = await service.findAll();
            expect(foundDecks).toEqual(decks);
        });
    });
});
