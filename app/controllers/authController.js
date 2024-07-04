import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../datamappers/user.datamapper.js';
import auth from '../utils/auth.js';

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

    // Create the user in the database
    const newUser = await users.create({ email, password: hashedPassword });
    if (!newUser) {
      throw new Error('Erreur lors de la creation de votre portefeuille.');
    }

    // Create a portfolio for the user
    await users.createPortfolio(newUser);

    // Send a success message
    res.status(201).json({ successMessage: 'Votre compte a bien été créé, veuillez à présent vous authentifier' });
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

    // Check if the password is correct
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new Error('Mauvais couple email / mot de passe');
    }

    // Create a token with the user email and id, will expire in 24 hours
    const token = jwt.sign({ email, user: user.id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
    res.status(201).json({ token });
  },
};

export default authController;
