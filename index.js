// index.js
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

// Config (use env vars in production)
const FULL_NAME = process.env.FULL_NAME || "john_doe";
const BIRTH_DDMMYYYY = process.env.BIRTH_DDMMYYYY || "17091999";
const EMAIL = process.env.EMAIL || "john@xyz.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";

function isAllDigits(s) { return /^[0-9]+$/.test(s); }
function isAllAlpha(s)  { return /^[A-Za-z]+$/.test(s); }

function computeConcatString(charSequence) {
  // reverse sequence, then alternate caps starting with UPPER (index 0 => UPPER)
  const reversed = charSequence.slice().reverse();
  return reversed.map((ch, i) => {
    if (!/[A-Za-z]/.test(ch)) return ch;
    return i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
  }).join('');
}

app.post('/bfhl', (req, res) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.data)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid request: provide JSON with key 'data' as an array."
      });
    }

    const data = body.data;
    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let numericSum = 0;
    const alphaCharsSequence = []; // preserve original case per-character

    for (const item of data) {
      const token = (item === null || item === undefined) ? "" : String(item);

      if (isAllDigits(token)) {
        const n = parseInt(token, 10);
        if (n % 2 === 0) even_numbers.push(String(token));
        else odd_numbers.push(String(token));
        numericSum += n;
      } else if (isAllAlpha(token)) {
        alphabets.push(token.toUpperCase());
        for (const ch of token) alphaCharsSequence.push(ch);
      } else {
        // mixed or contains special chars — treat as a special token
        special_characters.push(token);
      }
    }

    const concat_string = computeConcatString(alphaCharsSequence);

    return res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${BIRTH_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(numericSum),
      concat_string
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ is_success: false, message: "Server error" });
  }
});

// health
app.get('/', (req, res) => res.send('BFHL API running. POST /bfhl'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
