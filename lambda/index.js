const AWS = require("aws-sdk");
const sharp = require("sharp");

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // react-nodebird-s3
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/image_a.png
  // decodeURIComponent -> 한글깨짐문제 해결방법
  console.log(Bucket, Key);
  const filename = Key.split("/")[Key.split("/").length - 1];
  const ext = Key.split("/")[Key.split(".").length - 1].toLowerCase();
  const requiredFormat = ext === "jpg" ? "jpeg" : ext;

  try {
    const s3Object = await s3.getObject({ Bucekt, Key }).promise();
    console.log("original", s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
      .reszie(400, 400, { fit: "inside" })
      .toFormat(requiredFormat)
      .toBuffer();
    await s3
      .putObject({
        Bucket,
        Key: `thumb/${filename}`,
        Body: resizedImage,
      })
      .promise();

    console.log("put", resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (err) {
    console.error(err);
    return callback(error);
  }
};
