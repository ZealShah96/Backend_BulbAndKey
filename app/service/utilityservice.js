const redis = require("./../service/redisservice");
var mongoConnection = require("./mongoservice");
const devsupport = require("./devsupportservice");
const utilityService = require("./utilityservice");
const consoleOfNumber = 2;
var crypto = require("crypto");
const datemanpulation = require("date-and-time");

//#region date manpulation
/**
 * function to add months in today's date 
 * @param {monthstoadd} request - months to add in today's date.
 * @returns {records} replay - return date with added month.
 */
exports.addMonthsInTodayDate = monthstoadd => {
  utilityService.log("Execution in add Months In Today Date Method.", 4);
  let todaydate = Date.now();
  let returndaterequest = Date.now();
  utilityService.log("Add" + monthstoadd + "in to today date.", 4);
  utilityService.log("Today's Date." + new Date(), 4);
  returndaterequest =
    typeof monthstoadd == "number"
      ? datemanpulation.addMonths(new Date(), monthstoadd)
      : todaydate;
  utilityService.log(
    "Changed Date" +
      returndaterequest +
      " type of date " +
      typeof returndaterequest,
    4
  );
  return new Date(returndaterequest);
};


/**
 * function to add min in today's date 
 * @param {mintoadd} request - months to add in today's date.
 * @returns {records} replay - return date with added mins.
 */
exports.addMinInTodayDate = mintoadd => {
  utilityService.log("Execution in add Min In Today Date Method.", 4);
  let todaydate = Date.now();
  let returndaterequest = Date.now();
  utilityService.log("Add" + mintoadd + "s in to today date.", 4);
  returndaterequest =
    typeof mintoadd == "number"
      ? datemanpulation.addMinutes(new Date(), mintoadd)
      : todaydate;
  utilityService.log(
    "Changed Date" +
      returndaterequest +
      " type of date " +
      typeof returndaterequest,
    4
  );
  return new Date(returndaterequest);
};



/**
 * function to add min in today's date 
 * @param {userpassedtime} request - date passed for change
 * @param {mintoadd} request - months to add in today's date.
 * @returns {records} replay - return date with added mins.
 */
exports.addMinInUserPassedDate = (userpassedtime, mintoadd) => {
  utilityService.log("Execution in add Min In Today Date Method.", 4);
  let todaydate = Date.now();
  let returndaterequest = userpassedtime;
  utilityService.log("Add" + mintoadd + "s in to today date.", 4);
  returndaterequest =
    typeof mintoadd == "number"
      ? datemanpulation.addMinutes(returndaterequest, mintoadd)
      : todaydate;
  utilityService.log(
    "Changed Date" +
      returndaterequest +
      " type of date " +
      typeof returndaterequest,
    4
  );
  return new Date(returndaterequest);
};

//#endregion

//#region manpulate columns for preventing data to manipulate wrong


/**
 * function to remove fields which are ot allowed to edit
 * @param {object} request - object from database or object.
 * @param {allowedlist} request - allowed fields list (it is based on condition if not allowed is false then it will be allowed list and if false then it will be not allowed list).
 * @param {notallowedpassed} request - filter fields which are not allowed if it is true and allowed if it is false.
 * @returns {object} replay - return object after filtering allowed keys or not allowed keys.
 */
