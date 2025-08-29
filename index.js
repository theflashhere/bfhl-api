import express from "express";

const app = express();
app.use(express.json());

function isAllDigits(s) {
  return /^[0-9]+$/.test(s);
}
function isAllAlpha(s) {
  return /^[A-Za-z]+$/.test(s);
}

function computeConcatString(chars) {
  // reverse order, alternating caps (start with UPPER)
  const reversed = chars.slice().reverse();
  return reversed.map((ch, i) => {
    if (!/[A-Za-z]/.test(ch)) return ch;
    return i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
  }).join("");
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

    res.json({
      is_success: true,
      user_id: "abhinavsrivastava_28062003", // <-- adjust as per your DOB
      email: "your_email@example.com",        // <-- replace with your email
      roll_number: "22BCE9999",               // <-- replace with your roll no
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string,
    });
  } catch (err) {
    res.status(400).json({ is_success: false, message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
