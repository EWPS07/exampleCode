const rootController = {}
const path = require('path')

module.exports = {
    getRootResponse: async (req, res, next) => {
        console.log('ROOT RESPONSE')
        res.sendFile(__dirname + `/root.html`);
    }
}