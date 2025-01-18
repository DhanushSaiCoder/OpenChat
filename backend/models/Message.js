const mongoose = require('mongoose');
const Joi = require('joi');

// Define the schema for a message
const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reciverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// Define the Joi validation function
const validateMessage = (message) => {
  const schema = Joi.object({
    conversationId: Joi.string().required(), // Validate ObjectId as a string
    senderId: Joi.string().required(), // Validate ObjectId as a string
    reciverId: Joi.string().required(), // Validate ObjectId as a string
    message: Joi.string().min(1).required(), // Message must be a non-empty string
  });

  return schema.validate(message);
};

// Create the Message model
const Message = mongoose.model('Message', messageSchema);

// Export the model and validation function
module.exports = {
  Message,
  validateMessage,
};
