import { IApi, IProduct, TOrder, TOrderResponse, TProductsResponse } from "../types";

export class DataFromAPI {
  constructor(protected api: IApi)
  {}

  getAllProducts(): Promise<IProduct[]> {
    return this.api.get<TProductsResponse>('/product/')
          .then(res => res.items);
  }

  sendOrder(orderData: TOrder): Promise<TOrderResponse> {
    return this.api.post<TOrderResponse>('/order/',orderData);
  }
}