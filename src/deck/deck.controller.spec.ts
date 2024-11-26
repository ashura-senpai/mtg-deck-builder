import { Test, TestingModule } from '@nestjs/testing';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext } from '@nestjs/common';

describe('DeckController', () => {
  let controller: DeckController;
  let service: DeckService;

  const mockDeckService = {
    createDeck: jest.fn(),
    randomDeck: jest.fn(),
    validateAndSaveDeck: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
  };

  const mockRequest = {
    user: { userId: '12345' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeckController],
      providers: [
        {
          provide: DeckService,
          useValue: mockDeckService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          return true; // Simula um usuário autenticado
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          return true; // Simula a verificação de roles
        },
      })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: jest.fn((context, next) => next.handle()),
      })
      .compile();

    controller = module.get<DeckController>(DeckController);
    service = module.get<DeckService>(DeckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDeck', () => {
    it('should call service.createDeck with correct arguments', async () => {
      const commander = 'Commander1';
      const cards = [{ id: 'card1' }, { id: 'card2' }];
      mockDeckService.createDeck.mockResolvedValue('newDeck');

      const result = await controller.createDeck(commander, cards);

      expect(service.createDeck).toHaveBeenCalledWith(commander, cards);
      expect(result).toEqual('newDeck');
    });
  });

  describe('randomDeck', () => {
    it('should return a random deck from the service', async () => {
      mockDeckService.randomDeck.mockResolvedValue('randomDeck');

      const result = await controller.randomDeck();

      expect(service.randomDeck).toHaveBeenCalled();
      expect(result).toEqual('randomDeck');
    });
  });

  describe('importDeck', () => {
    it('should call service.validateAndSaveDeck with correct arguments', async () => {
      const deckJson = { name: 'Test Deck' };
      mockDeckService.validateAndSaveDeck.mockResolvedValue('importedDeck');

      const result = await controller.importDeck(deckJson);

      expect(service.validateAndSaveDeck).toHaveBeenCalledWith(deckJson);
      expect(result).toEqual('importedDeck');
    });
  });

  describe('findAllDecks', () => {
    it('should return all decks for admin', async () => {
      mockDeckService.findAll.mockResolvedValue(['deck1', 'deck2']);

      const result = await controller.findAllDecks();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(['deck1', 'deck2']);
    });
  });

  describe('findMyDecks', () => {
    it('should return decks for the authenticated user', async () => {
      const userId = mockRequest.user.userId;
      mockDeckService.findByUserId.mockResolvedValue(['deck1', 'deck2']);

      const result = await controller.findMyDecks(mockRequest);

      expect(service.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(['deck1', 'deck2']);
    });
  });
});
