import { Controller, Get, Query } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) { }

    @Get()
    async findCardsByColor(@Query('color') color: string) {
        return await this.cardsService.getCardsByColor(color);
    }
}
