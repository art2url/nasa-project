const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
    return res.status(200).json(await getAllPlanets()); // return and status 200 not needed BUT better to use
}

module.exports = {
    httpGetAllPlanets,
};
