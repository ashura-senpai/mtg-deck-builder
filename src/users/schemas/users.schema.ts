import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    const user = this as UserDocument;
    if (!user.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});
