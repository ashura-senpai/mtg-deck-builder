import { Controller, Get } from '@nestjs/common';
import { CommanderService } from './commander.service';

@Controller('commander')
export class CommanderController {
  constructor(private readonly commanderService: CommanderService) {}

  @Get()
  async findAllCommanders() {
    return await this.commanderService.getCommanders();
  }
}
