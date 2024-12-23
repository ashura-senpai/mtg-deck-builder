import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  UseInterceptors, Put, Param,
} from '@nestjs/common';
import { DeckService } from './deck.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UpdateDeckDto } from './dto/updateDeck.dto';

@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
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

  @Put('update/:id')
  async updateDeck(@Param('id') deckId: string, @Body() updateDeckDto: UpdateDeckDto,) {
    return this.deckService.updateDeck(deckId, updateDeckDto);
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
  @UseInterceptors(CacheInterceptor)
  @CacheKey('my-decks-cache')
  @CacheTTL(10)
  @Get('my-decks')
  async findMyDecks(req) {
    const userId = req.user.userId;
    return this.deckService.findByUserId(userId);
  }
}
