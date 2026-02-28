const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbotService');
const { authenticateToken } = require('../middleware/auth-improved');

// Send message to chatbot
router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Build context
    const chatContext = {
      role: req.user.role,
      userName: req.user.name,
      userId: userId,
      ...context,
    };

    // Get AI response
    const response = await chatbotService.getChatResponse(
      userId,
      message,
      chatContext
    );

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message,
    });
  }
});

// Handle quick actions
router.post('/quick-action', authenticateToken, async (req, res) => {
  try {
    const { action, context } = req.body;
    const userId = req.user.id;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'Action is required',
      });
    }

    const chatContext = {
      role: req.user.role,
      userName: req.user.name,
      userId: userId,
      ...context,
    };

    const response = await chatbotService.handleQuickAction(
      userId,
      action,
      chatContext
    );

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Quick action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process action',
      error: error.message,
    });
  }
});

// Clear conversation history
router.delete('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    chatbotService.clearHistory(userId);

    res.json({
      success: true,
      message: 'Conversation history cleared',
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear history',
      error: error.message,
    });
  }
});

module.exports = router;
