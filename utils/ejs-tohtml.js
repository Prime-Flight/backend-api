// var fs = require('fs');
// var ejs = require('ejs');

// module.exports = {
//   toHTML: (ejsTemplateURL, data) => {
//     return new Promise(function(resolve, reject) {
//       fs.readFile(ejsTemplateURL, 'utf8', function(error, response) {
//         if (error) {
//           reject(error);
//         }
//         else {
//           var html = ejs.render(response, data);
//           resolve(html);
//         }
//       });
//     });
//   }
// }