exports.removeFieldsWhichAreNotAllwoedToEdit = (object,allowedlist,notallowedpassed) => {
  let index = 0;
//if object is normal object then assign _doc so process can perform perfectly because all process ahead is based on mongo type so it has _doc in it.
  if (object._doc == null && object._doc == undefined && object.length != 1) {
    object["_doc"] = object;
  }
  //?object:object.
  utilityService.log("remove Fields Which Are Not Allwoed To Edit", 4);
  //if object length is 1 
  if (typeof object == "object" && object.length == 1) {
    //if not allowed passed true then it will delete that key from object.
    if (notallowedpassed) {
      utilityService.log(typeof object);
      Object.keys(object[0]._doc).forEach(function(prop) {
        index++;
        if (allowedlist.indexOf(prop) > -1) {
          delete object[0]._doc[prop];
        }
      });
      return object;
    } 
    //if not allowed passed false then it will allowed that key from object.
    else {
      Object.keys(object[0]._doc).forEach(function(prop) {
        index++;
        if (allowedlist.indexOf(prop) == -1) {
          delete object[0]._doc[prop];
        }
      });
      return object;
    }
  } 
  //if object length is 2
  else if (typeof object == "object" && object.length > 1) {
 //if not allowed passed true then it will delete that key from object.
    if (notallowedpassed) {
      utilityService.log(typeof object);
      Object.keys(object).forEach(key => {
        let element = object[key]._doc;
        Object.keys(element).forEach(function(prop) {
          index++;
          utilityService.log(element[prop], 4);
          if (allowedlist.indexOf(prop) > -1) {
            delete element[prop];
          }
        });
      });
      return object;
    } 
    //if not allowed passed false then it will allowed that key from object.
    else {
       
      Object.keys(object).forEach(key => {
        let element = object[key]._doc;
        Object.keys(element).forEach(function(prop) {
          index++;
          utilityService.log(element[prop], 4);
          if (allowedlist.indexOf(prop) == -1) {
            delete element[prop];
          }
        });
      });
      return object;
    }
  }
  //if there is only obejct not list of object
  else if (typeof object == "object") {
  //if not allowed passed true then it will delete that key from object.
    if (notallowedpassed) {
      utilityService.log(typeof object);
      Object.keys(object._doc).forEach(function(prop) {
        index++;
        if (allowedlist.indexOf(prop) > -1) {
          delete object._doc[prop];
        }
      });
      return object;
    } 
    //if not allowed passed false then it will allowed that key from object.
    else {
      Object.keys(object._doc).forEach(function(prop) {
        index++;
        if (allowedlist.indexOf(prop) == -1) {
          delete object._doc[prop];
        }
      });
      return object;
    }
  }
  return object;
};

//#endregion

//#region already added configuration methods
/**
 * function to add months in today's date 
 * @param {val} request - value from json file.
 * @returns {value} replay - return configured value.
 */
exports.findConfigurationFromConfigFile = async val => {
  await utilityService.log("Configuartaion finding:", 4);
  try {
    //uncached already cached json file.
    utilityService.requireUncachedJson('./../../config/env.json');
    var config =require("./../../config/env.json")[
      process.env.NODE_ENV || "development"
    ];
  } catch (error) {
    utilityService.handleError("Error" + error);
  }
  await utilityService.log("Config object " + config[val], 4);
  await utilityService.log("Config value of " + val + "is", 4);
  return config[val];
};



/**
 * function to concate date and time passed.
 * @param {date} request - date passed for concat
 * @param {time} request - time passed for concat
 * @returns {value} replay - return concated date and time and convert from am and pm format to 24 hour format.
 */
exports.dateTimeConcate = async (date, time) => {
  //time:-11:00 AM
  let hour = time.split(" ")[0].split(":")[0];
  let min = time.split(" ")[0].split(":")[1];
  let timeInPM = time.split(" ")[1] == "PM";
  if (timeInPM) {
    //converting in to 24 hour format
    hour = hour + 12;
    if (hour > 24) {
      hour = hour - 24;
    }
  }
  date = new Date(new Date(date + " UTC").setHours(hour, min));
  return date;
};


/**
 * function to replay api 
 * @param {replay} request - replay object passed from handlers.
 * @param {data} request - data need to replay.
 * @param {message} request - message need to passed with replay data.
 * @returns {value} replay - replay with response code and data with proper format and also include error if there is any error.
 */
exports.replayData = async function(replay, data, message = null) {
  //console.log("logging of replay data");
  await utilityService.log("logging of replay data", consoleOfNumber);
  let output = {};
  //data.Result["data"]=data.Result;
  if (
    data.StatusCode == 200 ||
    data.StatusCode == 201 ||
    data.Result.statusCode == 201
  ) {
    output["status"] = "success";
  } else {
    output["status"] = "failed";
  }
  output["message"] = message;
  output["error"] =data["Error"] != null && data["Error"] != undefined ? data["Error"] : null;
  output["error"] =data.Result["Error"] != null && data.Result["Error"] != undefined? data.Result["Error"]: null;
  output["data"] = {};
  if (data.Result.length > 0) {
    Object.keys(data.Result).forEach(prop => {
      if (["Result", "_doc"].indexOf(prop) == -1 && prop.length > 2)
        output["data"][prop] = data.Result[prop];
    });
    output["data"]["count"] = data.Result.length;
  }

  // output["data"]["nextPage"]=data.Result.nextPage;
  output["data"]["result"] = data.Result;
  utilityService.log(data.StatusCode);
  await utilityService.log(
    "logging of replay data" + JSON.stringify(output),
    consoleOfNumber
  );
  return replay
    .response(JSON.stringify(output))
    .type("text/json")
    .code(200);
};




