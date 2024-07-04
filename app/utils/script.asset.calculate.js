import dayjs from 'dayjs';
import truncate from './truncate.js';

export default {
  // Format the date in FR dd-mm-yy
  formatDateFr(date) {
    const dateToFormat = dayjs(date);
    return dateToFormat.format('DD-MM-YY');
  },

  /**
   * This function takes as parameter an array of objects containing information about an asset
   * @param {Object[]} data - An array of objects containing information about an asset
   */

  calculate(data) {
    let totalEstimateAsset = 0;
    let totalAssetNumber = 0;
    let { symbol } = data[0];
    const { name } = data[0];
    const { local } = data[0];
    const { price } = data[0];
    const categoryName = data[0].category_name;
    const assetId = data[0].asset_id;
    const assetLineDetail = [];

    data.forEach((line) => {
      const lineId = line.id;
      const date = this.formatDateFr(line.invest_date);
      const priceInvest = parseFloat(line.price_invest);
      const buyQuantity = parseFloat(line.asset_number);
      const { fees } = line;
      let operationType = line.trading_operation_type;

      const totalInvestLineWithoutFees = buyQuantity * priceInvest;
      const totalInvestLineWithFees = totalInvestLineWithoutFees - totalInvestLineWithoutFees * (fees / 100);

      if (operationType === 'buy') {
        totalAssetNumber += buyQuantity;
        operationType = 'Achat';
      } else if (operationType === 'sell') {
        totalAssetNumber -= buyQuantity;
        operationType = 'Vente';
      }

      assetLineDetail.push({
        lineId,
        date,
        operationType,
        buyQuantity,
        priceInvest,
        fees,
        totalInvestLineWithFees,
      });
    });

    totalEstimateAsset = totalAssetNumber * price;

    // We remove the .PA extension for European stocks, so that we can use the symbol in the tradingview widget.
    if (categoryName === 'stock') {
      symbol = symbol.replace(/\.PA$/, '');
    }

    /**
     * Calculated details of a financial asset.
     * @typedef {Object} assetDetailsCalculated
     * @property {number} totalEstimateAsset - The total estimate of the financial asset, rounded to two decimal places.
     * @property {number} totalAssetNumber - The total number of financial assets, rounded to eight decimal places.
     * @property {string} name - The name of the financial asset.
     * @property {string} symbol - The financial asset symbol.
     * @property {string} local - Used to setup the tradingview widget.
     * @property {string} categoryName - The name of the financial asset category.
     * @property {number} assetId - Financial asset identifier.
     * @property {Array.<Object>} assetLineDetail - Details of each financial asset transaction line.
     */

    return {
      totalEstimateAsset: truncate.truncateToTwoDecimals(totalEstimateAsset),
      totalAssetNumber: truncate.truncateToEightDecimals(totalAssetNumber),
      name,
      symbol,
      local,
      categoryName,
      assetId,
      assetLineDetail,
    };
  },
};
