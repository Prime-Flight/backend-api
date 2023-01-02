const pdf = require('html-pdf');

module.exports = {
  toPDF: async (html, options, output) => {
    return new Promise(function(resolve, reject) {
      pdf.create(html, { childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toFile(output, function(error, response) {
        if (error) {
          reject(error);
        }
        else {
          resolve(response);
        }
      });
    });
  }
}
