var DataService = require("./../../service/DataService");
var UtilityService = require("./../../service/utilityservice");
var handlers = require("./handlers");
var addresshandlers = require("./../address/handlers");
const redis = require("./../../service/redisservice");
var fields = "user_id firstname";
const modelname = "User";
const primarykey = "user_id";
const selectedData =
  "user_id firstname lastname phone_no country_code email avatar is_creator is_active created_date updated_date";
const allowedData =
  " firstname lastname phone_no country_code email avatar is_creator is_active created_date updated_date";
const notallowedData =
  " is_creator is_active created_date updated_date _id address_id id _v is_deleted";


//#region log in flow process



/**
 * @param  {} request
 * @param  {} replay
 */
exports.loginAdmin = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of log in of admin", 1);
   UtilityService.requireUncachedJson('./../../../config/users.json');
    let user = require('./../../../config/users.json')[request.payload.userName];
    if (UtilityService.checkNotNullAndNotUndefined(user)) {
      let ok = await UtilityService.checkPassword(
        user,
        request.payload.password,
        user.password,true
      );
      if (ok) {
        let data = {
          StatusCode: 200,
          Result: { user_id: user.user_id,role:user.role}
        };
        UtilityService.log(
          "Execution end of log in and log in success" + data,
          1
        );
        return UtilityService.replayData(replay, data);
      } else {
        throw new Error("Password didn't match");
      }
    } else {
      throw new Error(
        "There is more then 1 user with same number or no user registered go to sign up page ."
      );
    }
  } catch (e) {
    let data = {
      StatusCode: 601,
      Result: { Error: "This is a error || " + e }
    };
    return UtilityService.replayData(replay, data);
    // "This is a error ||  test  " + e;
  }
};


//#endregion log in flow process


//#region admin services
exports.getdata = async function(request, replay) {
  try {
    var Objects = {};
    let modelname = request.payload.modelname;
    let primarykey = request.payload.primarykey;
    let pageValue = request.payload.pageValue;
    let populateFields = request.payload.populateFields;
    let condition =
      ["null", "undefined"].indexOf(typeof request.payload.condition) == -1 &&
      ["", {}].indexOf(request.payload.condition) == -1
        ? JSON.parse(request.payload.condition)
        : {};
    let sort =
      ["null", "undefined"].indexOf(typeof request.payload.sort) == -1 &&
      ["", {}].indexOf(request.payload.sort) == -1
        ? JSON.parse(request.payload.sort)
        : null;
    let count = await DataService.count(modelname, primarykey, primarykey, {});

    Objects["limit"] = await UtilityService.findConfigurationFromConfigFile(  "limit" );
    Objects["skip"] =
      [null, undefined].indexOf(typeof pageValue) == -1 &&
      parseInt(pageValue) != 0
        ? parseInt(pageValue - 1) * Objects["limit"]
        : 0;
    let nextPage = count.Result.length - Objects["limit"] >= Objects["skip"];
    Objects["sort"] = sort;
console.log(populateFields)
    Objects['populate'] = 
    [null,undefined].indexOf(typeof populateFields)== -1 && 
    ["",{}].indexOf(typeof populateFields) == -1 ? populateFields :null;
    //[null,undefined].indexOf(typeof(pageValue))==-1?(pageValue)*(6):1;
    console.log(Objects['populate'])
    let data = await DataService.findModel(
      modelname,
      condition,
      request.payload.required_fields.toString().replace(/,/g, " "),
      Objects
    );
    data.Result["nextPage"] = nextPage;
    data.Result["primaryKey"]=primarykey;
    if (data != null) return UtilityService.replayData(replay, data);
  } catch (e) {
    let data = {
      StatusCode: 601,
      Result: { Error: "This is a error || " + e }
    };
    return UtilityService.replayData(replay, data);
  }
};

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
exports.patchRecord = async function(request, replay) {
  try {
    var Objects = {};
    if (
      !UtilityService.checkNotNullAndNotUndefined(request.payload.modelname)
    ) {
      throw new Error("please provide model name properly.");
    }
    let modelname = request.payload.modelname;
    // let primarykey=request.payload.primarykey;
    // let pageValue=request.payload.pageValue;
    let condition = {};
    if (
      !UtilityService.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject(
        request.payload.condition
      )
    ) {
      throw new Error("please provide proper deatil in condition.");
    } else {
      condition = JSON.parse(request.payload.condition);
    }
    //["null", "undefined"].indexOf(typeof request.payload.condition) == -1 && ["",{}].indexOf(request.payload.condition) == -1?JSON.parse(request.payload.condition):{};
    //   let sort=["null", "undefined"].indexOf(typeof request.payload.sort) == -1 && ["",{}].indexOf(request.payload.sort) == -1 ?JSON.parse(request.payload.sort):null;
    // let count = await DataService.count(modelname, primarykey, primarykey, {});
    // Objects["limit"] = await UtilityService.findConfigurationFromConfigFile("limit");
    // Objects["skip"] =[null, undefined].indexOf(typeof pageValue) == -1 && parseInt(pageValue) != 0
    // ? parseInt(pageValue - 1) * Objects["limit"]: 0;
    // let nextPage = count.Result.length - Objects["limit"] >= Objects["skip"];
    // Objects["sort"]=sort;
    //   let data=await DataService.findModel(modelname,{},'first_name last_name employee_id',{});
    let dataToChange=[];
     dataToChange["_doc"]= JSON.parse(request.payload.data);
    dataToChange._doc = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
      dataToChange,
      modelname + "_id created_date updated_date",
      true
    );
    let dataUpdated = await DataService.patch(
      modelname,
      condition,
      dataToChange,
      {}
    );
    let json = JSON.stringify(await dataUpdated);
    if (json != null) return UtilityService.replayData(replay, dataUpdated);
    else return UtilityService.replayData(replay, "Nothing is updated.");
  } catch (e) {
    let data = {
      StatusCode: 601,
      Result: { Error: "This is a error || " + e }
    };
    return UtilityService.replayData(replay, data);
  }
};

//#endregion 



