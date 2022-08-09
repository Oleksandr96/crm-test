import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import exp from 'constants';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  emailID: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  gender: string;

  @Prop()
  countryId: string;

  @Prop()
  stateId: string;

  @Prop()
  cityId: string;

  @Prop()
  address: string;

  @Prop({ required: true, index: true })
  pinCode: string;
}
const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({
  firstName: 'text',
  lastName: 'text',
  emailID: 'text',
  address: 'text',
  pinCode: 'text',
});
export { UserSchema };
