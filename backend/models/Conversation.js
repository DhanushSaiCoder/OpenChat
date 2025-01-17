const mongoose = require("mongoose");
const Joi = require("joi");

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true
  },
  lastMessage: {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }
},
  { timestamps: true });

const validateConversation = (conversation) => {
  const schema = Joi.object({
    participants: Joi.array()
      .items(Joi.string().hex().length(24))  // Assumes MongoDB ObjectId as string
      .min(2)  // Minimum of two participants for a conversation
      .required(),
    lastMessage: Joi.object({
      senderId: Joi.string().hex().length(24).required(),
      content: Joi.string().required(),
      type: Joi.string().valid('text', 'image', 'video').default('text'),
      createdAt: Joi.date().default(Date.now)
    }).required()
  });

  return schema.validate(conversation);
};


const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = {
  Conversation,
  validateConversation
};