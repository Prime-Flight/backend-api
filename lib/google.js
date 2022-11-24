const { google } = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
} = process.env;
const OAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);
module.exports = {
    generateAuthURL: (req, res, next) => {
        const scopes = [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ];

        const authURL = OAuth2Client.generateAuthUrl({
            access_type: 'offline',
            response_type: 'code',
            scope: scopes
        }); 
        return authURL;
    },
    generateRefreshToken: async(accessToken) => {
        return new Promise( async(resolve, reject) => {
            try {
                var refreshTokens = await OAuth2Client.getRequestHeaders(accessToken);
                return resolve(refreshTokens);
            } catch(err) {
                return reject(err);
            }
        });
    },
    setCredentials: async(code) => {
        return new Promise( async(resolve, reject) => {
            try {
                const { tokens } = await OAuth2Client.generateAuthUrl(code);
                OAuth2Client.setCredentials(tokens);
                return resolve(tokens);
            } catch(err) {
                return reject(err);
            }
        });
    },
    getUserData: async() => {
        return new Promise( async(resolve, reject) => {
            try {
                var oauth = google.oauth2({
                    auth: OAuth2Client,
                    version: 'v2'
                });
                oauth.userinfo.get((err, res) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(res);
                    }
                });
            } catch(err) {
                reject(err);
            }
        });
    },
}
