import { Test, TestingModule } from '@nestjs/testing';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';

describe('DeckController', () => {
    let controller: DeckController;
    let service: DeckService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DeckController],
            providers: [
                {
                    provide: DeckService,
                    useValue: {
                        createDeck: jest.fn(),
                        findAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<DeckController>(DeckController);
        service = module.get<DeckService>(DeckService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createDeck', () => {
        it('should create a deck', async () => {
            const deckDTO = { commander: 'Gisa', cards: ['card1', 'card2'] };
            jest.spyOn(service, 'createDeck').mockResolvedValue(deckDTO as any);
            const result = await controller.create(deckDTO);
            expect(result).toEqual(deckDTO);
        });
    });

    describe('findAll', () => {
        it('should return an array of decks', async () => {
            const decks = [{ commander: 'Gisa', cards: ['card1', 'card2'] }];
            jest.spyOn(service, 'findAll').mockResolvedValue(decks as any);
            const result = await controller.findAll();
            expect(result).toEqual(decks);
        });
    });
});
