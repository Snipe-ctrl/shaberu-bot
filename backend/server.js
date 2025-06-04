require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const conversationRoutes = require('./routes/conversation');

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api', conversationRoutes);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/evaluate', async (req, res) => {
    const { userId, pairs } = req.body;

    try {
        const prompt = `
You are an expert Japanese language evaluator

A student has answered a series of Japanese prompts. For each prompt-response pair, evaluate:

- Vocabulary
- Grammar
- Sentence structure
- Naturalness
- Comprehension (Did they correctly answer the question)

If the student's response is "unknown", treat it as a skipped question and consider it a strong indicator of low proficiency.

After considering all pairs, assign a single overall proficiency score **from 1 to 5000**, where:
- 1 = beginner with minimal knowledge
- 5000 = near-native fluent
- Use fine-grained scoring — avoid rounding to the nearest hundred or fifty. A score like "563" or "1274" is preferred over "500" or "1500".

Respond **only with a number** (no comments or explanation).

Prompt/Response Pairs:
${pairs.map((pair, i) => `Prompt ${i + 1}: ${pair.prompt}\nResponse: ${pair.response}`).join("\n\n")}
        `;
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a strict Japanese language proficiency evaluator.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.2,
        });

        const score = parseInt(completion.choices[0].message.content.trim(), 10);

        console.log(`User scored: ${score}`);
        res.json({ score });
    } catch (err) {
        console.error('OpenAI API error: ', err);
        res.status(500).json({ error: 'Evaluation failed' });
    }
});

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });

        res.json({ response: response.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});