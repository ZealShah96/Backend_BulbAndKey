var DataService = require("../../service/dataservice");
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
("use strict");

//#region main handler functions for reqests
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
exports.test = async function(request, replay) {
  try {
    let cachetestppass = await UtilityService.redisCheck(request.headers.cachedata);
    fields = UtilityService.setupFieldsForRetriving(request, fields);
    let requesttestpass = true;
    let count = await DataService.count(modelname, primarykey, {});
    let lastnumber = await DataService.lastentry(
      modelname,
      primarykey,
      fields,
      {}
    );
    // let lastnumber = await DataService.lastentry(modelname, primarykey,"user_id name",{});
    let passwordhashworking = await UtilityService.checkPassword(
      lastnumber,
      "bulbandkey1996@",
      "bulbandkey1996@"
    );
    let passwordhashworkingfailed = await UtilityService.checkPassword(
      lastnumber,
      "bulbandkey",
      "bulbandkey1996@"
    );
    let data = {
      StatusCode: 200,
      Result: {
        cachetestppass: cachetestppass,
        requesttestpass: requesttestpass,
        count: count.Result != null ? count.Result.length : 0,
        lastow: lastnumber.Result != null ? lastnumber.Result : "NA",
        passwordhashworking: passwordhashworking,
        passwordhashworkingfailed: passwordhashworkingfailed
      }
    };
    return UtilityService.replayData(replay, data);
  } catch (e) {
    let data = {
      StatusCode: 200,
      Result: { Error: "This is a error || " + e }
    };
    return UtilityService.replayData(replay, data);
    // "This is a error ||  test  " + e;
  }
};

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
exports.list = async function(request, replay) {
  try {
    utilityService.log("Process Start.");
    let condition = "";
    try {
      condition =
        request.headers.condition != undefined
          ? JSON.parse(request.headers.condition)
          : null;
    } catch (error) {
      condition = { is_active: true };
    }
    fields = UtilityService.setupFieldsForRetriving(request, fields);
    let data = await DataService.findModel(modelname, condition, fields, {});
    utilityService.log("Process End.");
    //let json=JSON.stringify(data);
    if (data != null) {
      return UtilityService.replayData(replay, data);
    }
    // throw new Error(response);
  } catch (e) {
    return "This is a error || " + e;
  }
};

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
exports.create = async function(request, replay) {
  try {
    //   let data=await DataService.findModel(modelname,{},'first_name last_name employee_id',{});
    if (request.path == "/web/user/signup") {
      let fields = "status user_id avatar is_creator password";
    } else {
      let fields = {};
    }
    // fields = UtilityService.setupFieldsForRetriving(request, fields);
    let lastnumber = await DataService.lastentry(
      modelname,
      primarykey,
      fields,
      {}
    );
    if (lastnumber.Result != null) {
      request.payload.user_id = lastnumber.Result.user_id + 1;
    } else {
      request.payload.user_id = 1;
    }
    let dataAdded = await DataService.create(
      modelname,
      "phone_no",
      request.payload,
      { incrementallow: false }
    );

    let json = JSON.stringify(await dataAdded);
    if (dataAdded != null) return UtilityService.replayData(replay, dataAdded);
  } catch (e) {
    return "This is a error ||   " + e;
  }
};

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
exports.delete = async function(request, replay) {
  try {
    //   let data=await DataService.findModel(modelname,{},'first_name last_name employee_id',{});
    let dataDeleted = await DataService.delete(
      modelname,
      { user_id: request.params.id },
      {}
    );
    let json = JSON.stringify(await dataDeleted);
    if (json != null) return UtilityService.replayData(replay, dataDeleted);
  } catch (e) {
    return "This is a error ||   " + e;
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
exports.patch = async function(request, replay) {
  try {
    //   let data=await DataService.findModel(modelname,{},'first_name last_name employee_id',{});
    let dataUpdated = await DataService.patch(
      modelname,
      { [primarykey]: request.params.id },
      request.payload,
      {}
    );
    let json = JSON.stringify(await dataUpdated);
    if (json != null) return UtilityService.replayData(replay, dataUpdated);
    else return UtilityService.replayData(replay, "Nothing is updated.");
  } catch (e) {
    return "This is a error ||   " + e;
  }
};
//#endregion

//#region support tables entry and update
/**
 * @param  {} request
 * @param  {} replay
 */
exports.profile = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of check phone no.", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      [primarykey]: request.payload.user_id
    };
    let fields = allowedData;
    let user = await DataService.findModel(modelname, condition, fields, {});

    let ok = user.Result.length > 0;
    if (ok) {
      //1.for already existed user 0.new user
      let data = { StatusCode: 200, Result: { data: user[0] } };
      UtilityService.log(
        "Execution end of log in and log in success" + data,
        1
      );
      return UtilityService.replayData(replay, data);
    } else {
      throw new Error(
        "There is no user avaiable on this user_id or may be more then 2 user avaiable or user is may be deleted or may be not active."
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

/**
 * @param  {} request
 * @param  {} replay
 */
exports.saveprofile = async function(request, replay) {
  try {
    let condition = {
      is_active: true,
      is_deleted: false,
      [primarykey]: request.payload.user_id
    };
    let fields = selectedData;
    let user = await DataService.findModel(modelname, condition, fields, {});

    let ok = user.Result.length > 0;
    if (ok) {
      //1.for already existed user 0.new user
      request.payload = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
        request.payload,
        allowedData.split(" "),
        false
      );
      request.params.id = user.Result[0].user_id;
      reponseofpatch = await handlers.patch(request, replay);
      let data = {
        StatusCode: 200,
        Result: {
          data: UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
            JSON.parse(reponseofpatch.source),
            allowedData.split(" "),
            false
          )
        }
      };
      return UtilityService.replayData(replay, data);
    } else {
      throw new Error(
        "There is no user avaiable on this user_id or may be more then 2 user avaiable or user is may be deleted or may be not active."
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
//#endregion

//#region address add and edit  for user
/**
 * @param  {} request
 * @param  {} replay
 */
exports.getAddress = async function(request, replay) {
  try {
    let condition = {
      is_active: true,
      is_deleted: false,
      [primarykey]: request.payload.user_id
    };
    let fields = "user_id users_address firstname lastname phone_no";
    let options = {};

    options["limit"] = 3;
    options["skip"] =
      [null, undefined].indexOf(typeof request.payload.pageValue) == -1 &&
      parseInt(request.payload.pageValue) != 0
        ? parseInt(request.payload.pageValue - 1) * options["limit"]
        : 0;
    let listOfAddress = await DataService.findModel(
      "Address",
      { user_id: request.payload.user_id },
      "address_id user_id",
      options
    );

    let nextPage =
      listOfAddress.Result.length - options["limit"] >= options["skip"];
    let limitindex = 0;
    let listOfIdsNeededToFilter = [];
    listOfAddress.Result.map((val, index) => {
      listOfIdsNeededToFilter.push(val["address_id"]);
    });
    // condition["users_address.address_id"]={$in:listOfIdsNeededToFilter};
    let optionsForpopulate = {};
    optionsForpopulate.populate = "users_address";
    let user = await DataService.findModel(
      modelname,
      condition,
      fields,
      optionsForpopulate
    );
    let useraddress = [];
    user.Result[0]["users_address"].map((val, index) => {
      if (listOfIdsNeededToFilter.indexOf(val.address_id) > -1) {
        useraddress.push(
          user.Result[0]["users_address"].slice(index, index + 1)[0]
        );
      }
    });
    user.Result[0]["users_address"] = useraddress;
    user.Result[0][
      "users_address"
    ] = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
      user.Result[0]["users_address"],
      notallowedData.split(" ").pop("address_id"),
      true
    );

    let ok = user.Result.length > 0;
    if (ok) {
      //1.for already existed user 0.new user
      user.Result["nextPage"] = nextPage;
      let data = { StatusCode: 200, Result: user.Result };

      return UtilityService.replayData(replay, data);
    } else {
      throw new Error(
        "There is no user avaiable on this user_id or may be more then 2 user avaiable or user is may be deleted or may be not active."
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
/**
 * @param  {} request
 * @param  {} replay
 */
exports.editAddress = async function(request, replay) {
  try {
    let condition = {
      is_active: true,
      is_deleted: false,
      address_id: request.payload.address_id
    };
    let fields = "address_id";

    let address = await DataService.findModel("Address", condition, fields, {});

    let ok = address.Result.length > 0;
    if (ok) {
      request.payload = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
        request.payload,
        notallowedData.split(" "),
        true
      );
      request.headers.condition = JSON.stringify(condition);
      reponseofpatch = await addresshandlers.list(request, replay);
      let data = {
        StatusCode: 200,
        Result: {
          data: UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
            JSON.parse(reponseofpatch.source),
            notallowedData.split(" "),
            true
          )[0]
        }
      };
      return UtilityService.replayData(replay, data);
    } else {
      throw new Error(
        "There is no user avaiable on this address_idf or may be more then 2 address avaiable or user is may be deleted or may be not active."
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
/**
 * @param  {} request
 * @param  {} replay
 */
exports.saveAddress = async function(request, replay) {
  try {
    let condition = {
      is_active: true,
      is_deleted: false,
      address_id: request.payload.address_id
    };
    let fields = "address_id";

    let address = await DataService.findModel("Address", condition, fields, {});

    let ok = address.Result.length > 0;
    if (ok) {
      request.payload = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
        request.payload,
        notallowedData.split(" "),
        true
      );
      // request.headers.condition=JSON.stringify(condition);
      request.params.id = address.Result[0].address_id;
      reponseofpatch = await addresshandlers.patch(request, replay);
      let data = {
        StatusCode: 200,
        Result: {
          data: UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
            JSON.parse(reponseofpatch.source),
            notallowedData.split(" "),
            true
          )
        }
      };
      return UtilityService.replayData(replay, data);
    } else {
      throw new Error(
        "There is no user avaiable on this address_idf or may be more then 2 address avaiable or user is may be deleted or may be not active."
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
/**
 * @param  {} request
 * @param  {} replay
 */
exports.removeAddress = async function(request, replay) {
  try {
    let condition = {
      is_active: true,
      is_deleted: false,
      address_id: request.payload.address_id
    };
    let fields = "address_id";

    let address = await DataService.findModel("Address", condition, fields, {});

    let ok = address.Result.length > 0;
    if (ok) {
      request.payload = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
        request.payload,
        notallowedData.split(" "),
        true
      );
      // request.headers.condition=JSON.stringify(condition);
      request.params.id = address.Result[0].address_id;
      reponseofpatch = await addresshandlers.delete(request, replay);
      let data = {
        StatusCode: 200,
        Result: {
          data: UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
            JSON.parse(reponseofpatch.source),
            notallowedData.split(" "),
            true
          )
        }
      };
      return UtilityService.replayData(replay, data);
    } else {
      throw new Error(
        "There is no user avaiable on this address_idf or may be more then 2 address avaiable or user is may be deleted or may be not active."
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
//#endregion

//#region log in flow process

/**
 * @param  {Phone_No} request
 * @param  {1/0} replay
 */
exports.check = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of check phone no.", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      phone_no: request.payload.phone_no
    };
    let fields = "user_id phone_no";
    let user = await DataService.findModel(
      modelname,
      condition,
      fields + " firstname lastname",
      {}
    );

    let ok = user.Result.length > 0;
    if (ok) {
      //1.for already existed user 0.new user
      let data = {
        StatusCode: 200,
        Result: {
          exist: 1,
          firstname: user.Result[0].firstname,
          user_id: user.Result[0].user_id
        }
      };
      UtilityService.log(
        "Execution end of log in and log in success" + data,
        1
      );
      return UtilityService.replayData(replay, data);
    } else {
      let data = { StatusCode: 200, Result: { exist: 0 } };

      //let bool = DataService.create(modelname, "phone_no",)
      UtilityService.log("Execution end of log in and log in failed" + data, 1);
      return UtilityService.replayData(replay, data);
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

/**
 * @param  {} request
 * @param  {} replay
 */
exports.login = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of log in", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      phone_no: request.payload.user
    };
    let fields = "status user_id avatar is_creator password";
    let user = await DataService.findModel(modelname, condition, fields, {});
    if (user.Result.length == 1) {
      let ok = await UtilityService.checkPassword(
        user.Result[0],
        request.payload.password,
        user.Result[0].password
      );
      user.Result[0].password = "we hide it";
      if (ok) {
        let data = {
          StatusCode: 200,
          Result: { user_id: user.Result[0].user_id }
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

/**
 * @param  {} request
 * @param  {} replay
 */
exports.loginotp = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of log in otp", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      phone_no: request.payload.phone_no
    };
    if (request.payload.phone_no.toString().length != 10) {
      UtilityService.log(request.payload.phone_no.toString().length);
      throw new Error("phone no length should be 10.");
    }
    let fields = "user_id otp otp_expiry";
    let user = await DataService.findModel(modelname, condition, fields, {});
    let otp_expiry = UtilityService.addMinInTodayDate(
      UtilityService.findConfigurationFromConfigFile("OTP_Timeout")
    );
    let ok = { OTP: 4110 };
    UtilityService.log(user.Result.length);
    if (user.Result.length == 1) {
      let userupdate = await DataService.patch(
        modelname,
        { phone_no: request.payload.phone_no },
        { otp: 4110, otp_expiry: otp_expiry },
        {}
      );
      let data = { StatusCode: 200, Result: { otp: "sent" } };
      UtilityService.log(
        "Execution end of log in and log in success" + data,
        1
      );
      return UtilityService.replayData(replay, data);
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

/**
 *
 * @summary log in with otp passed with it.
 * @param {*} request has phone_no and otp of user has got in phone.
 * @param {*} replay has return values.
 * @returns
 *
 */
exports.loginwithotp = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of log in otp", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      phone_no: request.payload.phone_no
    };
    let fields = "user_id otp otp_expiry";
    let user = await DataService.findModel(
      modelname,
      condition,
      fields + " firstname",
      {}
    );

    if (user.Result.length == 1) {
      let ok =
        request.payload.otp == user.Result[0].otp &&
        UtilityService.addMinInUserPassedDate(user.Result[0].otp_expiry, 1) >
          Date.now();
      if (ok) {
        let data = {
          StatusCode: 200,
          Result: {
            otpaccept: ok,
            user_id: user.Result[0].user_id,
            firstname: user.Result[0].firstname
          }
        };
        let token = await redis.setcache(request, replay);
        if (JSON.parse(token.source).status == "success") {
          request.payload.key = JSON.parse(token.source).Token_Added;
          let tokenvalues = await redis.getcache(request, replay);
          if (JSON.parse(token.source).status == "success") {
            data.Result["token_id"] = JSON.parse(token.source).Token_Added;
            UtilityService.log(
              "Execution end of log in and log in success" + data,
              1
            );
            return UtilityService.replayData(replay, data);
          } else {
            throw new Error(
              "token not generated so no log in request processed." +
                JSON.parse(token.source).error
            );
          }
        } else {
          throw new Error(
            "token not generated so no log in request processed." +
              JSON.parse(token.source).error
          );
        }
      } else {
        if (request.payload.otp != user.Result[0].otp) {
          throw new Error("OTP is not matching");
        } else if (
          !(
            UtilityService.addMinInUserPassedDate(
              user.Result[0].otp_expiry,
              1
            ) > Date.now()
          )
        ) {
          throw new Error(
            "OTP is not matching because it is expired regenerate it."
          );
        }

        throw new Error("there is some unkown issue .");
      }
    } else {
      let condition = { is_deleted: false, phone_no: request.payload.phone_no };
      let user = await DataService.findModel(modelname, condition, fields, {});
      if (user.Result.length == 1) {
        let ok =
          request.payload.otp == user.Result[0].otp &&
          UtilityService.addMinInUserPassedDate(user.Result[0].otp_expiry, 1) >
            Date.now();
        if (ok) {
          let data = {
            StatusCode: 200,
            Result: { otpaccept: ok, user_id: user.Result[0].user_id }
          };

          UtilityService.log(
            "Execution end of log in and log in success" + data,
            1
          );
          return UtilityService.replayData(replay, data);
        } else {
          if (request.payload.otp != user.Result[0].otp) {
            throw new Error("we have your account but OTP is not matching");
          } else if (
            !(
              UtilityService.addMinInUserPassedDate(
                user.Result[0].otp_expiry,
                1
              ) > Date.now()
            )
          ) {
            throw new Error(
              "we have your account but OTP is not matching because it is expired regenerate it."
            );
          }

          throw new Error("there is some unkown issue .");
        }
      }
      throw new Error("there is no user avaibale in database .");
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

/**
 * @param  {} request
 * @param  {} replay
 */
exports.signupotp = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of Sing up otp", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      phone_no: request.payload.phone_no
    };
    let tempdata = {
      user_id: 0,
      phone_no: request.payload.phone_no,
      is_active: false,
      is_deleted: false
    };

    if (request.payload.phone_no.toString().length != 10) {
      UtilityService.log(request.payload.phone_no.toString().length);
      throw new Error("phone no length should be 10.");
    }
    let fields = "user_id otp otp_expiry";
    let user = await DataService.findModel(modelname, condition, fields, {});
    let otp_expiry = UtilityService.addMinInTodayDate(
      UtilityService.findConfigurationFromConfigFile("OTP_Timeout")
    );
    let ok = { OTP: 4110 };
    if (request.path == "/web/user/signup") {
      let fields = "status user_id avatar is_creator password";
    } else {
      let fields = {};
    }
    // fields = UtilityService.setupFieldsForRetriving(request, fields);
    let lastnumber = await DataService.lastentry(
      modelname,
      primarykey,
      fields,
      {}
    );
    if (lastnumber.Result != null) {
      tempdata.user_id = lastnumber.Result.user_id + 1;
    } else {
      tempdata.user_id = 1;
    }
    let dataAdded = await DataService.create(modelname, "phone_no", tempdata, {
      incrementallow: false
    });

    // UtilityService.log(user.Result.length);
    if (
      user.Result.length == 0 &&
      dataAdded != null &&
      dataAdded.Result.is_active == false &&
      dataAdded.StatusCode != 400
    ) {
      let userupdate = await DataService.patch(
        modelname,
        { phone_no: request.payload.phone_no },
        { otp: 4110, otp_expiry: otp_expiry, is_active: false },
        {}
      );
      let data = { StatusCode: 200, Result: { otp: "sent" } };
      UtilityService.log(
        "Execution end of log in and log in success" + data,
        1
      );
      return UtilityService.replayData(replay, data);
    } else {
      throw new Error(
        "There is already  1 user registerd same number go to log in page."
      );
    }
  } catch (e) {
    let data = {
      StatusCode: 601,
      Result: { Error: "This is a error || " + e }
    };
    return UtilityService.replayData(replay, data);
  }
};

/**
 * @param  {} request
 * @param  {} replay
 */
exports.signupwithotp = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of Sing up otp", 1);
    let condition = {
      is_active: false,
      is_deleted: false,
      phone_no: request.payload.phone_no
    };
    let fields = "user_id otp otp_expiry is_active is_deleted";
    let user = await DataService.findModel(modelname, condition, fields, {});
    if (
      user.Result.length == 1 &&
      user.Result[0] != null &&
      user.Result[0].is_active == false
    ) {
      let ok =
        request.payload.otp == user.Result[0].otp &&
        UtilityService.addMinInUserPassedDate(user.Result[0].otp_expiry, 1) >
          Date.now();
      if (ok) {
        let userupdate = await DataService.patch(
          modelname,
          { phone_no: request.payload.phone_no },
          { otp: null, otp_expiry: Date.now(), is_active: true },
          {}
        );
        let data = {
          StatusCode: 200,
          Result: { otpaccept: ok, user_id: userupdate.Result.user_id }
        };
        UtilityService.log(
          "Execution end of log in and log in success" + data,
          1
        );
        return UtilityService.replayData(replay, data);
      } else {
        if (request.payload.otp != user.Result[0].otp) {
          throw new Error("OTP is not matching");
        } else if (
          !(
            UtilityService.addMinInUserPassedDate(
              user.Result[0].otp_expiry,
              1
            ) > Date.now()
          )
        ) {
          throw new Error(
            "OTP is not matching because it is expired regenerate it."
          );
        }

        throw new Error("there is some unkown issue .");
      }
    } else {
      throw new Error("there is no user created in datbase using this number.");
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

/**
 * @param  {} request
 * @param  {} replay
 */
exports.forgetpasswordotp = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of forget password otp", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      phone_no: request.payload.phone_no
    };
    let fields = "user_id otp otp_expiry";
    let user = await DataService.findModel(modelname, condition, fields, {});
    let otp_expiry = UtilityService.addMinInTodayDate(
      UtilityService.findConfigurationFromConfigFile("OTP_Timeout")
    );

    if (user.Result.length == 1) {
      let userupdate = await DataService.patch(
        modelname,
        condition,
        { otp: 3256, otp_expiry: otp_expiry },
        {}
      );
      let data = {
        StatusCode: 200,
        Result: {
          user_id: user.Result[0].user_id,
          phone_no: user.Result[0].phone_no,
          otp: "sent"
        }
      };
      UtilityService.log(
        "Execution end of log in and log in success" + data,
        1
      );
      return UtilityService.replayData(replay, data);
    } else {
      throw new Error(
        "we can't send you otp because there is more then 2 account of same number."
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

/**
 * @param  {} request
 * @param  {} replay
 */
exports.forgetpasswordchange = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of forget password", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      user_id: request.payload.user_id
    };
    let fields = "user_id otp otp_expiry password";
    let passwordIsNull = true;
    let boolcheckpasswordsame = false;
    if (
      request.payload.new_password != null &&
      request.payload.new_password != undefined
    ) {
      passwordIsNull = false;
      boolcheckpasswordsame = true;
      //await UtilityService.checkPasswordIsSame(request.payload.new_password, request.payload.confirm_password);
    }
    let user = await DataService.findModel(modelname, condition, fields, {});

    if (user.Result.length == 1) {
      let ok =
        request.payload.otp == user.Result[0].otp &&
        UtilityService.addMinInUserPassedDate(user.Result[0].otp_expiry, 1) >
          Date.now();
      if (ok) {
        // let hasedpassword=await UtilityService.hashPasswordstring(request.payload.new_password);
        if (passwordIsNull) {
          let userupdate = await DataService.patch(
            modelname,
            condition,
            {
              otp: 3256,
              otp_expiry: UtilityService.addMinInUserPassedDate(
                user.Result[0].otp_expiry,
                5
              )
            },
            {}
          );
          let data = { StatusCode: 200, Result: { otpaccept: ok } };
          UtilityService.log(
            "Execution end of log in and log in success" + data,
            1
          );
          return UtilityService.replayData(replay, data);
        } else {
          if (boolcheckpasswordsame) {
            let userupdate = await DataService.patch(
              modelname,
              condition,
              {
                otp: 3256,
                otp_expiry: Date.now(),
                password: request.payload.new_password.toString()
              },
              {}
            );
            let data = { StatusCode: 200, Result: { passwordchanged: ok } };
            UtilityService.log(
              "Execution end of log in and log in success" + data,
              1
            );
            return UtilityService.replayData(replay, data);
          } else {
            throw new Error("There should be password entered.");
          }
        }
      } else {
        if (request.payload.otp != user.Result[0].otp) {
          throw new Error("OTP is not matching");
        } else if (
          !(
            UtilityService.addMinInUserPassedDate(
              user.Result[0].otp_expiry,
              1
            ) > Date.now()
          )
        ) {
          throw new Error(
            "OTP is not matching because it is expired regenerate it."
          );
        }

        throw new Error("there is some unkown issue .");
      }
    } else {
      throw new Error("there is no user created in datbase using this number.");
    }
  } catch (e) {
    let data = {
      StatusCode: 601,
      Result: { Error: "This is a error || " + e }
    };
    return UtilityService.replayData(replay, data);
  }
};

/**
 * @param  {} request
 * @param  {} replay
 */
exports.changePassword = async function(request, replay) {
  try {
    UtilityService.log("Execution Start of forget password", 1);
    let condition = {
      is_active: true,
      is_deleted: false,
      user_id: request.payload.user_id
    };
    let fields = "user_id password";
    let boolcheckpasswordsame = await UtilityService.checkPasswordIsSame(
      request.payload.new_password,
      request.payload.confirm_password
    );
    let user = await DataService.findModel(modelname, condition, fields, {});
    let ok = await UtilityService.checkPassword(
      user.Result[0],
      request.payload.current_password,
      user.Result[0].password
    );
    if (boolcheckpasswordsame && ok) {
      if (user.Result.length == 1) {
        // let hasedpassword=await UtilityService.hashPasswordstring(request.payload.new_password);
        let userupdate = await DataService.patch(
          modelname,
          condition,
          {
            otp: 325697,
            otp_expiry: Date.now(),
            password: request.payload.new_password.toString()
          },
          {}
        );
        let data = {
          StatusCode: 200,
          Result: { user_id: userupdate.Result.user_id }
        };
        UtilityService.log(
          "Execution end of log in and log in success" + data,
          1
        );
        return UtilityService.replayData(replay, data);
      } else {
        throw new Error("More then user is on the same user_id");
      }
    } else {
      throw new Error(
        "Confirm Password and new password is not matching or may be current password is not correct."
      );
    }
  } catch (e) {
    let data = {
      StatusCode: 601,
      Result: { Error: "This is a error || " + e }
    };
    return UtilityService.replayData(replay, data);
  }
};

//#endregion log in flow process

//#region projects
/**
 * 
 *
 * @summary get projects details
 * @desc Route:
  <ol>
    <li>/api/user/getprojects</li>
  </ol>
 * @param {Object} request - Request Object
 * @param {Object} reply - Reply Object
 */
exports.getprojects = async function(request, replay) {
  try {
    var Objects = {};
    // Objects.populate = "projects_details";
    let count = await DataService.count(
      "Project",
      "project_id",
      "project_id",
      {}
    );

    Objects["limit"] = 6;
    Objects["skip"] =
      [null, undefined].indexOf(typeof request.payload.pageValue) == -1 &&
      parseInt(request.payload.pageValue) != 0
        ? parseInt(request.payload.pageValue - 1) * Objects["limit"]
        : 0;
        Objects.sort={project_id:-1};
    let nextPage = count.Result.length - Objects["limit"] >= Objects["skip"];
    //[null,undefined].indexOf(typeof(request.payload.pageValue))==-1?(request.payload.pageValue)*(6):1;
    let dataUpdated = await DataService.findModel(
      "Project",
      { [primarykey]: request.payload.user_id },
      "user_id created_date project_id imagelink type name status winner highestquote averagequote lowestquote product_id expected_date quantity",
      Objects
    );
    dataUpdated.Result = UtilityService.removeFieldsWhichAreNotAllwoedToEdit(
      dataUpdated.Result,
      notallowedData.split(" "),
      true
    );

    dataUpdated.Result["nextPage"] = nextPage;
    if (dataUpdated != null)
      return UtilityService.replayData(replay, dataUpdated);
  } catch (e) {
    let data = {
      StatusCode: 601,
      Result: { Error: "This is a error || " + e }
    };
    return UtilityService.replayData(replay, data);
  }
};

//#endregion
