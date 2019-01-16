var redis = require('redis');
var uuid = require('uuid/v1');
var UtilityService = require('./utilityservice');
var client;


var connectToRedis = async () => {
	return new Promise((resolve, reject) => {
		client = redis.createClient({ connect_timeout: 5 * 60 * 10 });
		client.on("connect", () => {
			 UtilityService.log("redis connection is done.",1);
			return resolve(client);
		}).on("error", (err) => {
			//utilityService.log('Something went wrong.', err);
			return reject(err);
		});
	})

}


var connectionClose = async () => {
	await client.end(true);
	client.get("foo_rand000000000000", function (err, reply) {
		if (!err) {
		}
		else {
			 UtilityService.log("connection is close.",1);
		}
	});
}


// var init = async () => {
// 	try {
// 		await connectToRedis();
// 		try {
// 			let key = await createCache(uuid().toString(), { 'Name': 'test', 'UserId': '60', 'IsCraftsMan': '1' });
// 			let data = await getcache(key, {}).result;
// 			utilityService.log(key);

// 		}
// 		catch (err) {
// 			return UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redisissue": true }));
// 		}
// 	}
// 	catch (err) {
// 		return UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redisissue": true }));
// 	}
// }


exports.setcache = async (request,replay) => {
	try {
		UtilityService.log("Execution in set cache method.",1);
		await connectToRedis();
		UtilityService.log("Execution complete of set cache method.",1);
		try {
			let key = await createCache(uuid(),request.payload);
			UtilityService.log("cache is added in redis database with this key"+key+"added this values to corresponding"+JSON.stringify(request.payload),1);
			let valueAdded= await getValues(key);
			let data={ "StatusCode": 200, "Result": { "cachetestppass": true, "Token_Added": key,"Values":JSON.stringify(valueAdded)}};
			await connectionClose();
			return UtilityService.replayData(replay,data);
		}
		catch (err) {
		throw new Error("There is error in redis connection .");
		}
	}
	catch (err) {
		let data=await UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redisissue": true }))
		 return UtilityService.replayData(replay,data);
	}
}

exports.getcache = async (request,replay) => {
	try {
		await connectToRedis();
	
		try {
			utilityService.log(request.payload);
			let key=request.payload.key;
			let context=request.payload.context!=undefined?request.payload.context:{};
			let checkKeyIsAvaible = await IsKeyExists(key, {});
			if(checkKeyIsAvaible!=1){
				//UtilityService.log("checkKeyIsAvaible" +checkKeyIsAvaible);
			let data={ "StatusCode": 400, "Result": { "cachetestppass": true, "checkKeyIsAvaible": checkKeyIsAvaible,"Values":"NA"}};
			await connectionClose();
			return UtilityService.replayData(replay,data);
			}
			let valueAdded = await getValues(key, context);
			let data={ "StatusCode": 200, "Result": { "cachetestppass": true, "checkKeyIsAvaible": checkKeyIsAvaible,"Values":JSON.stringify(valueAdded)}};
			await connectionClose();
			return UtilityService.replayData(replay,data);
		}
		catch (err) {
			let data=await UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redisissue": true }));
			return UtilityService.replayData(replay,data);
			//return UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redis issue": true }));
		}
	}
	catch (err) {
		let data=await UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redisissue": true }));
		return UtilityService.replayData(replay,data);
	}
}

exports.getcachevalue = async (value) => {
	try {
		await connectToRedis();
		let context={};
		try {
			
			let key=value;
			//let context=request.payload.context!=undefined?request.payload.context:{};
			let checkKeyIsAvaible = await IsKeyExists(key, {});
			if(checkKeyIsAvaible!=1){
				//UtilityService.log("checkKeyIsAvaible" +checkKeyIsAvaible);
			let data={ "StatusCode": 400, "Result": { "cachetestppass": true, "checkKeyIsAvaible": checkKeyIsAvaible,"Values":"NA"}};
			await connectionClose();
			return false;
			}
			let valueAdded = await getValues(key, context);
			let data={ "StatusCode": 200, "Result": { "cachetestppass": true, "checkKeyIsAvaible": checkKeyIsAvaible,"Values":JSON.stringify(valueAdded)}};
			await connectionClose();
			return true;
		}
		catch (err) {
			let data=await UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redisissue": true }));
			return false;
			//return UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redis issue": true }));
		}
	}
	catch (err) {
		let data=await UtilityService.handleError("Error From Inernal Server", err, 500, JSON.stringify({ "error": err, "redisissue": true }));
		return false;
	}
}



