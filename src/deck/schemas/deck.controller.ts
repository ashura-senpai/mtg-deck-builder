import { Controller, Get, Post, Body } from '@nestjs/common';
import { DeckService } from './deck.service';

@Controller('deck')
export class DeckController {
    constructor(private readonly deckService: DeckService) { }

    @Post()
    async createDeck(@Body('commander') commander: string, @Body('cards') cards: Record<string, any>[]) {
        return await this.deckService.createDeck(commander, cards);
    }

    @Get()
    async findAllDecks() {
        return await this.deckService.findAll();
    }
}
