import assetDatamapper from '../datamappers/asset.datamapper.js';
import dashboardDatamapper from '../datamappers/dashboard.datamapper.js';
import tradingOperationDatamapper from '../datamappers/tradingOperation.datamapper.js';
import userDatamapper from '../datamappers/user.datamapper.js';
import scriptAssetCalculate from '../utils/script.asset.calculate.js';
import calculateAssetInformation from '../utils/scripts.dashboard.calculate.js';
import isDateOk from '../utils/testDate.js';

const dashboard = {
  async dashboardDetail(req, res) {
    // Get the user id from the token stored in the request object
    const { id } = req.user;

    // We retrieve all the user's investment lines and perform all the calculations.
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);
    const newAssetInformationByUser = assetInformationByUser.assetUserInformation;

    // We remove the assets with a quantity of 0, to avoid displaying
    for (let i = newAssetInformationByUser.length - 1; i >= 0; i -= 1) {
      if (newAssetInformationByUser[i].quantity === 0) {
        newAssetInformationByUser.splice(i, 1);
      }
    }

    // Send the data to the client
    res.json({ userInformation: assetInformationByUser });
  },

  async openModal(req, res) {
    // Get all assets and their categories
    const allAsset = await assetDatamapper.findAssetNameAndCategory();
    res.json({ allAsset });
  },

  async addLine(req, res) {
    // Get the data from the request body, to add a line of investment
    const assetName = req.body.asset_name;
    const assetNumber = req.body.asset_number;
    const { price } = req.body;
    const { fees } = req.body;
    const { date } = req.body;

    // Check that the date sent by the user is not greater than the current date
    const dateCheck = isDateOk(date);
    if (dateCheck) {
      throw new Error("La date n'est pas valide");
    }

    // Check that all fields are filled in
    if (!assetName || !assetNumber || !price || !fees || !date) {
      throw new Error('Veuillez remplir tous les champs');
    }

    // Check that the asset exists, if exists, get the id
    const assetId = await assetDatamapper.getAssetId(assetName);
    // if the asset does not exist, throw an error
    if (!assetId) {
      throw new Error("Cet actif n'est pas répertorié");
    }

    // Get the user id from the token stored in the request object
    const { id } = req.user;

    // Get the type of operation (buy or sell) from the url
    const { url } = req;
    // We retrieve the type of operation from the url by removing the / at the beginning
    const tradingOperationType = url.substring(1);

    // Get the user's portfolio id
    const portfolioId = await userDatamapper.getPortfolioByUserId(id);

    // Get the type of operation id
    const tradingTypeId = await tradingOperationDatamapper.getOperationByName(tradingOperationType);

    // We retrieve all the user's investment lines and perform all the calculations.
    const allLines = await dashboardDatamapper.findAllTradingLinesByUser(id);
    const assetInformationByUser = calculateAssetInformation.getAssetUserInformation(allLines);

    // if the operation is a sale
    if (tradingOperationType === 'sell') {
      const asset = assetInformationByUser.assetUserInformation.find(
        (obj) => obj.assetName.toLowerCase() === assetName.toLowerCase(),
      );

      // Check if the asset exists in the user's portfolio
      if (!asset) {
        throw new Error("L'actif spécifié n'existe pas dans votre portefeuille");
      }

      // Check if the quantity to sell is greater than the quantity owned
      if (asset.quantity < assetNumber) {
        throw new Error('La quantité à vendre dépasse ce que vous possédez');
      }

      // Check if the quantity to sell is greater than 0
      if (assetNumber <= 0) {
        throw new Error('La quantité à vendre doit être supérieure à zéro');
      }
    }
    // Store the data in an object
    const newData = {
      assetId: assetId.id,
      portfolioId: portfolioId.id,
      asset_number: assetNumber,
      price,
      fees,
      date,
      tradingOperationTypeId: tradingTypeId.id,
    };

    // After checking all the data, we add the line of investment in the database
    await dashboardDatamapper.addLine(newData);

    // Send a success message
    return res.json({ successMessage: 'Ajout bien effectuer' });
  },

  async assetDetails(req, res) {
    // Get the asset symbol from the url parameter
    const symbol = req.params.asset;

    // Get the user id from the token stored in the request object
    const { id } = req.user;

    // Recovers all the user's investment lines for a given asset
    const assetDetails = await dashboardDatamapper.getAllAssetLineByUser(id, symbol);

    // Calculate all the data for the asset
    const assetDetailsCalculated = scriptAssetCalculate.calculate(assetDetails);

    // Send the data to the client
    res.json({ assetDetailsCalculated });
  },
};
export default dashboard;
