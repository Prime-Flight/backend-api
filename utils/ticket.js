const QRCode = require('qrcode');
const pdf = require('pdf-creator-node');
const path = require('path');
const fs = require('fs');
const imagekit = require('../utils/imagekit');
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

module.exports = {
  generateQR: async (url, data) => {
    try {
      return new Promise(async(resolve, reject) => {
        QRCode.toDataURL(url, async(err, barcode) => {
          if (err) return reject("error create url");
          const barcodeUpload = await imagekit.upload({
            file: barcode,
            fileName: currentDate + data[0].booking_code + '_barcode.png' 
          });
          return resolve(barcodeUpload.url);
        });
      })
    } catch (err) {
      throw new Error(err);
    }
  },
  generateInvoice: async (filename, data, email) => {
    try {
      return new Promise(async (resolve, reject) => {
        const moment = require('moment');
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = __dirname + '/../views/document/' + data[0].booking_code;
        const html = fs.readFileSync(path.join(__dirname, '../views/ticket/ticket.html'), 'utf-8');
        const airlineInfo = data[0]; 
        
        // create currency
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' });
        const totalPrice = formatter.format(data[0].total_seat * data[0].price_per_seat);

        // crete document
        const document = {
            html: html,
            data: {
                bookingInfo: { data, email, airlineInfo, totalPrice }
            },
            path: result + currentDate + '.pdf'
        }

        // document options
        const options = {
          phantomPath: "../node_modules/phantomjs-prebuilt/bin/phantomjs",
          childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            },
              formate: 'A4',
              orientation: 'landscape',
              border: '2mm',
              header: {
                  height: '15mm',
                  contents: '<h4 style=" color: black;font-size:20;font-weight:800;text-align:center;">CUSTOMER INVOICE</h4>'
              },
        }

        // generate invoice
        pdf.create(document, options)
            .then(async(res) => {
                // read the file as base64 so it can be uploaded into the imagekit cloud storage
                const file = fs.readFileSync(res.filename, { encoding: 'base64' });
                // upload to imagekit
                const ticketUpload = await imagekit.upload({
                  file: file,
                  fileName: currentDate + data[0].booking_code + '.pdf' 
                });
                // delete the document after upload to imagekit
                fs.unlinkSync(res.filename);
                // return the url
                return resolve(ticketUpload.url);
            }).catch(error => {
                return reject(error);
            });
      });
    } catch (err) {
      throw new Error(err)
    }
  },
};
