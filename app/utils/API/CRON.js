// import 'dotenv/config';
// import cron from 'node-cron';
// import cryptoApi from './api.crypto.js';
// import stockApi from './api.stock.js';

// const task = cron.schedule(
//   '0 0,12 * * *', // Scheduling of task execution twice a day, at midnight and noon, Paris time
//   async () => {
//     // Asynchronous function executed each time the task is triggered
//     await cryptoApi.getPriceCrypto(1, 60);
//     await stockApi.getPriceStock(2, 40);
//   },
//   {
//     scheduled: true,
//     timezone: 'Europe/Paris',
//   },
// );

// export default task;
