import { Context, Handler } from 'aws-lambda';
import { HttpResponse, Stock } from './types';
import { HotStockService } from '../hotStock/hotStockService';
import { LoggerService } from '../_base/services/logger/loggerService';

/**
 * @description handle a request to get hot stocks
 * @param event event object
 * @param context context object
 */
const process: Handler = async (event: any, context: Context) => {
  try {
    LoggerService.debug('stockProcessorHandler.process', { event });

    // get the array of hot stocks from the hot stock service
    const hotStocks: Stock[] = await HotStockService.loadHotStocks();

    // return the response back
    context.succeed(true);
  } catch (error) {
    // report the error to the console
    LoggerService.error('stockProcessorHandler.error', { error });

    // return back as success, but this is has a failed statusCode
    context.succeed(false);
  }
};

export { process };
