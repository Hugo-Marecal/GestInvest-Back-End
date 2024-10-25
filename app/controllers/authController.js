import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../datamappers/user.datamapper.js';
import auth from '../utils/auth.js';
import { sendVerifyEmail } from '../utils/sendEmail.js';

const authController = {
  async signup(req, res) {
    // Get the user data from the request body
    const { email, password, confirmation } = req.body;

    // Check that all fields are filled in
    if (!email || !password || !confirmation) {
      throw new Error('Veuillez remplir tous les champs');
    }

    // Check if the email is already in use and pass the regex test
    await auth.checkEmail(email);

    // Verify password, confirmation, pass the regex test and hash the password
    const hashedPassword = await auth.checkPassword(password, confirmation);

    // Create a token with the user email, will expire in 24 hours
    const verifyEmailToken = jwt.sign({ email }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });

    // Create the user in the database
    const newUser = await users.create({ email, password: hashedPassword, token: verifyEmailToken });
    if (!newUser) {
      throw new Error("Erreur lors de la creation de l'utilisateur.");
    }

    // Execute the function to send the email
    await sendVerifyEmail(email, verifyEmailToken);

    // Create a portfolio for the user
    await users.createPortfolio(newUser);

    // Send a success message
    res
      .status(201)
      .json({ successMessage: 'Compte créé, confirmez votre e-mail via le lien qui vient de vous être envoyé.' });
  },

  async login(req, res) {
    // Get the user data from the request body
    const { email, password } = req.body;

    // Get the user data from the database by email
    const user = await users.findByEmail(email);
    // If the user does not exist, throw an error
    if (!user) {
      throw new Error('Mauvais couple email / mot de passe');
    }

    if (!user.verified) {
      throw new Error('Veuillez vérifier votre email');
    }

    // Check if the password is correct
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new Error('Mauvais couple email / mot de passe');
    }

    // Create a token with the user email and id, will expire in 24 hours
    const token = jwt.sign({ email, user: user.id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
    res.status(201).json({ token });
  },

  async verifyEmail(req, res) {
    const { token } = req.params;

    if (!token) {
      throw new Error('Token invalide');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    if (!decodedToken) {
      throw new Error('Token invalide');
    }

    // Verify if the user exists
    const user = await users.findByEmail(decodedToken.email);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // if the user exist and he is not verified, update the user to verified
    if (user.verified) {
      res.redirect(
        'https://gest-invest.vercel.app/?errorMessage=Email%20déjà%20vérifié,%20veuillez%20maintenant%20vous%20connecter.',
      );
      return;
    }

    const verifyUser = await users.updateVerified(user.id, { verified: true });

    if (!verifyUser) {
      throw new Error("Erreur lors de la verification de l'email");
    }

    const deleteToken = await users.deleteToken(user.id);
    if (deleteToken.rowCount === 0) {
      throw new Error('Erreur lors de la suppression du token');
    }

    res.redirect(
      'https://gest-invest.vercel.app/?successMessage=Email%20vérifié%20avec%20succès,%20veuillez%20maintenant%20vous%20connecter.',
    );
  },
};
export default authController;
