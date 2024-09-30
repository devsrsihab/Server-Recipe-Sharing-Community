import { model, Schema } from 'mongoose';
import { IRating } from './rating.interface';

// recipe schema
const ratingSchema = new Schema<IRating>(
  {
    rating: {
      type: Number, 
      required: [true, 'rating is required'],
      trim: true
    }, 
  user: {
    type: Schema.Types.ObjectId,  
    ref: 'User',
    required: [true, 'user is required']
  },
  recipe: {
    type: Schema.Types.ObjectId,  
    ref: 'Recipe',
    required: [true, 'recipe is required']
  },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true}
);



// query middleware show only where isDelete false
ratingSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middlware for findone
ratingSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// aggregate middleware
ratingSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});



// rating model
export const Rating = model<IRating>('Rating', ratingSchema);
