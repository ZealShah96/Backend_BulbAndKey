var DataService = require('./../../service/DataService');
var UtilityService = require('./../../service/utilityservice');
const redis = require('./../../service/redisservice');
var fields = 'project_id name';
'use strict';


/**
 * List
 *
 * @summary Test project api is working or not
 * @desc Route:
  <ol>
    <li>/api/project/test/{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.test = async function (request, replay) {
    try {
        let cachetestppass = await UtilityService.redisCheck(request.headers.cachedata);
        let requesttestpass = true;
        let count = await DataService.count("Project", "project_id", fields, {});
        let lastnumber = await DataService.lastentry("Project", "project_id", fields, {});
        let data = { "StatusCode": 200, "Result": { "cachetestppass": cachetestppass, "requesttestpass": requesttestpass, "count": (count.Result != null ? count.Result.length : 0), "lastow": lastnumber.Result != null ? lastnumber.Result : "NA" } };
        return UtilityService.replayData(replay, data);
    }
    catch (e) {
        let data = { "StatusCode": 200, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data)
        // "This is a error ||    " + e;

    }
}





/**
 * List
 *
 * @summary get list of all product list
 * @desc Route:
  <ol>
    <li>/api/project</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.list = async function (request, replay) {
    try {
        utilityService.log("Process Start.");
        let condition = "";
        try {
            condition = request.headers.condition != undefined ? JSON.parse(request.headers.condition) : null;
        }
        catch (error) {
            condition = { "is_active": true };
        }
        fields = UtilityService.setupFieldsForRetriving(request, fields);
        let data = await DataService.findModel("Project",
            condition, fields, {});
        utilityService.log("Process End.");
        //let json=JSON.stringify(data);
        if (data != null) {
            return UtilityService.replayData(replay, data);
        }
    }
    catch (e) {
        return "This is a error || " + e;
    }
}


/**
 * List
 *
 * @summary get list of all product list
 * @desc Route:
  <ol>
    <li>/api/project/userdetails</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.list = async function (request, replay) {
    try {
        utilityService.log("Process Start.");
        let condition = "";
        try {
            condition = request.headers.condition != undefined ? JSON.parse(request.headers.condition) : null;

        }
        catch (error) {
            condition = { "is_active": true };
        }
        fields = UtilityService.setupFieldsForRetriving(request, fields);
        var Objects = {};
        Objects.populate = UtilityService.retrivepopulatedata(request);
        let data = await DataService.findModel("Project",
            condition, fields, Objects);
        utilityService.log("Process End.");
        //let json=JSON.stringify(data);
        if (data != null) {
            return UtilityService.replayData(replay, data);
        }
        // throw new Error(response);
    }
    catch (e) {
        return "This is a error || " + e;
    }
}


/**
 * create
 *
 * @summary Create A new record Of Specific Model
 * @desc Route:
  <ol>
    <li>/api/project/create/{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.create = async function (request, replay) {
    try {
        //   let data=await DataService.findModel("Project",{},'first_name last_name employee_id',{});
        let dataAdded = await DataService.create("Project", "project_id", request.payload, {});
        let json = JSON.stringify(await dataAdded);
        if (dataAdded != null)
            return UtilityService.replayData(replay, dataAdded);
    }
    catch (e) {
        return "This is a error ||   " + e;
    }
}


/**
 * Delete
 *
 * @summary Delete Record From Database based on condition provide 
 * @desc Route:
  <ol>
    <li>/api/project/delete/{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.delete = async function (request, replay) {
    try {
        //   let data=await DataService.findModel("Project",{},'first_name last_name employee_id',{});
        let dataDeleted = await DataService.delete("Project", { 'project_id': request.params.id }, {});
        let json = JSON.stringify(await dataDeleted);
        if (json != null)
            return UtilityService.replayData(replay, dataDeleted);
    }
    catch (e) {
        return "This is a error ||   " + e;
    }
}



/**
 * update
 *
 * @summary patch project details
 * @desc Route:
  <ol>
    <li>/api/project/patch//{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.patch = async function (request, replay) {
    try {
        //   let data=await DataService.findModel("Project",{},'first_name last_name employee_id',{});
        let dataUpdated = await DataService.patch("Project", { "project_id": request.params.id }, request.payload, {});
        let json = JSON.stringify(await dataUpdated);
        if (json != null)
            return UtilityService.replayData(replay, dataUpdated);
    }
    catch (e) {
        return "This is a error ||   " + e;
    }
}

