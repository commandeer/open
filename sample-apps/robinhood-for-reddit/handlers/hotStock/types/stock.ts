import { IStock } from './IStock';

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

  constructor(response: IHttpResponse) {
    this.id = (response.id)
      ? response.id
      :uuid();

    this.bloombergTerminalUrl = response.bloombergTerminalUrl;
    this.companyName = response.companyName;
    this.companyUrl = response.companyUrl;
    this.hasElonMuskTweetedAboutIt = response.hasElonMuskTweetedAboutIt;
    this.isHot = response.isHot;
    this.marketSymbol = response.marketSymbol;
    this.redditMentions = response.redditMentions;
    this.stockMarket = response.stockMarket;
    this.updatedAt = response.updatedAt;
    this.value = response.value;
  }

}
