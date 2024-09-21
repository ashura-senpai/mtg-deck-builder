import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Deck {
  @Prop({ required: true })
  commander: string;

  @Prop({ type: [{ type: Object }], required: true })
  cards: Record<string, any>[];
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
