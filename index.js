// Imports the createServer function from the 'http' node module
import { createServer } from 'node:http';

// Imports dotenv module configuration to load environment variables from an .env file
import 'dotenv/config';

// Imports the main application from the specified path
import app from './app/index.app.js';

// Sets the port on which the server will listen, using the PORT environment variable if defined, otherwise the default port is 3000
const PORT = process.env.PORT || 3000;

// Creates an HTTP server using node.js's createServer function, passing the main application as the request handler
const httpServer = createServer(app);

// Starts the HTTP server on the specified port
httpServer.listen(PORT, () => {
  // Checks if node environment is not set to 'production'.
  if (process.env.NODE_ENV !== 'production') {
    // Displays a message indicating that the HTTP server has been started, with the access URL
    console.log(`🚀 HTTP Server launched at http://localhost:${PORT} 🎉`);
  }
});
