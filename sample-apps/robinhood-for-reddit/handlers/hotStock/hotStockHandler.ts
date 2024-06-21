import { Context, Handler } from 'aws-lambda';
import { HttpResponse, Stock } from './types';
import { HotStockService } from './hotStockService';
import { LoggerService } from '../_base/services/logger/loggerService';

/**
 * @description handle a request to get hot stocks
 * @param event event object
 * @param context context object
 */
const process: Handler = async (event: any, context: Context) => {
  try {
    LoggerService.debug('hotStockHandler.process', { event });

    // get the array of hot stocks from the hot stock service
    const hotStocks: Stock[] = await HotStockService.getHotStocks();

    /*
      create a valid response object
        - sets cors and cookie settings
        - sets to cache for 4 hours
    */
    const response = new HttpResponse({
      statusCode: 200,
      body: JSON.stringify(hotStocks),
      headers: {
        "Access-Control-Allow-Origin" : "*",                        // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true,                  // Required for cookies, authorization headers with HTTPS
        "Cache-Control": "public, max-age=14400, s-maxage=14400'"   // cache the response for 4 hours
      }
    });

    // return the response back
    context.succeed(response);
  } catch (error) {
    // report the error to the console
    LoggerService.error('hotStockHandler.error', { error });

    let body = '';

    try {
      body = JSON.stringify(error);
    } catch (ex) {
      body = 'Unable to stringify result';
    }

    const response = new HttpResponse({
      statusCode: 500,
      body,
      headers: {
        "Access-Control-Allow-Credentials" : true,                  // Required for cookies, authorization headers with HTTPS
        "Cache-Control": "no-cache"                                 // No Cache
      }
    });

    // return back as success, but this is has a failed statusCode
    context.succeed(response);
  }
};

export { process };
