const express = require('express');
const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const translate = new Translate({
  keyFilename: path.join(__dirname, 'service-account.json'), // Path to your service account JSON file
});

app.use(express.json());

app.post('/translateKeywords', async (req, res) => {
  const { keywords, targetLanguage } = req.body;
  try {
    const [translations] = await translate.translate(keywords, targetLanguage);
    res.json(translations);
  } catch (error) {
    res.status(500).send('Error translating keywords: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
