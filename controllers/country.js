const fetch = require('node-fetch')
const { AbortError } = require('node-fetch');
const { COUNTRY_API } = process.env;
const AbortController = globalThis.AbortController || require('abort-controller');
const controller = new AbortController();
const timeout = setTimeout(() => { controller.abort(); }, 10000); // timeout above 10000ms
module.exports = {
    getCountry: async(req, res, next) => {
        try {
            const response = await fetch(`${COUNTRY_API}/api/countries`, { method: 'GET', signal: controller.signal });
            let data = await response.json()
            return res.status(200).json({
                status: true,
                message: 'Successfully Get The Country List',
                data: data
            });
        } catch (err) {
            if (err instanceof AbortError) {
                return res.status(500).json({
                    status: false,
                    message: "request was aborted",
                    data: null
                });
            }
            throw new Error(err);
        } finally {
            clearTimeout(timeout)
        }
    }
}
