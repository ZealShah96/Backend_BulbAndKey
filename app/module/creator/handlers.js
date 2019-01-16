var DataService = require('./../../service/DataService');
var UtilityService = require('./../../service/utilityservice');
const redis = require('./../../service/redisservice');
var currenthandlers = require('./handlers');
var userhandlers = require('./../user/handlers');
var fields = 'creator_id flat_no';
const modelname = "Creator";
const primarykey = "creator_id";
const selectedData = "user_id firstname lastname phone_no country_code email avatar is_creator is_active created_date updated_date";
const allowedData = " creator_id business_name phone_no country_code email avatar is_creator is_active created_date updated_date";
const notallowedData = " is_creator is_active created_date updated_date _id address_id id _v is_deleted " + primarykey;
'use strict';

//#region Creator's APIs
/**
 * List
 *
 * @summary Creator sign up
 * @desc Route:
  <ol>
    <li>/api/Creator/signup</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.signup = async function (request, replay) {
    try {
        let newCreatedUser = await createNewUserForCreator(request.payload);
        let newCreatedCreator = await createNewCreatorWithConnectedUser(request.payload, newCreatedUser);
        let data = { "StatusCode": 200, "Result": { "creator_id": newCreatedCreator.creator_id, "user_id": newCreatedUser.user_id } };
        return UtilityService.replayData(replay, data);
    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
        // "This is a error ||    " + e;

    }
}

async function createNewUserForCreator(data) {
    data.is_active = false;
    data.is_deleted = false;
    data.is_creator = true;
    let lastcount = await DataService.count("User", "user_id", {}, { "incrementallow": false });
    data.user_id = (lastcount.Result.length > 0 ? ++lastcount.Result[lastcount.Result.length - 1].user_id : 1);
    let newCreatedUser = await DataService.create("User", "phone_no", data, { "incrementallow": false });
    if (newCreatedUser.StatusCode == 201) {
        return newCreatedUser.Result;
    }
    else {
        throw new Error(newCreatedUser.Result);
    }
}

async function createNewCreatorWithConnectedUser(data, user) {

    data.is_active = false;
    data.is_deleted = false;
    data.is_creator = true;
    data.user_id = user.user_id;
    let lastcount = await DataService.count(modelname, primarykey, {}, { "incrementallow": false });
    data[primarykey] = (lastcount.Result.length > 0 ? ++lastcount.Result[lastcount.Result.length - 1][primarykey] : 1);
    let newCreatedUser = await DataService.create(modelname, "phone_no", data, { "incrementallow": false });
    if (newCreatedUser.StatusCode == 201) {
        return newCreatedUser.Result;
    }
    else {
        throw new Error(newCreatedUser.Result);
    }

}


/**
 * List
 *
 * @summary Creator sign up
 * @desc Route:
  <ol>
    <li>/web/creator/profile/{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */

