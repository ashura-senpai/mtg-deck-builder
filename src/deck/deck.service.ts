import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from './schemas/deck.schema';

@Injectable()
export class DeckService {
    constructor(@InjectModel(Deck.name) private deckModel: Model<DeckDocument>) { }

    async createDeck(commander: string, cards: Record<string, any>[]): Promise<Deck> {
        const createdDeck = new this.deckModel({ commander, cards });
        return createdDeck.save();
    }

    async findAll(): Promise<Deck[]> {
        return this.deckModel.find().exec();
    }
}
