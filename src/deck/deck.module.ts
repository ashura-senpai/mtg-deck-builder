import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';
import { Deck, DeckSchema } from './schemas/deck.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
        CacheModule.register(),
    ],
    controllers: [DeckController],
    providers: [DeckService],
})
export class DeckModule { }
