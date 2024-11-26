import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck } from './schemas/deck.schema';
import axios from 'axios';
import { InjectRabbitMQ, RabbitMQService } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class DeckService {
  constructor(@InjectModel(Deck.name) private deckModel: Model<Deck>) { }
  @InjectRabbitMQ() private readonly rabbitMQService: RabbitMQService

  private async fetchCreatures(
    commanderColor: string[],
    rarity: string
  ): Promise<Card[]> {
    const url = `https://api.magicthegathering.io/v1/cards?colors=${commanderColor.join(',')}&type=creature&rarity=${rarity}&pageSize=7&random=true`;
    try {
      const response = await axios.get(url);
      return response.data.cards.map((card: any) => ({
        name: card.name,
        colorIdentity: card.colorIdentity,
        type: card.type,
        rarity: card.rarity,
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar criaturas da API externa.');
    }
  }

  async findByUserId(userId: string): Promise<Deck[]> {
    return this.deckModel.find({ owner: userId }).exec();
  }

  async createDeck(
    commander: string,
    cards: Record<string, any>[],
  ): Promise<Deck> {
    const createdDeck = new this.deckModel({ commander, cards });
    return createdDeck.save();
  }

  public async randomDeck() {
    const API_Commander =
      'https://api.scryfall.com/cards/random?q=is%3Acommander';
    const commanderData = await axios.get(API_Commander);
    const card = commanderData.data;
    const commanderColor = card.colors;
    const commander = [];

    commander.push([card.name, commanderColor.toString()]);

    const creatures = [];

    const API_CommonCreature = `https://api.magicthegathering.io/v1/cards?colors=${commanderColor.toString()}&type=creature&rarity=common&pageSize=7&random=true`;
    const commonCardData = await axios.get(API_CommonCreature);
    const commonCreature = commonCardData.data.cards;

    commonCreature.forEach((card: any) => {
      creatures.push([card.name, card.colorIdentity, card.type, card.rarity]);
    });

    const API_UncommonCreature = `https://api.magicthegathering.io/v1/cards?colors=${commanderColor.toString()}&type=creature&rarity=uncommon&pageSize=7&random=true`;
    const uncommonCardData = await axios.get(API_UncommonCreature);
    const uncommonCreature = uncommonCardData.data.cards;

    uncommonCreature.forEach((card: any) => {
      creatures.push([card.name, card.colorIdentity, card.type, card.rarity]);
    });

    const API_RareCreature = `https://api.magicthegathering.io/v1/cards?colors=${commanderColor.toString()}&type=creature&rarity=rare&pageSize=7&random=true`;
    const rareCardData = await axios.get(API_RareCreature);
    const rareCreature = rareCardData.data.cards;

    rareCreature.forEach((card: any) => {
      creatures.push([card.name, card.colorIdentity, card.type, card.rarity]);
    });

    const newDeck = new this.deckModel({
      commander: commander,
      cards: creatures,
    });

    await newDeck.save();

    return {
      message:
        'O baralho foi criado com sucesso, pórem ele so contem criatura e um commander, terá que adicioanr o terrenos e magias.',
    };
  }

  async validateAndSaveDeck(deckJson: any) {
    const commander = deckJson.commander[0];
    const deck = deckJson.cards;

    if (!commander || !deck) {
      throw new BadRequestException('Comandante ou baralho ausente');
    }

    if (deck.length !== 21) {
      throw new BadRequestException(
        'O baralho deve conter 21 cards, além do comandante.',
      );
    }

    const cardCount: { [cardName: string]: number } = {};

    for (const card of deck) {
      const cardName = card[0];

      if (cardCount[cardName]) {
        cardCount[cardName]++;
      } else {
        cardCount[cardName] = 1;
      }

      if (cardCount[cardName] > 1 && !this.isBasicLand(card)) {
        throw new BadRequestException(`Card duplicado: ${cardName}`);
      }
    }

    if (!this.validateColorIdentity(commander, deck)) {
      throw new BadRequestException(
        'A identidade de cor do comandante não é respeitada.',
      );
    }

    const savedDeck = await this.saveDeckToDatabase(deckJson);

    return { message: 'Baralho válido e importado com sucesso!', savedDeck };
  }

  //deixei implemetado uma parte de validação das cartas de terreno, caso a gente consiga usar/fazer
  private isBasicLand(card: any): boolean {
    const basicLands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
    return basicLands.includes(card[0]);
  }

  private validateColorIdentity(commander: any, deck: any[]): boolean {
    const commanderColors = commander[1];
    return deck.every((card) =>
      card[1].every((color: string) => commanderColors.includes(color)),
    );
  }

  private async saveDeckToDatabase(deckJson: any): Promise<Deck> {
    const createdDeck = new this.deckModel(deckJson);
    return createdDeck.save();
  }

  async findAll(): Promise<Deck[]> {
    return this.deckModel.find().exec();
  }
}