/**
 *Create a cache in redis 
 * 
 * @summary Create a cache in db
 * @param {hashKey} key -Key we want to check if it is exists or not.
 * @param {objects} context - Context used for special purpose.
 */
async function createCache(hashKey, objects) {
	UtilityService.log("Execution in create Cache method.",1);
	return new Promise((resolve, reject) => {
		try {
		//	objects["updated_date"]=objects["updated_date"]==null && objects["updated_date"]==undefined?Date.now():UtilityService.addMinInUserPassedDate(objects["updated_date"],1);
			for (let [key, value] of Object.entries(objects)) {
				try {
					// hset: Set the string value of a hash field
					client.hset(`${hashKey}`, `${key}`, `${value}`, function (err, res) {
						if (err) {
							return reject(err);
						}
						else{
							UtilityService.findConfigurationFromConfigFile("redis_cache_timeout").then((timeout)=>{
								client.expire(`${hashKey}`,timeout);//it will be in seconds 60*60*24=86400
							}).catch((err)=>{
								client.expire(`${hashKey}`,60*60);//default it will be 1 hour 
							});
							
						}
					});
					
				}
				catch (err) {
					return reject(err);
				}
			}
			return resolve(hashKey);
		}
		catch (err) {
			return reject(err);
		}
	});
}

exports.createCacheFunction=async (objectsToSave)=>{
	try{
	await connectToRedis();
	try{
	let hashkey =await createCache(uuid(),objectsToSave);
	return hashkey;
}
catch(error){
	throw new Error("There is error in adding redis.");
}

	}
	catch(error){
		throw new Error("There is error in connecting redis.");
	}
}




exports.getCacheFunction=async (key,context)=>{
	try{
	await connectToRedis();
	try{
	let hashkey =await getValues(key,context);
	return hashkey;
}
catch(error){
	throw new Error("There is error in adding redis.");
}

	}
	catch(error){
		throw new Error("There is error in connecting redis.");
	}
}

/**
 * return value in of that speicifc key from redis 
 *
 * @summary find that key is avaible 
 * @param {key} key -Key we want to check if it is exists or not.
 * @param {context} context - Context used for special purpose.
 */
async function getValues(key, context) {

	return new Promise((resolve, reject) => {
		try {


			// hgetall: Get all the fields and values in a hash

			client.hgetall(key, function (err, res) {
				if (err) {
					utilityService.log(err);
					return reject(err);
				}
				else {
					//res["updated_date"]=res["updated_date"]==null && res["updated_date"]==undefined?Date.now():UtilityService.addMinInUserPassedDate(res["updated_date"],1);
					UtilityService.findConfigurationFromConfigFile("redis_cache_timeout").then((timeout)=>{
						client.expire(`${key}`,timeout);//it will be in seconds 60*60*24=86400
					}).catch((err)=>{
						client.expire(`${key}`,60*60);//default it will be 1 hour 
					});
					utilityService.log(res);
					return resolve(res);
					//return res;
				}
			});
		}
		catch (err) {
			utilityService.log(err);
		}
	});

}



/**
 * Check That Key is Avaibale in redis cache 
 *
 * @summary find that key is avaible 
 * @param {key} key -Key we want to check if it is exists or not.
 * @param {context} context - Context used for special purpose.
 */
async function IsKeyExists(key, context) {
	return new Promise((resolve, reject) => {
		try {


			// hgetall: Get all the fields and values in a hash

			client.exists(`${key}`, function (err, res) {
				if (err) {
					utilityService.log(err);
					return reject(err);
				}
				else {
					utilityService.log(res);
					return resolve(res);
					//return res;
				}
			});
		}
		catch (err) {
			utilityService.log(err);
		}
	});
	
	
	
	
}

/**
 * Update redis cache  in redis cache 
 *
 * @summary find that key is avaible 
 * @param {key} key -Key we want to check if it is exists or not.
 * @param {context} context - Context used for special purpose.
 */
async function updateRedisCache(key,keyvaluepairtoadd){

}
