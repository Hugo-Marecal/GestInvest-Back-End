import bcrypt from 'bcrypt';
import userDatamapper from '../datamappers/user.datamapper.js';

export default {
  async checkPassword(password, confirmPassword) {
    // Check that passwords match
    if (password !== confirmPassword) {
      throw new Error('Erreur mot de passe');
    }

    // Check password complexity with a regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et avoir une longueur minimale de 8 caractères.',
      );
    }

    // We hash the password before storing it in the DB
    const numberSaltRounds = parseInt(process.env.NB_OF_SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, numberSaltRounds);
    return hashedPassword;
  },

  async checkEmail(email) {
    // Check that the email is valid with a regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email invalide');
    }

    // Check that the email isn't already in use
    const alreadyExistingUser = await userDatamapper.findByEmail(email);
    if (alreadyExistingUser) {
      throw new Error('Cet email est déjà utilisé');
    }
  },
};
