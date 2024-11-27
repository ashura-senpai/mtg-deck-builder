import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';
import { Deck, DeckSchema } from './schemas/deck.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeckGateway } from './deckGateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
    CacheModule.register(),
    ClientsModule.register([
      {
        name: 'DECK_IMPORT_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'deck_import_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [DeckController],
  providers: [DeckService, DeckGateway],
  exports: [DeckService, DeckGateway, MongooseModule],
})
export class DeckModule {}
