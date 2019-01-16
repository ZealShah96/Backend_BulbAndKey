const s3 = require("./../../config/s3.config");
const env = require("./../../config/s3.env");
const fs = require("fs");
const uuid = require("uuid/v1");
const utilityService = require("./utilityservice");

exports.doUpload = async (req, res) => {
    let commonresponse = [];
  return new Promise(async (resolve, reject) => {
let length=req.payload.file.length;
   await  req.payload.file.forEach(async element => {
      let filekey = uuid();
      await fileUplaod(element,`profile/pictures/${req.payload.user_id}/${filekey}.png`,env)
        .then(data => {
          utilityService.log("file uploaded.");
          commonresponse.push();
          let imageUploadResponse = {
            StatusCode: 200,
            Result: {
              fileName: filekey.toString(),
              fileLocation: data.Location
            }
          };
          commonresponse.push(imageUploadResponse);
          length--;
          if(length==0){
              return resolve(commonresponse);
          }
          //  return resolve(imageUploadResponse);
        })
        .catch(err => {
            
          utilityService.log(err);
          let imageUploadFailedData = {
            StatusCode: 601,
            Result: { Error: "This is a error || " + err }
          };
          commonresponse.push(imageUploadFailedData);
          length--;
          if(length==0){
            return resolve(commonresponse);
          }
          //return reject(imageUploadFailedData);
        });
    });
   
   // return resolve(commonresponse);
  })
    .then(async commonresponse => {
      let imageUploadResponse = await utilityService.replayData(res, {
        StatusCode: 200,
        Result: {"NoOfImageUpload":commonresponse.length,data: commonresponse }
      });
      return imageUploadResponse;
    })
    .catch(async err => {
      let imageUploadResponse = await utilityService.replayData(res, {
        StatusCode: 601,
        Result: { data: commonresponse }
      });
      return imageUploadResponse;
    });
};

let fileUplaod = async (buffer, fileLocation, envVariable) => {
  const params = {
    Bucket: envVariable.Bucket,
    Key: fileLocation,
    Body: Buffer.from(buffer, "binary"),
    ContentType: "binary"
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        throw new Error(err);
      }
      return resolve(data);
    });
  });
  // require('./../../assests')
  //   var buf = new Buffer(data, 'base64');
  //   return new Promise((resolve, reject) => {
  //     utilityService.log(typeof buffer);
  //     fs.writeFile("./assests/"+uuid().toString()+".jpg",Buffer.from(buffer, "binary"),"binary",function(err) {
  //         if (err) {
  //           utilityService.log("There was an error writing the image");
  //           return reject("There was an error writing the image" + JSON.stringify(err));
  //         } else {
  //           utilityService.log("There file was written");
  //           return resolve("There file was written");
  //         }
  //       }
  //     );
  //     resolve("There file was written");

  //   });
};

exports.listKeyNames = (req, res) => {
  utilityService.log(req.user.userId);
  const params = {
    Bucket: env.Bucket,
    StartAfter: `profile/pictures/${req.payload.user_id}/`
  };
  var keys = [];
  try {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        utilityService.log(err, err.stack); // an error occurred
      } else {
        var contents = data.Contents;
        keys = data.Contents.sort(function(a, b) {
          var x = a["LastModified"];
          var y = b["LastModified"];
          return x > y ? -1 : x < y ? 1 : 0;
        });
        // contents.forEach(function (content) {
        //     keys.push(content);
        // });
        res.send(keys[0]);
      }
    });
  } catch (error) {}
};

exports.doDownload = (req, res) => {
  const params = {
    Bucket: env.Bucket,
    Key: req.payload.filename
  };

  res.setHeader("Content-Disposition", "attachment");

  s3.getObject(params)
    .createReadStream()
    .on("error", function(err) {
      res.status(500).json({ error: "Error -> " + err });
    })
    .pipe(res);
};
