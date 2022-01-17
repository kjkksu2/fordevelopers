import mongoose from "mongoose";

const recruitmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  personnel: {
    type: Number,
    default: 1,
  },
  views: {
    type: Number,
    default: 0,
  },
  like: {
    type: Number,
    default: 0,
  },
  choice: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const model = mongoose.model("Recruitment", recruitmentSchema);

export default model;