exports.profile = async function (request, replay) {
    try {
        let checkPassedperametersofrequest = false;
        let condition = UtilityService.parseCondition(request, checkPassedperametersofrequest);
        fields = UtilityService.setupFieldsForRetriving(request, fields);
        let data = await DataService.findModel(modelname, condition, fields, {});
        data.Result = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(data.Result, notallowedData.split(' '), true);
        //let json=JSON.stringify(data);
        if (data.Result.length > 0) {
            return UtilityService.replayData(replay, data);
        }
        else {
            throw new Error("No records Founds");
        }
    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}
//#endregion

//#region Creator's APIs for quoting 
exports.submitquote = async (request, replay) => {
    try {
        let creator = await findCreator(request);
        let project = await findProject(request);
        let quote = await createNewQuoteWithConnectedUser(request.payload, creator, project);
        // let newCreatedCreator = await createNewCreatorWithConnectedUser(request.payload, newCreatedUser);
        let data = { "StatusCode": 200, "Result": { "data": quote.quote_id } };
        return UtilityService.replayData(replay, data);
    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
        // "This is a error ||    " + e;

    }
}


exports.withdrawquote = async (request, replay) => {
    try {
        let creator = await findCreator(request);
        let project = await findProject(request);
        request.payload.withdraw_reason = request.payload.withdraw_reason != undefined ? request.payload.withdraw_reason : false;
        request.payload.withdraw_comments = request.payload.withdraw_comments != undefined ? request.payload.withdraw_comments : "No comments Provided";

        if (request.payload.withdraw_reason != false) {
            let quote = await updateQuoteWithConnectedUser(request.payload, creator, project);
            let data = { "StatusCode": 200, "Result": { "data": quote.quote_id } };
            return UtilityService.replayData(replay, data);
        }
        else {
            throw new Error("No reason provided for withdraw so withdraw is not possible.");
        }
        // let newCreatedCreator = await createNewCreatorWithConnectedUser(request.payload, newCreatedUser);

    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
        // "This is a error ||    " + e;

    }
}


exports.notquotedprojects = async (request, replay) => {
    try {
        let creator = await findCreator(request);
        if (creator != null && creator != undefined) {
            let notquotedprojects = await findListOfProjectsForQuotations({ "creator_id": creator.creator_id, "is_deleted": false, "is_active": true }, creator);
            let data = { "StatusCode": 200, "Result": { "data": notquotedprojects } };
            return UtilityService.replayData(replay, data);
        }
        else {
            throw new Error("No reason provided for withdraw so withdraw is not possible.");
        }
    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}

exports.quotedprojects = async (request, replay) => {
    try {
        let creator = await findCreator(request);
        if (creator != null && creator != undefined) {
            let notquotedprojects = await findListOfProjectsForQuotations({ "creator_id": creator.creator_id, "is_deleted": false, "is_active": true }, creator, true);
            let data = { "StatusCode": 200, "Result": { "data": notquotedprojects } };
            return UtilityService.replayData(replay, data);
        }
        else {
            throw new Error("No reason provided for withdraw so withdraw is not possible.");
        }
    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}

exports.projectdetail = async (request, replay) => {
    try {
        let creator = await findCreator(request);
        let project = await findProject(request);

        if (creator != null && creator != undefined && project != null && project != undefined) {
            try {
                var quote = await findQuotes({ "creator_id": creator.creator_id, "project_id": project.project_id, "is_deleted": false, "is_active": true });
            }
            catch (e) {
                if (e.message == "No records Found") {
                    var quote = {};
                }
            }
            //let quote = await findQuotes({ "creator_id": creator.creator_id, "project_id": project.project_id, "is_deleted": false, "is_active": true });
            project=UtilityService.removeFieldsWhichAreNotAllwoedToEdit(project,notallowedData+" user_details user_active id __v",true);
            if (quote!={} && quote!=undefined) {
                Object.assign(project._doc, { "quote": quote});
                let data = { "StatusCode": 200, "Result": { "data": project } };
                return UtilityService.replayData(replay, data);
            }
            else {
                // project["quote"] = "No Quotes";
                Object.assign(project._doc, { "quote": "No Quotes" });
                let data = { "StatusCode": 200, "Result": { "data": project } };
                return UtilityService.replayData(replay, data);
            }
        }
        else {
            if (creator != null && creator != undefined) {
                throw new Error("no creator is not avaibale.");
            }
            else if (project != null && project != undefined) {
                throw new Error("no project is not avaiable.");
            }

        }
    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}

exports.awardedprojectdetail = async (request, replay) => {
    try {
       // let creator = await findCreator(request);
        let project = await findProjectwithcondition({"project_id": UtilityService.parseCondition(request, false).project_id,"winner":UtilityService.parseCondition(request, false).user_id},notallowedData+"user_details user_active id __v",{"populate":"winner_details"});

        if (project.length>0) {
         //   project=UtilityService.removeFieldsWhichAreNotAllwoedToEdit(project,notallowedData+" user_details user_active id __v",true);
           // if (quote!={} && quote!=undefined) {
              //  Object.assign(project._doc, { "quote": quote});
              UtilityService.removeFieldsWhichAreNotAllwoedToEdit(project[0].winner_details,notallowedData+" user_details user_active id __v",true);
                let data = { "StatusCode": 200, "Result": { "data": project } };
                return UtilityService.replayData(replay, data);
           // }
          //  else {
                // project["quote"] = "No Quotes";
         //       Object.assign(project._doc, { "quote": "No Quotes" });
         //       let data = { "StatusCode": 200, "Result": { "data": project } };
         //       return UtilityService.replayData(replay, data);
         //   }
        }
        else {
           // if (creator != null && creator != undefined) {
           //     throw new Error("no creator is not avaibale.");
          //  }
           // else if (project != null && project != undefined) {
                throw new Error("There is some issue.");
          //  }

        }
    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
    }
}

exports.changestatus = async (request, replay) => {
    try {
        let creator = await findCreator(request);
        let project = await findProject(request);
        if (request.payload.status != false && creator.user_id==project.winner) {
            let updatecreator = await updateProjectcondition({"project_id":creator.creator_id},request.payload, creator, project);
            let data = { "StatusCode": 200, "Result": { "data":creator.creator_id} };
            return UtilityService.replayData(replay, data);
        }
        else {
            if(creator.user_id!=project.winner){
                throw new Error("user_id you passed is not same as winner creator.");
            }
            throw new Error("Staus is only change to accept.");
        }
        // let newCreatedCreator = await createNewCreatorWithConnectedUser(request.payload, newCreatedUser);

    }
    catch (e) {
        let data = { "StatusCode": 601, "Result": { "Error": "This is a error || " + e } };
        return UtilityService.replayData(replay, data);
        // "This is a error ||    " + e;

    }
}

async function findCreator(request) {
    let condition = UtilityService.parseCondition(request, false);
    let creator = await DataService.findModel(modelname, { "user_id": condition.user_id, "is_active": true, "is_deleted": false }, {}, { "populate": "user_details" });

    // let newCreatedUser = await DataService.create("User", "phone_no", data, { "incrementallow": false });
    if (creator.StatusCode == 200) {
        return creator.Result[0];
    }
    else {
        throw new Error(creator.Result);
    }
}


async function findProject(request) {
    let condition = UtilityService.parseCondition(request, false);
    let project = await DataService.findModel("Project", { "project_id": condition.project_id, "is_active": true, "is_deleted": false }, {}, {});

    //let newCreatedUser = await DataService.create("User", "phone_no", data, { "incrementallow": false });
    if (project.StatusCode == 200) {
        return project.Result[0];
    }
    else {
        throw new Error(project.Result);
    }
}

async function findProjectwithcondition(condition, fieldsarenotallowed, options = {}) {
    // let condition = UtilityService.parseCondition(request, false);
    let project = await DataService.findModel("Project", condition, {}, options);
    //let newCreatedUser = await DataService.create("User", "phone_no", data, { "incrementallow": false });
    if (project.StatusCode == 200 && project.Result.length > 0) {
        let resultsneedtoreturn = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(project.Result, fieldsarenotallowed, true);
        return project.Result;
    }
    else {
        throw new Error("No records Found");
    }
}


async function createNewQuoteWithConnectedUser(data, creator, project) {
    try {
        data.is_active = true;
        data.is_deleted = false;
        data.user_id = creator.user_id;
        data.status = true;
        data.project_id = project.project_id;
        data.creator_id = creator.creator_id;
        let quoteisexists = await DataService.findModel("Quote", { "project_id": project.project_id, "creator_id": creator.creator_id }, {}, {});
        if (quoteisexists.Result.length == 0) {
            let newQuote = await DataService.create("Quote", "quote_id", data, { "incrementallow": true });
            if (newQuote.StatusCode == 201) {
                return newQuote.Result;
            }
            else {
                throw new Error(newQuote.Result);
            }
        }
        else {
            throw new Error("You can not do multiple quotes in single project.");
        }

    }
    catch (e) {
        throw new Error(e);
    }
}

async function updateProjectcondition(condition,data, creator, project) {
    try {
        let projectExist = await DataService.findModel("Project",condition, {}, {});
        if (projectExist.Result.length == 1) {
            let updateProject = await DataService.patch("Project",condition,{ "status": data.status}, {});
            if (updateProject.StatusCode == 200) {
                return updateProject.Result;
            }
            else {
                throw new Error(updateProject.Result);
            }
        }
        else {
            if (projectExist.Result.length == 0) {
                throw new Error("There is no quote so no withdraw happen.");
            }
            else {
                throw new Error("there is a multiple quotes so we can't change any thing please contact bulb and key.");
            }
        }


    }
    catch (e) {
        throw new Error(e);
    }
}

async function updateQuoteWithConnectedUser(data, creator, project) {
    try {
        data.is_active = true;
        data.is_deleted = false;
        data.user_id = creator.user_id;
        data.status = true;
        data.project_id = project.project_id;
        data.creator_id = creator.creator_id;
        let quoteisexists = await DataService.findModel("Quote", { "project_id": project.project_id, "creator_id": creator.creator_id }, {}, {});
        if (quoteisexists.Result.length == 1) {
            let newQuote = await DataService.patch("Quote", { "quote_id": quoteisexists.Result[0].quote_id }, { "withdraw_reason": data.withdraw_reason, "withdraw_comments": data.withdraw_comments }, { "incrementallow": true });
            if (newQuote.StatusCode == 200) {
                return newQuote.Result;
            }
            else {
                throw new Error(newQuote.Result);
            }
        }
        else {
            if (quoteisexists.Result.length == 0) {
                throw new Error("There is no quote so no withdraw happen.");
            }
            else {
                throw new Error("there is a multiple quotes so we can't change any thing please contact bulb and key.");
            }
        }


    }
    catch (e) {
        throw new Error(e);
    }
}

async function findListOfProjectsForQuotations(condition, creator, quotedProjectsBool = false) {
    //{ "project_id": project.project_id, "creator_id": creator.creator_id }
    let localnotallowedData = `${notallowedData} created_date updated_date context`;
    let quotes = await findQuotes(condition);
    let projectsQuoted = [];
    quotes.filter((val, index) => {
        if (val.project_id > 0) {
            projectsQuoted.push(val.project_id);
        }
    });
    UtilityService.log("Creator Id:" + creator.creator_id + " has quoted on projects number" + JSON.stringify(projectsQuoted));
    let conditonfornotquoted = quotedProjectsBool ? { "project_id": { $in: projectsQuoted }, "is_active": true, "is_deleted": false } : { "project_id": { $nin: projectsQuoted }, "is_active": true, "is_deleted": false };
    let projectsnotquoted = await findProjectwithcondition(conditonfornotquoted, localnotallowedData);
    // let quotes = await DataService.findModel("Quote", condition, {}, {});
    return projectsnotquoted;
}

async function findQuotes(condition) {
    try {
        let localnotallowedData = `${notallowedData} created_date updated_date context`;
        let quotes = await DataService.findModel("Quote", condition, {}, {});
        let filteredcolumnquote = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(quotes.Result, localnotallowedData,true);
        return filteredcolumnquote;
    }
    catch (e) {
        utilityService.log(e);
    }
}




//#endregion

//#region creator basic apis


/**
 * List
 *
 * @summary Test Creator api is working or not
 * @desc Route:
  <ol>
    <li>/api/Creator/test/{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.test = async function (request, replay) {
    try {
        let cachetestppass = await UtilityService.redisCheck(request.headers.cachedata);
        let requesttestpass = true;
        fields = UtilityService.setupFieldsForRetriving(request, fields);
        let count = await DataService.count(modelname, primarykey, fields, {});
        let lastnumber = await DataService.lastentry(modelname, primarykey, fields, {});
        utilityService.log('\x1b[39m', "Exceution done of last addded data method");
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
    <li>/api/Creator</li>
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
        let data = await DataService.findModel(modelname,
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
    <li>/api/Creator/userdetails</li>
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
        let data = await DataService.findModel(modelname,
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
    <li>/api/Creator/create/{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.create = async function (request, replay) {
    try {
        //   let data=await DataService.findModel(modelname,{},'first_name last_name employee_id',{});
        let dataAdded = await DataService.create(modelname, "phone_no", request.payload, { "incrementallow": false });
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
    <li>/api/Creator/delete/{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.delete = async function (request, replay) {
    try {
        //   let data=await DataService.findModel(modelname,{},'first_name last_name employee_id',{});

        let dataDeleted = await DataService.delete(modelname, { 'creator_id': request.params.id }, {});
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
 * @summary patch Creator details
 * @desc Route:
  <ol>
    <li>/api/Creator/patch//{id}</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.patch = async function (request, replay) {
    try {
        //   let data=await DataService.findModel(modelname,{},'first_name last_name employee_id',{});
        let dataUpdated = await DataService.patch(modelname, { primarykey: request.params.id }, request.payload, {});
        let json = JSON.stringify(await dataUpdated);
        if (json != null)
            return UtilityService.replayData(replay, dataUpdated);
    }
    catch (e) {
        return "This is a error ||   " + e;
    }
}

//#endregion