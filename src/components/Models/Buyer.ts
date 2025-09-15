import { IBuyer, TPayment } from "../../types";

export class Buyer {
  private buyerData: IBuyer;

  constructor() {
    this.buyerData= {
      payment: '',
      email: '',
      phone: '',
      address: ''
    }
  }

  /**
   * сохранение вида оплаты
   */
  setPayment(payment: TPayment) {
    this.buyerData.payment=payment;
  }

  /**
   * сохранение email.
   */
  setEmail(email: string) {
    this.buyerData.email=email;
  }

  /**
   * сохранение телефона.
   */
  setPhone(phone: string) {
    this.buyerData.phone = phone;
  }

  /**
   * сохранение адреса доставки.
   */
  setAddress(address: string) {
    this.buyerData.address=address;
  }

  /**
   * получение вида оплаты.
   */
  getPayment(): TPayment {
    return this.buyerData.payment;
  }

  /**
   * получение email.
   */
  getEmail(): string {
    return this.buyerData.email;
  }

  /**
   * получение телефона.
   */
  getPhone(): string {
    return this.buyerData.phone;
  }

  /**
   * получение адреса доставки.
   */
  getAddress(): string {
    return this.buyerData.address;
  }

  /**
   * очищение данных.  
   */
  clearData() {
    this.buyerData.payment='';
    this.buyerData.email='';
    this.buyerData.phone='';
    this.buyerData.address='';
  }

  /**
   * проверка(валидация) данных
   */
  validateData(): string {
    if(this.buyerData.payment === '') return 'Необходимо выбрать способ оплаты';
    if(this.buyerData.email === '') return 'Необходимо ввести email';
    if(this.buyerData.phone === '') return 'Необходимо ввести номер телефона';
    if(this.buyerData.address === '') return 'Необходимо ввести адрес доставки';
    return '';
  }
}