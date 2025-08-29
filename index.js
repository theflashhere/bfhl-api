const express = require("express");

const app = express();
app.use(express.json());

function isAllDigits(s) {
  return /^[0-9]+$/.test(s);
}
function isAllAlpha(s) {
  return /^[A-Za-z]+$/.test(s);
}

function computeConcatString(chars) {
  const reversed = chars.slice().reverse();
  return reversed
    .map((ch, i) => {
      if (!/[A-Za-z]/.test(ch)) return ch;
      return i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
    })
    .join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data || [];

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    const alphaCharsSeq = [];

    for (const item of data) {
      const token = String(item);

      if (isAllDigits(token)) {
        const n = parseInt(token, 10);
        if (n % 2 === 0) even_numbers.push(token);
        else odd_numbers.push(token);
        sum += n;
      } else if (isAllAlpha(token)) {
        alphabets.push(token.toUpperCase());
        for (const ch of token) alphaCharsSeq.push(ch);
      } else {
        special_characters.push(token);
      }
    }

    const concat_string = computeConcatString(alphaCharsSeq);

    // Pretty JSON response
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({
      is_success: true,
      user_id: "abhinavsrivastava_28062003",
      email: "your_email@example.com",
      roll_number: "22BCE9999",
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    }, null, 2)); // 2-space indentation for readability
  } catch (err) {
    res.status(400).json({ is_success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
