const mongoose = require("mongoose");
const Joi = require("joi");

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true
  },
  lastMessage: {
    type: {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String },
      createdAt: { type: Date, default: Date.now }
    },
    default: {} // Initialize as an empty object if not provided
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
      senderId: Joi.string().hex().length(24).optional(),
      content: Joi.string().optional(),
      createdAt: Joi.date().optional()
    }).optional()
  });

  return schema.validate(conversation);
};


const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = {
  Conversation,
  validateConversation
};