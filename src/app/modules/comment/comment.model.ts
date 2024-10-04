import { model, Schema } from 'mongoose';
import { IComment } from './comment.interface';
import { COMMENT_STATUS } from './comment.constant';

// recipe schema
const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    text: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(COMMENT_STATUS),
      default: COMMENT_STATUS.PENDING,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// query middleware show only where isDelete false
commentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middlware for findone
commentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// aggregate middleware
commentSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

// rating model
export const Comment = model<IComment>('Comment', commentSchema);
