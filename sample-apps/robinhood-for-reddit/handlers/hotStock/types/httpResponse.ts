import { IHttpResponse } from './IHttpResponse';

export class HttpResponse implements IHttpResponse {

  public body?: string;
  public headers?: any;
  public statusCode: number;

  constructor(response: IHttpResponse) {
    this.body = response.body;   
    this.headers = response.headers;
    this.statusCode = response.statusCode;
  }

}
