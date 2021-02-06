import moment from 'moment';
import { Context, Handler } from 'aws-lambda';
import { IStock, StockMarket } from './types';

/**
 * @description handle a request to get hot stocks
 * @param event event object
 * @param context context object
 */
const process: Handler = async (event: any, context: Context) => {
  console.info('hotStockHandler.process', { event });

  try {
    // array of hot stocks to return
    const hotStocks: IStock[] = [];

    // GameStop
    const gamestopStock: IStock = {
      bloombergTerminalUrl: 'CAN_YOU_GET_THIS_?',
      companyName: 'GameStop Corp.',
      companyUrl: 'https://www.gamestop.com',
      hasElonMuskTweetedAboutIt: true,
      id: '123',
      isHot: true,
      marketSymbol: 'GME',
      redditMentions: 1000,
      stockMarket: StockMarket.NYSE,
      value: 61.30,
      updatedAt: moment().toDate(),
    };

    console.debug('gamestop object', { gamestopStock });

    // add gamestop stock
    hotStocks.push(gamestopStock);

    // return the objects   
    console.debug('returning objects', { hotStocks });

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
    context.fail(exception);
  }
};

export { process };
