import { Test, TestingModule } from '@nestjs/testing';
import { DeckService } from './deck.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Deck } from './schemas/deck.schema';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DeckService', () => {
  let service: DeckService;
  let deckModel: Model<Deck>;

  const mockDeckModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(dto),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckService,
        {
          provide: getModelToken(Deck.name),
          useValue: mockDeckModel,
        },
      ],
    }).compile();

    service = module.get<DeckService>(DeckService);
    deckModel = module.get<Model<Deck>>(getModelToken(Deck.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return decks for a specific user', async () => {
      const mockDecks = [{ commander: 'Test Commander', cards: [] }];
      mockDeckModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDecks),
      });

      const result = await service.findByUserId('123');
      expect(result).toEqual(mockDecks);
      expect(mockDeckModel.find).toHaveBeenCalledWith({ owner: '123' });
    });
  });

  describe('createDeck', () => {
    it('should create and save a new deck', async () => {
      const mockDeck = { commander: 'Commander', cards: [] };
      const saveSpy = jest
        .spyOn(mockDeckModel, 'create')
        .mockImplementation(() => ({
          ...mockDeck,
          save: jest.fn().mockResolvedValue(mockDeck),
        }));

      const result = await service.createDeck('Commander', []);
      expect(result).toEqual(mockDeck);
      expect(saveSpy).toHaveBeenCalledWith({
        commander: 'Commander',
        cards: [],
      });
    });
  });

  describe('randomDeck', () => {
    it('should create a random deck', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { name: 'Random Commander', colors: ['W', 'U'] },
      });
      mockedAxios.get.mockResolvedValue({
        data: {
          cards: [
            {
              name: 'Creature 1',
              colorIdentity: ['W'],
              type: 'creature',
              rarity: 'common',
            },
          ],
        },
      });

      const result = await service.randomDeck();
      expect(result).toHaveProperty('message');
      expect(mockDeckModel.create).toHaveBeenCalled();
    });
  });

  describe('validateAndSaveDeck', () => {
    it('should validate and save a valid deck', async () => {
      const mockDeckJson = {
        commander: ['Test Commander', ['W', 'U']],
        cards: [
          ['Card 1', ['W']],
          ['Card 2', ['U']],
        ],
      };

      jest.spyOn(service as any, 'validateColorIdentity').mockReturnValue(true);
      jest
        .spyOn(service as any, 'saveDeckToDatabase')
        .mockResolvedValue(mockDeckJson as any);

      const result = await service.validateAndSaveDeck(mockDeckJson);
      expect(result).toHaveProperty(
        'message',
        'Baralho válido e importado com sucesso!',
      );
    });

    it('should throw an error if deck is invalid', async () => {
      const invalidDeckJson = {
        commander: null,
        cards: [],
      };

      await expect(
        service.validateAndSaveDeck(invalidDeckJson),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateColorIdentity', () => {
    it('should validate color identity correctly', () => {
      const commander = ['Commander', ['W', 'U']];
      const validDeck = [
        ['Card 1', ['W']],
        ['Card 2', ['U']],
      ];

      const invalidDeck = [['Card 1', ['R']]];

      expect((service as any).validateColorIdentity(commander, validDeck)).toBe(
        true,
      );
      expect(
        (service as any).validateColorIdentity(commander, invalidDeck),
      ).toBe(false);
    });
  });
});
