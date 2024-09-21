import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CommanderService {
  private readonly mtgApiUrl = 'https://api.magicthegathering.io/v1/cards';

  async getCommanders(): Promise<any> {
    const response = await axios.get(this.mtgApiUrl, {
      params: {
        types: 'legendary',
        pageSize: 100,
      },
    });

    return response.data.cards.filter((card) =>
      card.supertypes.includes('Legendary'),
    );
  }
}
