import { StockMarket } from './StockMarket';

export interface IStock {

  bloombergTerminalUrl?: string;
  companyName: string;
  companyUrl: string;
  hasElonMuskTweetedAboutIt: boolean;
  id: string;
  isHot: boolean;
  marketSymbol: string;
  redditMentions: number;
  stockMarket: StockMarket;
  value: number;
  updatedAt: Date;

}
