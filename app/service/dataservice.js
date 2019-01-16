const mongoose = require('mongoose');

const utilityService = require('./utilityservice');
//color of log in console log.
const consoleOfNumber = 1;

//#region Find Operations For All Models
/**
 * Get All Records end point
 * @param {model} modelName - Model Name
 * @param {where} request - condition object for query
 * @param {fields} request - what things to replay
 * @param {options} request - options pass in query fetch
 * @returns {records} replay - return all entries of database which is active and not deleted.
 */
exports.findModel = async function (model, where, fields, options) {
  // utilityService.log("Execution In FindModel.");
  await utilityService.log("Execution In FindModel.", consoleOfNumber);
  var records;

    try {
      records = await FindRecords(model, where, fields, options);
      //utilityService.log("FindModel Is Working Fine.");
      await utilityService.log("FindModel Is Working Fine.", consoleOfNumber);
      return { "StatusCode": 200, "Result": await records };
    }
    catch (e) {
      return utilityService.handleError("Error in Finding Records", e, 404);
    }
  
}



/**
 * Find Records based on condition provided for any time 
 * @param {connectionUrl} modelName - Model Name
 * @param {model} request - Request Object
 * @param {where} request - condition object for query
 * @param {options} request - options pass in query fetch
 * @returns {docs} replay - return all entries of database which is active and not deleted and match condition provided and 
 */
async function FindRecords(model, where, fields, options) {
  //let Model = models.Model;
  let Model = require(getModel(model.toLowerCase())).Model;
  let populateString = options != null && options != undefined ? (options.populate != null && options.populate != undefined ? options.populate : '') : '';
  let condition = where != null ? where : { "is_deleted": false, "is_active": true };
  let sortobject=options.sort!=null && options.sort!=undefined?options.sort:{created_date:-1};
  let skipcount=options.skip!=null && options.skip!=undefined?options.skip:0;
  let limitcount=options.limit!=null && options.limit!=undefined?options.limit:0;
  fields+=' -_id';
  console.log(populateString)
  try {
    return new Promise((resolve, reject) => {
      debugger;
      Model.find(condition, fields).populate(`${populateString}`).skip(skipcount).limit(limitcount).exec((err, docs) => {
        if (docs != null) { 
          return resolve(docs);
        }
        else {
          return reject(err);
        }
      });
    });
  }

  catch (err) {
    throw err;
  }
}
//#endregion

//#region Create New Entry
/**
 * Create record End point.
 * @param {String} modelName - Model Name
 * @param {PrimarykeyValue} request - primarykey value on based it.It will fetch data.
 * @param {data} request - passed data of model which you need to add.
 * @param {options} request - options provided for saving data.
 * @returns {dataAdded} replay - return newly created document.
 */
exports.create = async function (model, PrimarykeyValue, data, options) {
  try {
    await utilityService.log("Exceution in create method.", consoleOfNumber);
  //  let connectionObject = await mongoConnection.mongoUtility.mongoConnect();
    await utilityService.log("Exceution start of last addded data method.", consoleOfNumber);
    let lastAddedData = await FindLastEntry(model, data, {}, options);
    await utilityService.log("Exceution done of last addded data method", consoleOfNumber);
    await utilityService.log(JSON.stringify(lastAddedData), consoleOfNumber);

    await utilityService.log(PrimarykeyValue + "will be incremented:" + options.incrementallow, consoleOfNumber);
    //this increase primarykey value is used to increase primarykey value of table and options.increament allow is shows that increate is allowed or not.
    //it is implement because of special requirement of user table for phone_no (phone_no:unique and user_id:increment allow.)
    data = await utilityService.incresePrimaryKeyValueInDataToAdd(data, lastAddedData, PrimarykeyValue, options.incrementallow);
    try {
      let checkDataAvaiable = await FindRecords(model, { [PrimarykeyValue]: data[PrimarykeyValue] }, {}, {});
      //  utilityService.log('\x1b[33m',"Exceution done of FindRecords method");
      await utilityService.log("Exceution done of FindRecords method", consoleOfNumber);
      if (checkDataAvaiable.length != 0) {
        return utilityService.handleError("error in creating new record" +" with Same " +PrimarykeyValue +" data avaibale use patch method to change.", null, 400);
      }
      else {
        //  utilityService.log("Exceution done of last addded data");
        let dataAdded = await createDataRecord(model, data, options);
        // utilityService.log('\x1b[33m', "Exceution done of creeted  data");
        await utilityService.log("Exceution done of creeted  data", consoleOfNumber);
        return utilityService.handleSuccess(await dataAdded, 201, "{}");
      }
    }
    catch (e) {
      return utilityService.handleError("error in creating new record", e, 404);
    }
  }
  catch (e) {
    return utilityService.handleError("error in connection establishment", e, 404);
  }
}

