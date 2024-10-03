import { Schema, model } from 'mongoose';
import { IName, TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { USER_STATUS } from './user.constant';

// name schema
const nameSchema = new Schema<IName>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const defaultAvater = "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5.jpg?s=250"

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: nameSchema,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false, 
      default: defaultAvater,
    },
    bio: {
      type: String,
      default: "",  // Optional with default value
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    isPremium: {
      type: Boolean,
      default: false,  // Default to non-premium
    },
    premiumExpiry: {
      type: Date,
    },
    needPasswordChange: {
      type: Boolean,
      default: true, 
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],  
    },
    status: {
      type: String,
      enum: USER_STATUS,
      default: 'active',  // Default to 'pending' status after registration
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true, 
  }
);


// pre middleware / hook: we will work ot it create() save()
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  //hasing password
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
  // next step
  next();
});


// post middleware / hook: we will work ot it create() save()
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// user exist cusotm static method
userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};


// user exist cusotm static method
userSchema.statics.isPasswordMatch = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};


// check is the jwt token issued before password changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
  passwordChangedTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  const passwordChangedTime = Math.round(new Date(passwordChangedTimeStamp).getTime() / 1000);
  return passwordChangedTime > jwtIssuedTimeStamp;
};

// make model
export const User = model<TUser, UserModel>('User', userSchema);