/**
 * function to log in console.
 * @param {message} request - message to print.
 * @param {consolelognumber} request - color of console printing.
 * @returns nothing.
 */
exports.log = async function(message, consolelognumber) {
  // console.log('\x1b[1m', "This is log function in utility", '\x1b[0m');

  // let color = await devsupport.findColorBasedOnInput(consolelognumber);
  switch (consolelognumber) {
    case 1:
      console.log("\x1b[36m", message, "\x1b[0m");
      break;
    case 2:
      console.log("\x1b[34m", message, "\x1b[0m");
      break;
    case 3:
      console.log("\x1b[31m", message, "\x1b[0m");
      break;
    case 4:
      console.log("\x1b[35m", message, "\x1b[0m");
      break;
    default:
      console.log(message);
      break;
  }
};


/**
 * function to handle error
 * @param {NoteForError} request - Note for this specific error.
 * @param {err} request - original error object.
 * @param {statusCode} request - status code for replay.
 * @param {context} request - context is for future use.(internal loginig.)
 * @returns {result} replay - replay object after error generated.
 */
exports.handleError = function(NoteForError, err, statusCode, context = null) {
  //  console.log('\x1b[31m', "Execution in handle error " + context, '\x1b[0m');
  utilityService.log("Execution in handle error " + context, 3);
  if (context != undefined && context != {}) {
    if (context != null) {
      let contextForUtility = JSON.parse(context);
      if (contextForUtility.IsInternalLog) {
        console.log("Execution done of handle error" + err);
        return {
          StatusCode: statusCode,
          Result: { Error: NoteForError + (err != null ? err : "") }
        };
      }
      console.log("Execution done of handle error" + err);
      return {
        StatusCode: statusCode,
        Result: { Error: NoteForError + (err != null ? err : "") }
      };
    } else {
      console.log("Execution done of handle error" + err);
      return {
        StatusCode: statusCode,
        Result: { Error: NoteForError + (err != null ? err : "") }
      };
    }
  } else {
    console.log("Execution done of handle error" + err);
    return {
      StatusCode: statusCode,
      Result: { Error: NoteForError + (err != null ? err : "") }
    };
  }
};

/**
 * function to check redis check
 * @param {objects} request - objects passed to check redis is working
 * @returns {result} replay - redis is working or not.
 */

exports.redisCheck = async function(objects) {
  try {
    let objectsToSave = { name: "test", id: "123" };
    if (objects != undefined && objects != {} && objects != null) {
      objectsToSave = JSON.parse(objects);
    }
    let hashkey = await redis.createCacheFunction(objectsToSave);
    let data = await redis.getCacheFunction(hashkey, {});
    let cachetestppass = false;
    if (JSON.stringify(data) == JSON.stringify(objectsToSave)) {
      cachetestppass = true;
    }
    return cachetestppass;
  } catch (error) {
    return false;
  }
};


/**
 * function to handle success
 * @param {successData} request - success data after api is working fine
 * @param {statusCode} request - status code for replay.
 * @param {context} request - context is for future use.(internal loginig.)
 * @returns {result} replay - replay object after error generated.
 */
exports.handleSuccess = async function(successData, statusCode, context) {
  let contextForUtility = JSON.parse(context);
  if (contextForUtility.IsInternalLog) {
  } else {
    try {
      // await mongoConnection.mongoUtility.mongoDisconnect();
      return { StatusCode: statusCode, Result: successData };
    } catch (err) {
      return {
        StatusCode: statusCode,
        Result: { SuccessData: successData, Error: err }
      };
    }
  }
};




/**
 * function to increase primary key value 
 * @param {passedData} request - passed data for increment primary key in it.
 * @param {lastAddedData} request - last added data in that same table.
 * @param {primaryKeyValue} request - primary key of that table.
 * @param {incrementallowed} request - increment of primary key is allowed or not.
 * @returns {result} replay - passed data's primary key incremented.
 */
