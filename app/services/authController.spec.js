/* eslint-disable */
import authController from '../controllers/authController';
import 'dotenv/config';

// Start of function to test authController
describe('signup function', () => {
  // Check that the signup function returns an error message if a field is missing
  it('should return error message if any field is missing', async () => {
    //
    const req = { body: { email: '', password: '', confirmation: '' } };
    // Creating a fake request object for unit testing
    const res = {
      // Method for setting the response status code
      status(code) {
        this.statusCode = code; // Assigns the status code to the object's statusCode property
        return this; // Returns the object itself to allow chaining of methods
      },
      // Method for sending JSON data in the response
      json(data) {
        this.data = data; // Assigns JSON data to the object's data property
      },
    };

    try {
      await authController.signup(req, res);
    } catch (error) {
      // If an error is thrown, check if it's the expected error
      expect(error instanceof Error).toBe(true);
      expect(error.message).toBe('Veuillez remplir tous les champs'); // Check if the error message is as expected
    }
  });

  // Check that the signup function returns an error message if the password and confirmation do not match
  it('should return error message if passwords do not match', async () => {
    const req = { body: { email: 'test@example.com', password: 'password', confirmation: 'wrongpassword' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
      },
    };

    try {
      await authController.signup(req, res);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect(error.message).toBe('Erreur mot de passe');
    }
  });

  // Check that the signup function returns a success message if the user is created
  it('should return succes message if user is created', async () => {
    const req = { body: { email: 'test@modale11.io', password: 'Password1234!', confirmation: 'Password1234!' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
      },
    };

    await authController.signup(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.data).toEqual({ successMessage: expect.any(String) });
  });

  // Check that the login function returns the token if the login is successful
  it('should return token for valid login', async () => {
    const req = { body: { email: 'non@gmail.com', password: 'Newmdp123!' } };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
      },
    };

    await authController.login(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.data).toEqual({ token: expect.any(String) });
  });
});
