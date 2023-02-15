
const cron = require('node-cron');
const moment = require('moment');
const CHUNK_SIZE = 100;
const { Slot, Reservation } = require('./models');


// run every 1 hour 0 min   moment() date time
// cron.schedule('0 0 * * * *', async () => {
cron.schedule('*/10 * * * * *', async () => {   //run every 10 sec
    try {
        // Get the total count of rows in Slot
        const count = await Slot.count();
        // Update the rows in chunks of CHUNK_SIZE
        for (let offset = 0; offset < count; offset += CHUNK_SIZE) {
            const rows = await Slot.findAll({
                where: { isAvailable: false },
                offset,
                limit: CHUNK_SIZE,
            });

            // Update the status of each row
            rows.forEach(async (row) => {
                const currentT = new Date();
                const currentTime = moment(currentT);
                // if (!(currentTime.isAfter(moment(row.timeStart)) && currentTime.isBefore(moment(row.timeEnd)))) 
                if (currentTime.isAfter(moment(row.timeEnd))) {
                    await row.update({ isAvailable: true });
                    await Reservation.update({ status: activated }, { where: { slotId: row.id } });
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
});



// // log hi every 2 sec
// cron.schedule('*/2 * * * * *', async () => {
//     try {
//         console.log("hi")
//         console.log(`Running at ${new Date()}`);
//     } catch (error) {
//         console.error(error);
//     }
// });

////ISO date time  run every 1 hour
// cron.schedule('0 0 * * * *', async () => {
//     try {
//         // Get the total count of rows in Slot
//         const count = await Slot.count();

//         // Update the rows in chunks of CHUNK_SIZE
//         for (let offset = 0; offset < count; offset += CHUNK_SIZE) {
//             const rows = await Slot.findAll({
//                 where: { isAvailable: false },
//                 offset,
//                 limit: CHUNK_SIZE,
//             });

//             // Update the status of each row
//             rows.forEach(async (row) => {
//                 const currentTime = new Date().toISOString();
//                 if (!(currentTime > row.timeStart && currentTime < row.timeEnd)) {
//                     await row.update({ isAvailable: true });
//                 }
//             });

//         }
//     } catch (error) {
//         console.error(error);
//     }
// });




//Time date
// const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
// const currentIsoTime = new Date(currentTime).toISOString();
// console.log(currentIsoTime);
// console.log(moment().toISOString());

// const moment = require('moment');
// const dateTime1 = moment('2023-02-13T01:41:47+07:00');
// const dateTime2 = moment('2023-02-12T18:41:47.000Z');

// const dateTime2InLocal = dateTime2.local().utcOffset(dateTime1.utcOffset());

// console.log(dateTime1.toISOString());
// console.log(dateTime2InLocal.toISOString());
// "2023-02-13T01:41:47+07:00"

// 2023-02-13T01:57:47+07:00   ==>  moment object
//can create moment object by  moment(time) 
