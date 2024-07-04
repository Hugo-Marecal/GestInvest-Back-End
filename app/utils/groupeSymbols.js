import 'dotenv/config';
import assetDatamapper from '../datamappers/asset.datamapper.js';

const groupSymbols = {
  /**
   * This function takes an asset category identified by `categoryId` and divides the corresponding symbols into groups of size `groupSize`.
   * It uses an asynchronous method to retrieve the symbols,
   * groups them according to the specified size,
   * then returns these symbol groups.
   * @param {string} categoryId - Asset category identifier.
   * @param {number} groupSize - The size of each group of symbols.
   * @returns {string[]} - A table of symbol groups
   */
  async getSymbolsInGroups(categoryId, groupSize) {
    const symbols = await assetDatamapper.findAllSymbolsByCategory(categoryId);
    const symbolArray = symbols.map((obj) => obj.symbol);

    const groups = [];
    for (let i = 0; i < symbolArray.length; i += groupSize) {
      groups.push(symbolArray.slice(i, i + groupSize).join(','));
    }

    return groups;
  },
};

export default groupSymbols;
