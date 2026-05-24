// Twilio inbound SMS handler for Digital Bloom.
//
// When someone texts +1 (864) 528-3139, this endpoint replies with a
// branded auto-response. Twilio expects TwiML (XML) back.
//
// Set this URL as the SMS webhook on the phone number:
//   https://digitabloom.com/api/twilio-inbound

export default function handler(req, res) {
  // Twilio sends POST for incoming messages
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  // Log inbound message for reference
  const from = req.body?.From || req.query?.From || 'unknown';
  const body = req.body?.Body || req.query?.Body || '';
  console.log(`[twilio-inbound] SMS from ${from}: ${body.slice(0, 120)}`);

  // Respond with TwiML auto-reply
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thanks for texting Digital Bloom! 🌸 Visit us at digitalbloom.store to send someone their flowers while they're here. 💐</Message>
</Response>`);
}
