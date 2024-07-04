import truncate from './truncate.js';
import truncateNumber from './truncateNumber.js';

export default {
  /**
   * This function takes as parameter an array of objects containing information about the user's investment lines
   * @param {Object[]} data - An array of objects containing information on all the user's investment lines
   */
  // Calculation of user information
  getAssetUserInformation(data) {
    const assetUserInformation = [];

    const priceByCategory = {
      crypto: 0,
      stock: 0,
    };

    let totalEstimatePortfolio = 0;
    let totalInvestment = 0;

    // The user's transaction lines are browsed to calculate the details of his portfolio by asset.
    data.forEach((line) => {
      const buyQuantity = parseFloat(line.asset_number);
      const priceInvest = parseFloat(line.price_invest);
      const assetPrice = truncateNumber(parseFloat(line.asset_price));
      const pourcentFees = line.fees;
      const assetName = line.asset_name;
      const { symbol } = line;
      const category = line.name;
      const transactionType = line.trading_operation_type;
      const totalEstimate = truncate.truncateToTwoDecimals(buyQuantity * assetPrice);

      const totalInvestLineWithoutFees = buyQuantity * priceInvest;
      const totalInvestLineWithFees = totalInvestLineWithoutFees - totalInvestLineWithoutFees * (pourcentFees / 100);

      if (transactionType === 'buy') {
        totalInvestment += totalInvestLineWithFees;
        const existingAsset = assetUserInformation.find((asset) => asset.symbol === symbol);
        if (existingAsset) {
          existingAsset.quantity += buyQuantity;
          existingAsset.totalInvestByAsset += totalInvestLineWithFees;
          existingAsset.totalEstimatedValueByAsset += totalEstimate;
          existingAsset.assetCategory = category;
        } else {
          assetUserInformation.push({
            symbol,
            quantity: buyQuantity,
            totalInvestByAsset: totalInvestLineWithFees,
            totalEstimatedValueByAsset: totalEstimate,
            assetCategory: category,
            assetName,
            assetPrice,
          });
        }
      } else if (transactionType === 'sell') {
        totalInvestment -= totalInvestLineWithFees;
        const existingAsset = assetUserInformation.find((asset) => asset.symbol === symbol);
        if (existingAsset) {
          existingAsset.quantity -= buyQuantity;
          existingAsset.totalInvestByAsset -= totalInvestLineWithFees;
          existingAsset.totalEstimatedValueByAsset -= totalEstimate;
        }
      }
    });

    // We scan the user's transaction lines to calculate the value of his portfolio
    data.forEach((line) => {
      const buyQuantity = line.asset_number;
      const assetPrice = line.asset_price;
      const transactionType = line.trading_operation_type;

      if (transactionType === 'buy') {
        totalEstimatePortfolio += buyQuantity * assetPrice;
      } else if (transactionType === 'sell') {
        totalEstimatePortfolio -= buyQuantity * assetPrice;
      }
    });

    // We calculate the percentage gain or loss of the portfolio
    const gainOrLossPourcent = truncate.truncateToTwoDecimals(
      ((totalEstimatePortfolio - totalInvestment) / totalInvestment) * 100,
    );

    // We calculate the gain or loss in portfolio value
    const gainOrLossMoney = truncate.truncateToTwoDecimals(totalEstimatePortfolio - totalInvestment);

    // We calculate the total value of the portfolio by category and then calculate the percentage breakdown of the portfolio.
    assetUserInformation.forEach((asset) => {
      if (asset.assetCategory === 'crypto') {
        priceByCategory.crypto += asset.totalEstimatedValueByAsset;
      } else if (asset.assetCategory === 'stock') {
        priceByCategory.stock += asset.totalEstimatedValueByAsset;
      }
    });

    // We calculate the breakdown of the portfolio, percentage of crypto and stock, which we then truncate.
    let cryptoPourcent = truncate.truncateToTwoDecimals(
      (priceByCategory.crypto / (priceByCategory.crypto + priceByCategory.stock)) * 100,
    );
    let stockPourcent = truncate.truncateToTwoDecimals(
      (priceByCategory.stock / (priceByCategory.stock + priceByCategory.crypto)) * 100,
    );

    if (Number.isNaN(cryptoPourcent)) {
      cryptoPourcent = 0;
    }
    if (Number.isNaN(stockPourcent)) {
      stockPourcent = 0;
    }

    //
    const gainOrLossTotalPortfolio = totalEstimatePortfolio - totalInvestment > 0 ? 'positive' : 'negative';

    assetUserInformation.forEach((asset, index) => {
      const gainOrLoss = asset.totalEstimatedValueByAsset - asset.totalInvestByAsset;
      // We test whether the portfolio is in profit or loss to display the corresponding color on the front-end.
      assetUserInformation[index].gainOrLossTotalByAsset = gainOrLoss > 0 ? 'positive' : 'negative';
    });

    // Truncate to two decimal places
    totalEstimatePortfolio = truncate.truncateToTwoDecimals(totalEstimatePortfolio);

    /**
     * User portfolio details.
     * @typedef {Object} userInformation
     * @property {number} totalInvestment - The total amount invested by the user.
     * @property {number} totalEstimatePortfolio -  The total estimate of the user's portfolio.
     * @property {string} gainOrLossTotalPortfolio - Overall portfolio performance ('positive' if in profit, 'negative' otherwise).
     * @property {number} gainOrLossPourcent - The percentage gain or loss of the portfolio.
     * @property {number} gainOrLossMoney - The gain or loss in portfolio value.
     * @property {number} cryptoPourcent - The percentage of the portfolio's value invested in crypto-currencies.
     * @property {number} stockPourcent - Percentage of portfolio value invested in Stocks.
     * @property {Object[]} assetUserInformation - Details of each asset in the user's portfolio.
     * @property {number} assetUserInformation[].quantity - Quantity of assets held.
     * @property {number} assetUserInformation[].totalInvestByAsset - The total amount invested in this asset.
     * @property {number} assetUserInformation[].totalEstimatedValueByAsset - The total value of this asset.
     * @property {string} assetUserInformation[].assetCategory - The category of this asset.
     * @property {string} assetUserInformation[].assetName - The name of this asset.
     * @property {number} assetUserInformation[].assetPrice - The price of this asset.
     * @property {string} assetUserInformation[].gainOrLossTotalByAsset -  The performance of this asset ('positive' if in profit, 'negative' otherwise).
     * @property {string} assetUserInformation[].symbol - Asset-linked symbol.
     */

    return {
      totalInvestment,
      totalEstimatePortfolio,
      gainOrLossTotalPortfolio,
      gainOrLossPourcent,
      gainOrLossMoney,
      cryptoPourcent,
      stockPourcent,
      assetUserInformation,
    };
  },
};
