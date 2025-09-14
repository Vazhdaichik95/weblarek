import { TPayment } from "../../types";

export class Buyer {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;

  constructor() {
    this.payment='';
    this.email='';
    this.phone='';
    this.address='';
  }

  /**
   * сохранение вида оплаты
   */
  setPayment(payment: TPayment) {
    this.payment=payment;
  }

  /**
   * сохранение email.
   */
  setEmail(email: string) {
    this.email=email;
  }

  /**
   * сохранение телефона.
   */
  setPhone(phone: string) {
    this.phone = phone;
  }

  /**
   * сохранение адреса доставки.
   */
  setAddress(address: string) {
    this.address=address;
  }

  /**
   * получение вида оплаты.
   */
  getPayment(): TPayment {
    return this.payment;
  }

  /**
   * получение email.
   */
  getEmail(): string {
    return this.email;
  }

  /**
   * получение телефона.
   */
  getPhone(): string {
    return this.phone;
  }

  /**
   * получение адреса доставки.
   */
  getAddress(): string {
    return this.address;
  }

  /**
   * очищение данных.  
   */
  clearData() {
    this.payment='';
    this.email='';
    this.phone='';
    this.address='';
  }

  /**
   * проверка(валидация) данных
   */
  validateData(): string {
    if(this.payment='') return 'Необходимо выбрать способ оплаты';
    if(this.email='') return 'Необходимо ввести email';
    if(this.phone='') return 'Необходимо ввести номер телефона';
    if(this.address='') return 'Необходимо ввести адрес доставки';
    return '';
  }
}