/**
 * create Models based on only data and model defination function 
 * @param {model} request - model name (like project,user etc.)
 * @param {data} request - data passed for creation of object
 * @returns {createdData} replay - return newly created document.
 */
async function createDataRecord(model, data) {
  let Model = require(getModel(model.toLowerCase())).Model;
  let newRecord = new Model(data);
  return new Promise((resolve, reject) => {
    try {
      let createdData = newRecord.save();
      return resolve(createdData);
    }
    catch (err) {
      reject(err);
    }
  });
}

//#endregion

//#region Delete Entry
/**
 * delete any record(making is_deleted column true.) End point
 * @param {model} request - model name (like project,user etc.)
 * @param {where} request - condition object for query
 * @param {options} request - options provided for deleting data.
 * @returns {recordDeleted} replay - return deleted document.
 */
exports.delete = async function (model, where, options) {
  // try {
    // let connectionObject = await mongoConnection.mongoUtility.mongoConnect();
    utilityService.log("Process In delete method of address.", consoleOfNumber);
    let processDone = await FindRecords(model, where);
    utilityService.log("Process done of delete method of address.", consoleOfNumber);
    if (processDone.length > 0) {
      try {
        let recordDeleted = await updateRecord(model, where, { "is_deleted": true }, options);
        return utilityService.handleSuccess(await recordDeleted, 200, "{}");
      }
      catch (e) {
        return utilityService.handleError("error in deleting record", e, 404);
      }
    }
    else {
      return utilityService.handleError("There is no record to delete for id", "", 400);
    }
  // }
  // catch (e) {
  //   return utilityService.handleError("error in connection establishment", e, 404);
  // }
}



/*
*un used method for delete records.
*/
async function deleteRecord(model, where) {
  let Model = require(getModel(model.toLowerCase())).Model;
  // try {
  try {
    let deleteDone = await Model.deleteOne(where);
    return await deleteDone;
  }
  catch (e) {
    throw e;

  }
}




//#endregion

//#region put Update Entry  


/**
 * Update saved Record End Point
 * @param {model} request - model name (like project,user etc.)
 * @param {where} request - condition object for query
 * @param {datatoreplace} request - data to provide for replace in database
 * @param {options} request - options provided for patching data.
 * @returns {dataUpdated} replay - return updated document.
 */
exports.patch = async function (model, where, datatoreplace, options) {
  // try {
    // let connectionObject = await mongoConnection.mongoUtility.mongoConnect();
    try {
      let dataUpdated = await updateRecord(model, where, datatoreplace, options);
      return utilityService.handleSuccess(await dataUpdated, 200, "{}");
    }
    catch (e) {
      return utilityService.handleError("error in patching record", e, 404);
    }
  // }
  // catch (e) {
  //   return utilityService.handleError("error in connection establishment", e, 404);
  // }
}


/**
 * Update Record function
 * @param {model} request - model name (like project,user etc.)
 * @param {where} request - condition object for query
 * @param {datatoreplace} request - data to provide for replace in database
 * @param {options} request - options provided for deleting data.
 * @returns {dataUpdated} replay - return  document with updated data.
 */
