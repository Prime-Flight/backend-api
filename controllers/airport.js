const fetch = require('node-fetch')
const { AIRPORT_API_HOST } = process.env;
module.exports = {
    getAirport: async (req, res, next) => {
        try {
            const { keyword } = req.params
            console.log(keyword)
            const url = `${AIRPORT_API_HOST}/airport/suggest/${keyword}`
            const options = {
                method: "GET",
                timeout: 10000,
            }
            const response = await fetch(url, options)
                .then(res => res.json())
                .catch(e => {
                    console.log(e)
                })
            // console.log("RESPONSE: ", response)
            let airport = [];

            response.features.forEach(function (data) {
                let addData = {
                    name: data.properties.name,
                    type: data.properties.type,
                    location: {
                        location_code: data.properties.region.code,
                        region: data.properties.municipality,
                        country: data.properties.country.name,
                        continent: data.properties.country.continent
                    },
                    code: {
                        iata: data.properties.iata,
                        icao: data.properties.gps_code
                    }
                }
                airport.push(addData)
            })

            if (!response.features[0]) {
                return res.status(400).json({
                    status: false,
                    message: "Cannot provide airport information because it is unavailable",
                    data: null
                })
            }
            if (response) {
                return res.status(200).json({
                    status: true,
                    message: 'Successfully get airport information',
                    data: {
                        airport
                    }
                })
            }
        } catch (err) {
            next(err)
        }
    }

}
