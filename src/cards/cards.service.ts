// cards/cards.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { DeckService } from '../deck/deck.service';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class CardsService {
    private readonly mtgApiUrl = 'https://api.magicthegathering.io/v1/cards';

    constructor(private readonly deckService: DeckService) { }

    async getCardsByColor(color: string): Promise<any> {
        const response = await axios.get(this.mtgApiUrl, {
            params: {
                colors: color,
                pageSize: 99,
            },
        });

        const deck = response.data.cards;

        fs.writeFileSync('deck.json', JSON.stringify(deck, null, 2));

        return deck;
    }

    async getCardsByColorAndSaveDeck(commander: string, color: string): Promise<any> {
        const response = await axios.get(this.mtgApiUrl, {
            params: {
                colors: color,
                pageSize: 99,
            },
        });

        const cards = response.data.cards;

        return this.deckService.createDeck(commander, cards);
    }

    async findAll(): Promise<any> {
        const response = await axios.get(this.mtgApiUrl, {
            params: { pageSize: 100 },
        });
        return response.data.cards;
    }

    async create(cardData: any): Promise<any> {
        const newCard = { id: Date.now().toString(), ...cardData };

        const currentCards = JSON.parse(fs.readFileSync('deck.json', 'utf-8') || '[]');
        currentCards.push(newCard);
        fs.writeFileSync('deck.json', JSON.stringify(currentCards, null, 2));

        return newCard;
    }

    async update(cardId: string, updateData: any): Promise<any> {
        const card = await this.findCardById(cardId);
        if (!card) {
            throw new NotFoundException(`Card with ID ${cardId} not found`);
        }
        return { ...card, ...updateData };
    }

    async delete(cardId: string): Promise<string> {
        const card = await this.findCardById(cardId);
        if (!card) {
            throw new NotFoundException(`Card with ID ${cardId} not found`);
        }
        return `Card with ID ${cardId} has been deleted`;
    }

    private async findCardById(cardId: string): Promise<any | null> {
        const response = await axios.get(this.mtgApiUrl, {
            params: { id: cardId },
        });
        return response.data.card || null;
    }
}