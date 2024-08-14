import { Module } from '@nestjs/common';
import { CommanderController } from './commander/commander.controller';
import { CommanderService } from './commander/commander.service';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';

@Module({
  imports: [],
  controllers: [CommanderController, CardsController],
  providers: [CommanderService, CardsService],
})
export class AppModule { }
