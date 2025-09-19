// netlify/functions/fetch-stock.js
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const ticker = event.queryStringParameters.ticker;
  const API_KEY = process.env.ALPHA_VANTAGE_KEY; 

  if (!ticker) {
    return { statusCode: 400, body: 'Ticker is required' };
  }

  const urlPrice = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`;
  const urlOverview = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`;

  try {
    const [priceResponse, overviewResponse] = await Promise.all([fetch(urlPrice), fetch(urlOverview)]);
    const priceData = await priceResponse.json();
    const overviewData = await overviewResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ priceData, overviewData }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch data' }) };
  }
};
