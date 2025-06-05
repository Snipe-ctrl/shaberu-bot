const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');

router.post('/start-conversation', async (req, res) => {
    const {userId, levelId} = req.body;
    if (!userId || !levelId) {
        return res.status(400).json({ error: "Missing userId or levelId" })
    }

    const { data: convoKeys, error: convoKeysError } = await supabase
    .from('conversation_prompts')
    .select('conversation_key')
    .eq('level_id'. levelId)
    .neq('step', 0);

    if (convoKeysError || !convoKeys.length) {
        return res.status(404).json({ error: "No conversations found for this level" });
    }

    const keys = [...new Set(convoKeys.map(row => row.conversation_key))];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    const { data: convo, error: convoError } = await supabase
    .from('conversations')
    .insert([
        {
            user_id: userId,
            level_id: levelId,
            conversation_key: randomKey
        }
    ])
    .select()
    .single();

    if (convoError) {
        return res.status(500).json({ error: convoError.message });
    }

    const { data: prompt, error: promptError } = await supabase
    .from('conversation_prompts')
    .select('message')
    .eq('level', levelId)
    .eq('conversation_key', randomKey)
    .eq('step', 1)
    .single();

    if (promptError || !firstPrompt) {
        return res.status(404).json({ error: 'First prompt not found' });
    }
    res.json({
        conversationId: convo.id,
        firstPrompt: prompt.message,
        step: 1,
        conversationKey: randomKey
    });
});

module.exports = router;