const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

router.post('/start-conversation', async (req, res) => {
    const {userId, moduleId} = req.body;
    if (!userId || !moduleId) {
        return res.status(400).json({ error: "Missing userId or moduleId" })
    }

    const { data: convo, error: convoError } = await supabase
    .from('conversations')
    .insert([{ user_id: userId, module_id: moduleId }])
    .select()
    .single();

    if (convoError) return res.status(500).json({ error: convoError.message });

    const { data: prompt, error: promptError } = await supabase
    .from('conversation_prompts')
    .select('message')
    .eq('module_id', moduleId)
    .eq('step', 1)
    .single();

    if (promptError) return res.status(500).json({ error: promptError.message });

    res.json({
        conversationId: convo.id,
        firstPrompt: prompt.message,
        step: 1
    });
});

module.exports = router;