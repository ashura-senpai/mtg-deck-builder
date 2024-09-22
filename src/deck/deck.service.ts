import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck } from './schemas/deck.schema';
import axios from 'axios';

@Injectable()
export class DeckService {
  constructor(@InjectModel(Deck.name) private deckModel: Model<Deck>) {}

  async createDeck(
    commander: string,
    cards: Record<string, any>[],
  ): Promise<Deck> {
    const createdDeck = new this.deckModel({ commander, cards });
    return createdDeck.save();
  }

  async randomDeck() {
    const API_Commander = 'https://api.scryfall.com/cards/random?q=is%3Acommander';
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

  async findAll(): Promise<Deck[]> {
    return this.deckModel.find().exec();
  }
}
