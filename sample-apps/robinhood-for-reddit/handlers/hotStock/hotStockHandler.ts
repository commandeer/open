import { Context, Handler } from 'aws-lambda';
import { IHttpResponse, IStock, StockMarket } from './types';
import { HotStockService } from './hotStockService';

/**
 * @description handle a request to get hot stocks
 * @param event event object
 * @param context context object
 */
const process: Handler = async (event: any, context: Context) => {
  console.info('hotStockHandler.process', { event });

  try {
    // get the array of hot stocks from the hot stock service
    const hotStocks: IStock[] = await HotStockService.getHotStocks();

    // create a valid response object
    const response: IHttpResponse = {
      statusCode: 200,
      body: JSON.stringify(hotStocks),
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      }
    };

    context.succeed(response);
  } catch (exception) {
    console.error('hotStockHandler.error', { exception });
    context.fail(exception);
  }
};

export { process };
