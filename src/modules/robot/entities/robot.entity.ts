import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RobotDocument = HydratedDocument<Robot>;

@Schema({ timestamps: true })
export class Robot {
  @Prop({ index: true })
  name: string;

  @Prop()
  battery: number;

  @Prop([Number])
  engines_status: number[];
}

export const RobotSchema = SchemaFactory.createForClass(Robot);
