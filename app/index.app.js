// Import Express
import express from 'express';

// Import Cors
import cors from 'cors';

// Import CRON
// import task from './utils/API/CRON.js';
// import cryptoApi from './utils/API/api.crypto.js';
// import stockApi from './utils/API/api.stock.js';

// Import main router of the application
import router from './routers/index.api.router.js';

// Create an instance of Express
const app = express();

// const corsOptions = {
//   // origin: 'http://localhost:5173',
//   origin: 'https://gestinvest-front-8af1ad4ce95a.herokuapp.com/',
//   optionsSuccessStatus: 200
// };

// Use the CORS middleware to allow cross-origin requests between the front-end and the back-end
app.use(cors());

// Use the express.json() middleware to parse JSON requests
app.use(express.json());

// Use the express.urlencoded() middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Route for execute CRON job in vercel
// app.get('/api/cron', async (req, res) => {
//   try {
//     await cryptoApi.getPriceCrypto(1, 60);
//     await stockApi.getPriceStock(2, 40);
//     res.status(200).send('Cron job exécuté avec succès.');
//   } catch (error) {
//     console.error("Erreur lors de l'exécution du cron job :", error);
//     res.status(500).send("Erreur lors de l'exécution du cron job.");
//   }
// });

// Use the main router to manage all the routes of the application
app.use(router);

// Trigger the CRON task
// task.start();

// Export the app instance
export default app;
