import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userDatamapper from '../datamappers/user.datamapper.js';
import auth from '../utils/auth.js';

const accountController = {
  async getUser(req, res) {
    // Get the user id from the token stored in the request object
    const { id } = req.user;

    // Get the user data from the database
    const user = await userDatamapper.findOneWithoutPassword(id);

    res.json({ user });
  },

  async updateUser(req, res) {
    // Get the new user data from the request body
    const newEmail = req.body.email;
    const { firstname } = req.body;
    const { lastname } = req.body;
    const { password } = req.body;
    let userUpdated;
    let token;

    // Get the user id from the token stored in the request object
    const { id } = req.user;

    // Get the user data from the database
    const user = await userDatamapper.findOne(id);

    // Check if the email has been modified
    if (newEmail !== user.email) {
      // if the email has been modified, check if the new email is already in use and pass the regex test
      await auth.checkEmail(newEmail);

      // Email has been modified, generate a new token with the new email
      token = jwt.sign({ email: newEmail, user: user.id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '24h' });
    }

    // Check if the password has been modified
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      const { confirmation } = req.body;

      // verify password, confirmation, pass the regex test and hash the password
      const hashedPassword = await auth.checkPassword(password, confirmation);

      // Store all the data in an object
      const dataUser = {
        email: newEmail,
        firstname,
        lastname,
        password: hashedPassword,
        updatedAt: new Date(),
      };

      // Update the user data in the database
      userUpdated = await userDatamapper.update(id, dataUser);
      res.json({ userUpdated, token });
      return;
    }

    // Store all the data in an object
    const dataUser = {
      email: newEmail,
      firstname,
      lastname,
      password: user.password,
      updatedAt: new Date(),
    };

    // Update the user data in the database
    userUpdated = await userDatamapper.update(id, dataUser);
    res.json({ userUpdated, token });
  },
};

export default accountController;
