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
    const ApiCommander = 'https://api.scryfall.com/cards/random?q=is%3Acommander';
    const commanderData = await axios.get(ApiCommander);
    const card = commanderData.data;
    const commanderColor = card.colors;

    const ApiCardsColor = `https://api.magicthegathering.io/v1/cards?colors=${commanderColor.toString()}`;
    const cardData = await axios.get(ApiCardsColor);


    const newDeck = new this.deckModel({
      commander: card.name,
    });

    // await newDeck.save();

    return card.colors.toString();
  }

  async findAll(): Promise<Deck[]> {
    return this.deckModel.find().exec();
  }
}
