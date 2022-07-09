"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// backend/functions/resize.ts
var resize_exports = {};
__export(resize_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(resize_exports);
var import_aws_sdk = __toESM(require("aws-sdk"), 1);
var import_sharp = __toESM(require("sharp"), 1);
var import_stream = __toESM(require("stream"), 1);
var width = 800;
var prefixPhotos = "photos";
var prefixOutput = "resized-photos";
var S3 = new import_aws_sdk.default.S3();
function readStreamFromS3(bucket, key) {
  console.log(`readStreamFromS3: ${bucket}, ${key}`);
  return S3.getObject({
    Bucket: bucket,
    Key: key
  }).createReadStream();
}
function writeStreamToS3(bucket, key) {
  console.log(`writeStreamToS3: ${bucket}, ${key}`);
  const pass = new import_stream.default.PassThrough();
  return {
    writeStream: pass,
    upload: S3.upload({
      Key: key,
      Bucket: bucket,
      Body: pass
    }).promise()
  };
}
function streamToSharp(width2) {
  return (0, import_sharp.default)().resize(width2);
}
var handler = async (event) => {
  const s3Record = event.Records[0].s3;
  const key = s3Record.object.key;
  const bucket = s3Record.bucket.name;
  console.log(`key: ${key}`);
  console.log(`bucket: ${bucket}`);
  if (!key.startsWith(prefixPhotos)) {
    console.log("exiting, this is not a /photos object");
    return false;
  }
  const readStream = readStreamFromS3(bucket, key);
  const resizeStream = streamToSharp(width);
  let newKey = `${prefixOutput}/${key.substring(key.lastIndexOf("/") + 1)}`;
  console.log(`newKey: ${newKey}`);
  const { writeStream, upload } = writeStreamToS3(bucket, newKey);
  readStream.pipe(resizeStream).pipe(writeStream);
  await upload;
  return true;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
