import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'

@Schema()
export class Pokemon extends Document {

    // public id: string; // Mongo me lo da

    @Prop({
        unique: true,
        index: true
    })
    public name: string;

    @Prop({
        unique: true,
        index: true
    })
    public no: number;

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
