import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { DeckService } from './deck.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createDeck(
    @Body('commander') commander: string,
    @Body('cards') cards: Record<string, any>[],
  ) {
    return await this.deckService.createDeck(commander, cards);
  }

  @Get('random')
  async randomDeck() {
    return await this.deckService.randomDeck();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllDecks() {
    return await this.deckService.findAll();
  }
}
