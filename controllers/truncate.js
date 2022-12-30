const { SeatNumber } = require('../db/models');

module.exports = {
    seatNumber: async () => {
        await SeatNumber.destroy({ truncate: true, restartIdentity: true });
    }
};