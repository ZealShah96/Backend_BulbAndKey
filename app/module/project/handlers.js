var DataService = require('./../../service/DataService');
var UtilityService = require('./../../service/utilityservice');
const redis = require('./../../service/redisservice');
var fields = 'project_id name';
var currenthandlers = require('./handlers');
var userhandlers = require('./../user/handlers');
const modelname = "Project";
const primarykey = "project_id";
const selectedData = "user_id firstname lastname phone_no country_code email avatar is_creator is_active created_date updated_date";
const allowedData = "project_id name type is_show_case_allow avatar is_creator is_active created_date updated_date";
const notallowedData = " is_creator is_active created_date updated_date _id address_id id _v is_deleted " + primarykey;
'use strict';

//#region project basic operations
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
exports.userdetails = async function (request, replay) {
    try {

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
        let dataAdded = await DataService.create("Project", "project_id", request.payload, { "incrementallow": true });
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

//#endregion




//#region projects apis
/**
 * 
 *
 * @summary get projects details
 * @desc Route:
  <ol>
    <li>/api/project/view</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.projectview = async function (request, replay) {
    try {
        var Objects = {};
        // Objects.populate = "user_details";
        let dataUpdated = await DataService.findModel(modelname, { [primarykey]: request.payload.project_id, "user_id": request.payload.user_id }, allowedData + " " + "user_id", Objects);
        dataUpdated.Result = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result, (allowedData + " " + "user_id").split(' '), false);
        let json = {};
        // let json = JSON.stringify(UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result[0][Objects.populate], notallowedData.split(' '), true));
        if (dataUpdated.Result.length > 0 && dataUpdated.StatusCode==200) {

            let data={"StatusCode":200,"Result":{"data":dataUpdated.Result}};

            return UtilityService.replayData(replay,data);
        }
        else if (dataUpdated.Result.length == 0) {
            throw new Error("There is no data avaiable with this user and project_id");
        }

    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}

//#endregion


//#region Project actions
/**
 * 
 *
 * @summary get projects details
 * @desc Route:
  <ol>
    <li>/api/project/view</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.projectview = async function (request, replay) {
    try {
        var Objects = {};
        // Objects.populate = "user_details";
        let dataUpdated = await DataService.findModel(modelname, { [primarykey]: request.payload.id, "user_id": request.payload.user_id }, allowedData + " " + "user_id", Objects);
        dataUpdated.Result = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result, (allowedData + " " + "user_id").split(' '), false);
        let json = {};
        // let json = JSON.stringify(UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result[0][Objects.populate], notallowedData.split(' '), true));
        if (dataUpdated.Result.length > 0 && dataUpdated.StatusCode==200) {

            let data={"StatusCode":200,"Result":{"data":dataUpdated.Result}};

            return UtilityService.replayData(replay,data);
        }
        else if (dataUpdated.Result.length == 0) {
            throw new Error("There is no data avaiable with this user and project_id");
        }

    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}


/**
 * 
 *
 * @summary get projects details
 * @desc Route:
  <ol>
    <li>/api/project/close</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.projectclose = async function (request, replay) {
    try {
        var Objects = {};
        // Objects.populate = "user_details";
        let projectidneedtoclose=(request.payload.id!=null && request.payload.id>0?request.payload.id:request.payload.user_id);
        let data = await DataService.findModel(modelname, { [primarykey]:projectidneedtoclose}, allowedData + " " + "user_id", Objects);
        let dataUpdated=await DataService.patch(modelname, { [primarykey]:projectidneedtoclose},{"is_active":false}, Objects);
        dataUpdated.Result = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result, ("project_id").split(' '), false);
        let json = {};
        // let json = JSON.stringify(UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result[0][Objects.populate], notallowedData.split(' '), true));
        if (dataUpdated.Result != undefined && dataUpdated.StatusCode==200) {

            let data={"StatusCode":200,"Result":{"data":dataUpdated.Result}};

            return UtilityService.replayData(replay,data);
        }
        else if (dataUpdated.Result == undefined) {
            throw new Error("There is no data avaiable with this user and project_id");
        }

    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}



/**
 * 
 *
 * @summary get projects details
 * @desc Route:
  <ol>
    <li>/api/project/close</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.projectclose = async function (request, replay) {
    try {
        var Objects = {};
        // Objects.populate = "user_details";
        let projectidneedtoclose=(request.payload.id!=null && request.payload.id>0?request.payload.id:request.payload.user_id);
        let data = await DataService.findModel(modelname, { [primarykey]:projectidneedtoclose}, allowedData + " " + "user_id", Objects);
        let dataUpdated=await DataService.patch(modelname, { [primarykey]:projectidneedtoclose},{"is_active":false}, Objects);
        dataUpdated.Result = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result, ("project_id").split(' '), false);
        let json = {};
        // let json = JSON.stringify(UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result[0][Objects.populate], notallowedData.split(' '), true));
        if (dataUpdated.Result != undefined && dataUpdated.StatusCode==200) {

            let data={"StatusCode":200,"Result":{"data":dataUpdated.Result}};

            return UtilityService.replayData(replay,data);
        }
        else if (dataUpdated.Result == undefined) {
            throw new Error("There is no data avaiable with this user and project_id");
        }

    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}


/**
 * 
 *
 * @summary get projects details
 * @desc Route:
  <ol>
    <li>/web/project/delete</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.projectdelete = async function (request, replay) {
    try {
        var Objects = {};
        // Objects.populate = "user_details";
        let projectidneedtoclose=(request.payload.id!=null && request.payload.id>0?request.payload.id:request.payload.user_id);
        let data = await DataService.findModel(modelname, { [primarykey]:projectidneedtoclose}, allowedData + " " + "user_id", Objects);
        let dataUpdated=await DataService.patch(modelname, { [primarykey]:projectidneedtoclose},{"is_deleted":true}, Objects);
        dataUpdated.Result = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result, ("project_id").split(' '), false);
        let json = {};
        // let json = JSON.stringify(UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataUpdated.Result[0][Objects.populate], notallowedData.split(' '), true));
        if (dataUpdated.Result != undefined && dataUpdated.StatusCode==200) {

            let data={"StatusCode":200,"Result":{"data":dataUpdated.Result}};

            return UtilityService.replayData(replay,data);
        }
        else if (dataUpdated.Result == undefined) {
            throw new Error("There is no data avaiable with this user and project_id");
        }

    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}

/**
 * create
 *
 * @summary Create A new record Of Specific Model
 * @desc Route:
  <ol>
    <li>/web/project/cake</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.createCakeProject = async function (request, replay) {
    try {
        request.payload["type"]="cake";
        request.payload["expected_date"]=await UtilityService.dateTimeConcate(request.payload["expected_date"],request.payload["expected_time"]);
        let dataAdded = await DataService.create("Project", "project_id", request.payload, { "incrementallow": true });
               
        dataAdded.Result=UtilityService.removeFieldsWhichAreNotAllwoedToEdit(dataAdded.Result,notallowedData.replace('project_id','').split(' '),true);
        let json = JSON.stringify(await dataAdded);
        if (dataAdded != null)
            return UtilityService.replayData(replay, dataAdded);
    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
       
    }
}


//#endregion