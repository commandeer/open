import { v4 as uuid } from 'uuid';
import { IStock, StockMarket } from './';

export class Stock implements IStock {

  public bloombergTerminalUrl?: string;
  public companyName: string;
  public companyUrl: string;
  public hasElonMuskTweetedAboutIt: boolean;
  public id: string;
  public isHot: boolean;
  public marketSymbol: string;
  public redditMentions: number;
  public stockMarket: StockMarket;
  public updatedAt: Date;
  public value: number;

  constructor(stock: IStock) {
    this.id = (stock.id)
      ? stock.id
      :uuid();

    this.bloombergTerminalUrl = stock.bloombergTerminalUrl;
    this.companyName = stock.companyName;
    this.companyUrl = stock.companyUrl;
    this.hasElonMuskTweetedAboutIt = stock.hasElonMuskTweetedAboutIt;
    this.isHot = stock.isHot;
    this.marketSymbol = stock.marketSymbol;
    this.redditMentions = stock.redditMentions;
    this.stockMarket = stock.stockMarket;
    this.updatedAt = stock.updatedAt;
    this.value = stock.value;
  }

}
