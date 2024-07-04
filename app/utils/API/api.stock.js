import axios from 'axios';
import 'dotenv/config';
import assetDatamapper from '../../datamappers/asset.datamapper.js';
import groupSymbols from '../groupeSymbols.js';

/* ***** We create a time delay between each group so that we can carry out our requests via the api ****** */

const RATE_LIMIT_DELAY = 1000; // Delay in milliseconds between each request
let lastRequestTimestamp = 0; // Timestamp of last query

async function delayIfNeeded() {
  // Get the current timestamp
  const now = Date.now();
  // Calculate the time elapsed since the last request
  const timeSinceLastRequest = now - lastRequestTimestamp;

  // Checks whether the elapsed time is less than the time limit allowed between requests
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    // Calculates the time remaining before the next query can be performed
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    // Waits for the remaining time before resolving the promise, thus suspending performance
    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // Updates the timestamp of the last request for the next check
  lastRequestTimestamp = Date.now();
}

export default {
  // We retrieve asset prices and update them in the database.
  async getPriceStock(categoryId, groupSize) {
    const groups = await groupSymbols.getSymbolsInGroups(categoryId, groupSize);

    try {
      const responses = await Promise.all(
        groups.map(async (group) => {
          await delayIfNeeded(); // Wait before each request
          return this.fetchQuotesForGroup(group);
        }),
      );

      const result = [];
      // To access the data in each answer
      responses.forEach((response) => {
        for (let i = 0; i < response.quoteResponse.result.length; i += 1) {
          result.push({
            [`${response.quoteResponse.result[i].symbol}`]: response.quoteResponse.result[i].regularMarketPrice,
          });
        }
      });

      // We iterate on the result to retrieve the prices and update them in the database.
      result.forEach(async (item) => {
        // For each element in the table
        Object.keys(item).forEach(async (key) => {
          // For each element key
          // Recovering the key and its value
          const assetSymbol = key;
          const assetPrice = item[key];

          // Updating the price in the database
          await assetDatamapper.updatePrices(assetSymbol, assetPrice);
        });
      });
    } catch (error) {
      console.error(error);
    }
  },

  /**
   *
   * @param {string} group - Asset symbols
   * @returns {Promise} - Asset prices
   */
  // Function to retrieve Stock prices for a given group
  async fetchQuotesForGroup(group) {
    const options = {
      method: 'GET',
      url: 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
      params: {
        region: 'US',
        symbols: group,
      },
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY_YH,
        'X-RapidAPI-Host': process.env.API_HOST_YH,
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
