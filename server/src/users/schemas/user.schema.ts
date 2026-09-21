import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  })
  email: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    minlength: 8,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
