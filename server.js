const express = require('express');
const { GoogleAdsApi } = require('google-ads-api');
const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const adsClient = new GoogleAdsApi({
  client_id: 'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET',
  developer_token: 'YOUR_DEVELOPER_TOKEN',
});

const translate = new Translate({
  keyFilename: path.join(__dirname, 'service-account.json'),
});

const refreshToken = 'YOUR_REFRESH_TOKEN';
const customerId = 'YOUR_CUSTOMER_ID';

app.use(express.json());

app.get('/fetchKeywords', async (req, res) => {
  try {
    const customer = adsClient.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
    });

    const response = await customer.report({
      entity: 'keyword_view',
      attributes: ['ad_group.id', 'ad_group.name', 'ad_group_criterion.keyword.text'],
      constraints: {
        'campaign.status': 'ENABLED',
      },
      limit: 10,
    });

    res.json(response);
  } catch (error) {
    res.status(500).send('Error fetching keywords: ' + error.message);
  }
});

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
