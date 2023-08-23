const AWS = require('aws-sdk');
const translate = new AWS.Translate({ region: 'us-west-2' }); 

async function translateJson(json, sourceLanguageCode, targetLanguageCode) {
  try {
    const translatedJson = {};
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const translationParams = {
          SourceLanguageCode: sourceLanguageCode,
          TargetLanguageCode: targetLanguageCode,
          Text: key,
        };
        const translationResult = await translate.translateText(translationParams).promise();
        const translatedKey = translationResult.TranslatedText;
        translatedJson[translatedKey] = json[key];
      }
    }
    return translatedJson;
  } catch (error) {
    console.log("translatedJson error", error);
    throw new Error(error.message);
  }
}


module.exports = {
  translateJson,
};