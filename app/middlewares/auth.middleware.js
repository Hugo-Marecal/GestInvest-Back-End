import jwt from 'jsonwebtoken';
import user from '../datamappers/user.datamapper.js';

export default {
  async authMiddleware(req, res, next) {
    try {
      // Extract the token from the request headers
      const token = req.headers.authorization;

      // Check if the token exists and he is starting with 'Bearer '
      if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ errorMessage: 'Requête non authentifiée' });
      }

      // Extract the JWT token from the token variable
      const jwtToken = token.slice(7);
      // Decode the JWT token and extract user information
      const decodedToken = jwt.verify(jwtToken, process.env.JWT_PRIVATE_KEY);

      // Check if the user exists in the database
      const userInfo = await user.findByEmail(decodedToken.email);
      if (!userInfo) {
        return res.status(401).json({ errorMessage: 'Utilisateur non trouvé' });
      }

      // Store user credentials in request object for later use in the controller
      req.user = userInfo;

      // Continue to the next middleware or controller
      return next();
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      return res.status(401).json({ errorMessage: "Erreur d'authentification" });
    }
  },
};
