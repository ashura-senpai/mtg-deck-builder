import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommanderController } from './commander/commander.controller';
import { CommanderService } from './commander/commander.service';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';
import { DeckController } from './deck/schemas/deck.controller';
import { DeckService } from './deck/schemas/deck.service';
import { Deck, DeckSchema } from './deck/schemas/deck.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/mtg-deck-builder'),
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  controllers: [CommanderController, CardsController, DeckController],
  providers: [CommanderService, CardsService, DeckService],
})
export class AppModule { }