async function updateRecord(model, where, datatoreplace, options) {
  let Model = require(getModel(model.toLowerCase())).Model;
  try {
    return new Promise((resolve, reject) => {
      Model.findOneAndUpdate(where, datatoreplace, { new: true }, (err, doc) => {
        if (err != null ) {
          return reject(err);
        }
        else {
          let dataUpdated = doc;
          //prevent password hashing if request does n't contains password change request.(please look in to schema of user and find pre event in it for more understanding.)
          if(Object.keys(datatoreplace).indexOf("password")==-1){
                delete doc.password;
          }
          doc.save();
          return resolve(dataUpdated);
        }
      });
    });
  }
  catch (err) {
    throw err;
  }
}

//#endregion 

//#region Utility
/**
* Get Model based on model name passed.
* @param {request} request - name of model 
* @returns {modelPath} replay - return schema path based on given model.
*/
function getModel(request) {
  var model = [];

  if (typeof request === 'string') {
    model = request;
  } else {
    model = request.server.app.routeConfig.model[0].name;
  }
  return './../module/' + model + '/schema';
}

//#endregion

//#region Count Of models rows

/**
 * Count records in database end point
 * @param {model} request - model name (like project,user etc.)
 * @param {PrimarykeyValue} request - condition object for query(for future use if we want count based on condition.)
 * @param {fields} request - data to provide for  fetching columns from database.
 * @param {options} request - options provided for deleting data.
 * @returns {recordsForCount} replay - return list of document
 */
exports.count = async (model, PrimarykeyValue, fields, options) => {
  // try {
    // let connectionObject = await mongoConnection.mongoUtility.mongoConnect();
    try {
      let recordsForCount = await totalCount(model,fields,options);
      return utilityService.handleSuccess(await recordsForCount, 200, "{}");
    }
    catch (e) {
      return utilityService.handleError("error in counting record", e, 404);
    }
  // }
  // catch (e) {
  //   return utilityService.handleError("error in connection establishment", e, 404);
  // }

}

/**
* Find final count of any models entries function
* @param {model} request - model name (like project,user etc.)
* @param {fields} request - data to provide for fetching columns from database.
 * @param {options} request - options provided for couting data.(for future use.)
 * @returns {data} replay - return list of document
*/
async function totalCount(model, fields, options) {
  return new Promise((resolve, reject) => {
    try {
      //find total count using find records details
      let data = FindRecords(model, {}, fields, {});
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  })
}
//#endregion

//#region lastrow Of models 


/**
 * find last record end point
 * @param {model} request - model name (like project,user etc.)
 * @param {PrimarykeyValue} request - condition object for query(for future use if we want count based on condition.)
 * @param {fields} request - data to provide for replace in database
 * @param {options} request - options provided for finding last entered data.
 * @returns {lastEntryRecord} replay - return list of document
 */
exports.lastentry = async (model, PrimarykeyValue, fields, options) => {
  // try {
  //   let connectionObject = await mongoConnection.mongoUtility.mongoConnect();
    try {
     // utilityService.log(fields);
      let lastEntryRecord = await FindLastEntry(model, fields, options);
     // utilityService.log(lastEntryRecord);
      return utilityService.handleSuccess(await lastEntryRecord, 200, "{}");
    }
    catch (e) {
      return utilityService.handleError("error in counting record", e, 404);
    }
  // }
  // catch (e) {
  //   return utilityService.handleError("error in connection establishment", e, 404);
  // }

}

/**
 * count records functions
 * @param {model} request - model name (like project,user etc.)
 * @param {fields} request - data to provide for replace in database
 * @param {options} request - options provided for finding last entries.(for future use.)
 * @returns {docs} replay - return last record from all document
 */
async function FindLastEntry(model, fields, options) {
  let Model = require(getModel(model.toLowerCase())).Model;
  return new Promise((resolve, reject) => {
    try {
      //find total count using find records details
      Model.findOne({}, fields, { sort: { field: 'asc', _id: -1 }, limit: 1 }, (err, docs) => {
        if (docs != null) {
          return resolve(docs);
        }
        else {
          if (err != null)
            return reject(err);
          else
            return resolve(null);
        }
      });
    } catch (error) {
      return reject(error);
    }
  });
}
//#endregion