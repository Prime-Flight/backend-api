const fetch = require('node-fetch')
const { AbortError } = require('node-fetch');
const { COUNTRY_API } = process.env;
const AbortController = globalThis.AbortController || require('abort-controller');
const controller = new AbortController();
const timeout = setTimeout(() => { controller.abort(); }, 10000); // timeout above 10000ms
const countries = require('../data/countries.json');
module.exports = {
    getCountry: async (req, res, next) => {
        try {
            let data = countries.data;
            return res.status(200).json({
                status: true,
                message: 'Successfully Get The Country List',
                data: data
            });
        } catch (err) {
            if (typeof(err) == Object) { 
                if (err instanceof AbortError) {
                    return res.status(500).json({
                        status: false,
                        message: "request was aborted",
                        data: null
                    });
                }
            }
            throw new Error(err);
        } finally {
            clearTimeout(timeout)
        }
    },

    getPhoneCode: async (req, res, next) => {
        try {
            const country_name = req.query;
            const response = await fetch(`${COUNTRY_API}/api/calls`, { method: 'GET', signal: controller.signal });
            let data = await response.json();
            const filteredPhoneCode = data.filter(code => {
                let isValid = true;
                for (key in country_name) {
                    if( isValid   )
                    isValid = isValid && code[key] == country_name[key];
                }
                return isValid;
            });
            return res.status(200).json({
                status: true,
                message: 'Successfully Get The Phone Code',
                data: {
                    country: filteredPhoneCode[0].country_name,
                    phone_code: filteredPhoneCode[0].phone_code
                }
            });
        } catch (err) {
            if (typeof(err) == Object) { 
                if (err instanceof AbortError) {
                    return res.status(500).json({
                        status: false,
                        message: "request was aborted",
                        data: null
                    });
                }
            }
            next(err)
        } finally {
            clearTimeout(timeout)
        }
    },
}
