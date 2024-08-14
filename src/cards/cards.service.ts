import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class CardsService {
    private readonly mtgApiUrl = 'https://api.magicthegathering.io/v1/cards';

    async getCardsByColor(color: string): Promise<any> {
        const response = await axios.get(this.mtgApiUrl, {
            params: {
                colors: color,
                pageSize: 99,
            },
        });

        const deck = response.data.cards;

        fs.writeFileSync('deck.json', JSON.stringify(deck, null, 2)); // salvar em json

        return deck;
    }
}