exports.incresePrimaryKeyValueInDataToAdd = async function(
  passedData,
  lastAddedData,
  primaryKeyValue,
  incrementallowed
) {
  console.log(
    "\x1b[5m",
    "Execustion Start Of Increase primary key value to increase value of " +
      primaryKeyValue +
      "from passed data in body."
  );
  if (incrementallowed) {
    if (lastAddedData == null) {
      console.log(
        "\x1b[5m",
        "passed data " +
          passedData[primaryKeyValue] +
          " " +
          "there is no data in database."
      );
      passedData[primaryKeyValue] = 1;
    } else {
      console.log(
        "\x1b[5m",
        "passed data " +
          passedData[primaryKeyValue] +
          " " +
          "last added data " +
          ++lastAddedData[primaryKeyValue] +
          " Primary key Value " +
          primaryKeyValue
      );
      passedData[primaryKeyValue] = lastAddedData[primaryKeyValue];
    }
  }
  return passedData;
};


/**
 * function to setup fields for retriving in headers
 * @param {request} request -request object for setup fields.
 * @param {fields} request - deafualts fields for retriving.
 * @returns {retrivedfields} replay - string of fields to retrive from database.
 */
exports.setupFieldsForRetriving = function(request, fields) {

  utilityService.log("Execution Start Of Setup Fields For Retriving", 4);
//it will try to find fields from headred and if there is not fields in it then assign default fields.
  if (request.headers.fields != null && request.headers.fields != undefined) {
    utilityService.log("There is some fields in request." + request.fields, 4);
    if (typeof request.headers.fields == "string") {
      return request.headers.fields.toString();
    }
    utilityService.log(
      "please pass space seprated fields name in request like this." + fields,
      4
    );
    return fields;
  } else {
    utilityService.log(
      "There is no fields in request so we passed default fields:-" + fields,
      4
    );
    return {};
  }
};

/**
 * function to retrive populate data request
 * @param {request} request -request object for setup fields.
 * @returns {retrivepopulatestring} replay - it is connected to populate functinality of mangoose.
 */
exports.retrivepopulatedata = function(request) {

  utilityService.log("Execution Start Of retrive data attching other tables", 4);

  if (request.headers.populate != null &&request.headers.populate != undefined) {
    utilityService.log("There is some retrive data request of connecting table in request." +request.populate, 4);
    if (typeof request.headers.fields == "string") {
      return request.headers.populate.toString();
    }
    utilityService.log(
      "please pass data of retrive in request like this." + request.populate,
      4
    );
    return "";
  } else {
    utilityService.log("There is no fields in request", 4);
    return "";
  }
};



/**
 * function to update Date When Change Happen
 * @param {val} request -.model object which has update_date
 * @returns {valuewithupdateddate} replay - object return with update date.
 */
exports.updateDateWhenChangeHappen = val => {
  val.updated_date = Date.now();
  utilityService.log("date update:" + val.updated_date, 4);
  return val;
};


/**
 * function to hash password
 * @param {val} request -.model object which has password 
 * @returns {valuewithupdateddate} replay - object return with hased password.
 */
exports.hashPassword = async val => {
  var name = val.password;
  var hashPassWord_algorithum = await utilityService.findConfigurationFromConfigFile(
    "hashPassWord_algorithum"
  );

  var hash = require("crypto")
    .createHash(hashPassWord_algorithum)
    .update(name)
    .digest("hex");
  utilityService.log("after hashing password:" + hash);
  val.password = hash;
  return val;
  // val.password=
};

/**
 * function to hashed string
 * @param {val} request -.string which has password 
 * @returns {valuewithupdateddate} replay - hased string.
 */
exports.hashPasswordstring = async val => {
  var name = val;
  var hashPassWord_algorithum = await utilityService.findConfigurationFromConfigFile(
    "hashPassWord_algorithum"
  );
  var hash = require("crypto")
    .createHash(hashPassWord_algorithum)
    .update(name)
    .digest("hex");
  utilityService.log("after hashing password:" + hash);
  val = hash;
  return val;
  // val.password=
};

/**
 * function to check Password
 * @param {userdetails} request -.user details 
 * @param {userenteredpassword} request -.password enterded by user which neededt to check 
 * @param {originalpasswordhashed} request -.password in database
 * @param {checknormal} request -.check password with out hashing
 * @returns {passwordmatched} replay - password matched or not matched.
 */
