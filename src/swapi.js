require('dotenv').config();
const AWS = require('aws-sdk');
const httpUtils = require('./utils/apiHandler');
const translationUtils =  require("./utils/translationUtils")

const swapiUrl = process.env.SWAPI_URL_API;

const getFilms = async(event) => {

    try {

        const apiUrl = `${swapiUrl}/films/?format=json`;
        const response = await httpUtils.get(apiUrl);
       
        return {
          statusCode: 200,
          body: JSON.stringify(response),
        };
      } catch (error) {
        console.log("getFilms error" , error)
        return {
          status: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }
}

const getFilmById = async(event) => {
    try {
        
        const { id } = event.pathParameters;
        const apiUrl = `${swapiUrl}/films/${id}/?format=json`;
        const data = await httpUtils.get(apiUrl);
        const sourceLanguageCode = 'en';
        const targetLanguageCode = 'es';
        const { opening_crawl, ...filmDataWithoutOpeningCrawl } = data;


        const translatedJson = await translationUtils.translateJson(
          filmDataWithoutOpeningCrawl,
          sourceLanguageCode,
          targetLanguageCode
        );    
    
        console.log(" translatedJson data CHANGE ", translatedJson)

        return {
            statusCode: 200,
            body:  JSON.stringify(translatedJson)
          };

    } catch (error) {
      console.log("getFillm error" , error)
        return {
            status: 500,
            body: JSON.stringify({ error }),
          };
    }
}

module.exports = {
    getFilms,
    getFilmById
}