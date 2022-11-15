const {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById, } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;
    const launchProperties = ['mission', 'rocket', 'target', 'launchDate'];
    let counter = 0;
    try {
        for (const [key, value] of Object.entries(launch)) {
            launch.launchDate = new Date(launch.launchDate);
            if (!launch.hasOwnProperty(launchProperties[counter])) {
                return res.status(400).json({
                    message: "CODE: 400, Missing required launch property. Status 1 Key pair missing",
                })
            }
            if (!value || value === undefined) {
                return res.status(400).json({
                    message: "CODE: 400, Missing required launch property. Status 2 Value pair missing",
                })
            }
            if (isNaN(launch.launchDate)) {
                return res.status(400).json({
                    message: "CODE: 400, Invalid Date Property"
                })
            }
        }
        counter++;
        addNewLaunch(launch);
    } catch (error) {
        return res.status(500).json({
            message: "CODE 500, Internal Server Error, " + error
        })
    }

    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    //Returns 404 if laucnchId not found
    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: 'CODE: 404, Launch not found'
        })
    }

    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);

}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}