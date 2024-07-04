import axios from 'axios';
import 'dotenv/config';
import assetDatamapper from '../../datamappers/asset.datamapper.js';
import groupSymbols from '../groupeSymbols.js';

export default {
  /**
   *
   * @param {string} group - Asset symbols
   * @returns {Promise} - Asset prices
   */
  // Function to retrieve cryptocurrency prices for a given group
  async fetchPricesForGroup(group) {
    // Endpoint of the CoinMarketCap API to obtain the latest quotes for the cryptocurrencies specified in the group
    const endpoint = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${group}`;

    // Configuring request header with API key
    const config = {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY_CMC,
      },
    };

    try {
      // Request to CoinMarketCap API
      const response = await axios.get(endpoint, config);
      return response.data.data;
    } catch (error) {
      // Error handling
      console.error(`Une erreur est survenue lors de la récupération des prix pour le groupe ${group}:`, error);
      return null;
    }
  },

  // Main function to retrieve cryptocurrency prices
  async getPriceCrypto(categoryId, groupSize) {
    const groups = await groupSymbols.getSymbolsInGroups(categoryId, groupSize);

    // Dividing cryptocurrency symbols into groups
    try {
      // For each group, retrieve cryptocurrency prices
      await Promise.all(
        groups.map(async (group) => {
          const prices = await this.fetchPricesForGroup(group);
          if (prices) {
            // For each cryptocurrency in the group, update the price in the database
            Object.keys(prices).forEach(async (symbol) => {
              const { price } = prices[symbol].quote.USD;
              const arroundPrice = price.toFixed(8);
              await assetDatamapper.updatePrices(symbol, arroundPrice);
            });
          }
        }),
      );
    } catch (error) {
      console.error('Une erreur est survenue :', error);
    }
  },
};
