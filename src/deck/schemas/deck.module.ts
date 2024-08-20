import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';
import { Deck, DeckSchema } from './deck.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
    ],
    controllers: [DeckController],
    providers: [DeckService],
})
export class DeckModule { }
