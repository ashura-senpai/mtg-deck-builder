import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';
import { DeckController } from './deck/deck.controller';
import { DeckService } from './deck/deck.service';
import { Deck, DeckSchema } from './deck/schemas/deck.schema';
import { DeckModule } from './deck/deck.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/mtg-deck-builder'),
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
    DeckModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [CardsController, DeckController,AppController],
  providers: [ CardsService, DeckService,AppService],
})
export class AppModule { }
