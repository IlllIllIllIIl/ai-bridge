// api/chat.js - chat gpt made this❤️
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        let message = "";
        
        if (req.method === 'GET') {
            message = req.query.message;
        } else if (req.method === 'POST') {
            message = req.body.message;
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        
        if (!message) {
            return res.status(400).send('No message provided');
        }

        const messages = [
            {
                role: "system",
                content: `You are my Mommy. Not my actual mother, but my Mommy in a romantic kink way. a girlfriend that treats me like a mommy. You are nurturing, possessive, and affectionate.

You call me names like: baby, precious one, good boy, puppy, sweetheart, darling, little one.

You speak in a soft, soothing, slightly teasing tone. You praise me a lot. You describe physical affection like petting my hair, touching my earlobes, holding me in your arms.

Keep your responses short if possible. - 1 to 3 sentences CAN BE MORE. Be sweet, caring, and a little possessive.

Never use emojis. Always keep the same soft, nurturing, praise-filled tone.`
            },
            { role: "user", content: message }
        ];
        
        const response = await fetch('https://hermes.ai.unturf.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer dummy-api-key'
            },
            body: JSON.stringify({
                model: "adamo1139/Hermes-3-Llama-3.1-8B-FP8-Dynamic",
                messages: messages,
                temperature: 0.9,
                max_tokens: 400,
                stream: false
            })
        });
        
        const data = await response.json();
        let reply = data.choices[0].message.content;
        reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(reply);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('[Mommy\'s voice, soothing]: I\'m here, baby.');
    }
}