exports.checkPassword = async (
  userdetails,
  userenteredpassword,
  originalpasswordhashed,
  checknormal=false
) => {
  // originalpasswordhashed = "caa28e25181c49d23110696255d2a2d5";
  var hashPassWord_algorithum = await utilityService.findConfigurationFromConfigFile(
    "hashPassWord_algorithum"
  );
  if(checknormal){
    var hasheduserenteredpassword = userenteredpassword.toString();
  }
  else{
  var hasheduserenteredpassword = require("crypto")
    .createHash(hashPassWord_algorithum)
    .update(userenteredpassword)
    .digest("hex")
    .toString();
  }
  if (originalpasswordhashed === hasheduserenteredpassword) {
    utilityService.log("password matched." + true);
    return true;
  } else {
    utilityService.log(
      "password did not matched. this user tried to log in " +
        userdetails.user_id
    );
    return false;
  }
};

exports.checkPasswordIsSame = async (newPassword, confirmPassword) => {
  // originalpasswordhashed = "caa28e25181c49d23110696255d2a2d5";
  return newPassword == confirmPassword;
};
//#endregion

//#region condition and headers parsed for further process
/**
 * function to check Password
 * @param {request} request -.request element from handlers
 * @param {checkRequestPerametersAlso} request -.check request perameters in headers
 * @returns {parsedCondition} replay -condition parsed from request
 */
exports.parseCondition = (request, checkRequestPerametersAlso) => {
  let parsedCondition = {};
  //parsinf condition from request
  try {
    parsedCondition =
      request.headers.condition != undefined
        ? JSON.parse(request.headers.condition)
        : {};

  }
  //default parsed condition.
  catch (error) {
    parsedCondition = { is_active: true };
  }
  let id = "id";
  parsedCondition =
    request.params != undefined
      ? (parsedCondition = request.params)
      : parsedCondition;
  //utilityService.parseConditionfromPerameters(request, parsedCondition,["id"],false);
  return parsedCondition;
};



///parsed condition from perameters.
exports.parseConditionfromPerameters = (
  request,
  alreadygeneratedcondition,
  appendperameterscondition = false,
  objectsnameswhereparmaswillattach
) => {
  let parsedConditionfromparams = {};
  let parsedCondition = {};
  try {
    objectsnameswhereparmaswillattach.forEach(val => {
      parsedConditionfromparams[val] = request.params[val];
    });

    parsedCondition =
      parsedConditionfromparams != {}
        ? parsedConditionfromparams
        : alreadygeneratedcondition;
  } catch (error) {
    parsedCondition = alreadygeneratedcondition;
  }

  return parsedCondition;
};


//#region check value is undefined or null or null string.


exports.checkNotNullAndNotUndefined = val => {
  let boolForNotNull = utilityService.checkNotNull(val);
  let boolForNotNullolForNotUndefined = utilityService.checkNotUndefined(val);
  if (boolForNotNull && boolForNotNullolForNotUndefined) {
    return true;
  }
  return false;
};

exports.checkNotNull = val => {
  if (["null"].indexOf(typeof val) == -1) {
    return true;
  }
  return false;
};

exports.checkNotUndefined = val => {
  if (["undefined"].indexOf(typeof val) == -1) {
    return true;
  }
  return false;
};


exports.checkNotEmptyStringAndNotEmptyObject = val => {
    let boolForNotEmptyString = utilityService.checkNotEmptyString(val);
    let boolForNotEmptyObject = utilityService.checkNotEmptyObject(val);
    if (boolForNotEmptyString && boolForNotEmptyObject) {
      return true;
    }
    return false;
  };

exports.checkNotEmptyString = val => {
    if(val!=""){
        return true;
    }
  return false;
};

exports.checkNotEmptyObject = val => {
    if(val!={}){
        return true;
    }
  return false;
};


exports.checkNotNullAndNotUndefinedAndNotEmptyStringAndNotEmptyObject = val => {
    let boolForNotNull = utilityService.checkNotNullAndNotUndefined(val);
    let boolForNotNullolForNotUndefined = utilityService.checkNotEmptyStringAndNotEmptyObject(val);
    if (boolForNotNull && boolForNotNullolForNotUndefined) {
      return true;
    }
    return false;
  };

  //#endregion
//#endregion


//used to unchcahed cached json.
exports.requireUncachedJson=(path)=>{
  try{
  let value=require.resolve(path);
  delete require.cache[value];
  return true;
}
catch(error){
return true;
}
 
}