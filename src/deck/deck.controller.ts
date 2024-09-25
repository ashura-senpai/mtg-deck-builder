import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { DeckService } from './deck.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) { }

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

  @Post('import')
  async importDeck(@Body() deckJson: any) {
    return this.deckService.validateAndSaveDeck(deckJson);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/all')
  async findAllDecks() {
    return await this.deckService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-decks')
  async findMyDecks(req) {
    const userId = req.user.userId; // a partir do payload JWT
    return this.deckService.findByUserId(userId);
  }
}
