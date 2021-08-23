import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { IStock, StockMarket } from './types';
import { BaseService } from '../_base/services/baseService';

export class HotStockService extends BaseService {

  private static _hotStocks: IStock[] = [];

  /**
   * @description get a list of hot stocks
   * @static
   * @returns {IStock[]}
   * @memberof HotStockService
   */
  public static async getHotStocks(): Promise<IStock[]> {
    this.debug('HotStockService.getHotStocks');

    // if already cached, return the hot stocks
    if (this._hotStocks && this._hotStocks.length) {
      return this._hotStocks;
    }

    const updatedAt = moment().toDate();
   
    // AMC
    const amcStock: IStock = {
      bloombergTerminalUrl: 'CAN_YOU_GET_THIS_?',
      companyName: 'AMC Entertainment Holdings Inc',
      companyUrl: 'https://www.amctheatres.com/corporate',
      hasElonMuskTweetedAboutIt: false,
      id: uuid(),
      isHot: true,
      marketSymbol: 'AMC',
      redditMentions: 1000,
      stockMarket: StockMarket.NYSE,
      value: 6.83,
      updatedAt,
    };

    // GameStop
    const gamestopStock: IStock = {
      bloombergTerminalUrl: 'CAN_YOU_GET_THIS_?',
      companyName: 'GameStop Corp.',
      companyUrl: 'https://www.gamestop.com',
      hasElonMuskTweetedAboutIt: true,
      id: uuid(),
      isHot: true,
      marketSymbol: 'GME',
      redditMentions: 1000,
      stockMarket: StockMarket.NYSE,
      value: 61.30,
      updatedAt,
    };

    // add stocks
    this._hotStocks.push(amcStock);
    this._hotStocks.push(gamestopStock);

    return this._hotStocks;
  }
  
  public static async loadHotStocks(): Promise<boolean> {
    this.debug('HotStockService.loadHotStocks');


  }

}