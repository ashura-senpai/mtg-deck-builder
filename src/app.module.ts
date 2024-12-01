import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckModule } from './deck/deck.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';
import { DeckController } from './deck/deck.controller';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeckService } from './deck/deck.service';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/mtg-deck-builder'),
    DeckModule,
    UsersModule,
    AuthModule,
    MetricsModule,
    CacheModule.register({
      ttl: 5,
      max: 50,
    }),
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
  controllers: [CardsController, DeckController, AppController],
  providers: [CardsService, DeckService, AppService],
})
export class AppModule { }
