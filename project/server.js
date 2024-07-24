const express = require('express');
const bodyParser = require('body-parser');
const owasp = require('owasp-password-strength-test');
const path = require('path'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass: 4
});

// Endpoint for password strength test
app.post('/test-password', (req, res) => {
  const { password } = req.body;
  const result = owasp.test(password);
  // Customize error messages
  result.errors = result.errors.map(error => {
    if (error === 'The password must be at least 10 characters long.') {
      return 'Password is too short.';
    }
    if (error === 'The password must contain at least one uppercase letter.') {
      return 'Password must contain at least one uppercase letter.';
    }
    if (error === 'The password must contain at least one number.') {
      return 'Password must contain at least one number.';
    }
    if (error === 'The password must contain at least one special character.') {
      return 'Password must contain at least one special character.';
    }
    if (error === 'The password must contain at least one lowercase letter.') {
      return 'Password must contain at least one lowercase letter.';
    }
    if (error === 'The password must not contain any spaces.') {
      return 'Password must not contain any spaces.';
    }
    return error;
  });
  // Add a custom error for alphanumeric characters
  if (!/[a-z]/.test(password) ||   !/[A-Z]/.test(password)   || !/[0-9]/.test(password)) {
    result.errors.push('Give me alphanumeric characters.');
  }
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});