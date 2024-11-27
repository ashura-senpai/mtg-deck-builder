import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeckService } from './deck.service';

@Injectable()
export class DeckImportListener {
  constructor(private readonly deckService: DeckService) {}

  @MessagePattern('import_deck')
  async importDeck(deckJson: any) {
    await this.deckService.saveDeckToDatabase(deckJson);
    return { message: 'Baralho importado com sucesso!' };
  }
}
