const axios = require('axios')
const { fwurl } = require('../config.json')


function getFuzzworkMarketData ({ locationType, locationID, types}) {
    let request
    let fullURL = `${fwurl}/?${locationType}=${locationID}&types=${types}`

    request = axios.get(fullURL) 

    // Return the promise request, pre set the 'then' and 'catch' clauses
    return request
        .then(response => {
            return response.data
        }).catch((error) => {
            const fwError = error.response.data.error
            console.error(`Call to '${fullURL}' failed with error:`, fwError)
            throw Error(fwError)
        })
}

module.exports = getFuzzworkMarketData