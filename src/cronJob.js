
// const cron = require('cron');
// const moment = require('moment');
// const CHUNK_SIZE = 100;
// const {Slot} = require('./models');

// const job = new cron.CronJob({
//   cronTime: '0 0 * * * *', // runs every hour at the 0th minute
//   onTick: async function() {
//     try {
//       // Get the total count of rows in Slot
//       const count = await Slot.count();

//       // Update the rows in chunks of CHUNK_SIZE
//       for (let offset = 0; offset < count; offset += CHUNK_SIZE) {
//         const rows = await Slot.findAll({
//           offset,
//           limit: CHUNK_SIZE,
//         });

//         // Update the status of each row
//         for (const row of rows) {
//           const elapsedTime = moment().diff(moment(row.createdAt), 'hours');
//           if (elapsedTime >= row.elapsedTime) {
//             await row.update({ status: true });
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   },
//   start: false,
// });

// job.start();
