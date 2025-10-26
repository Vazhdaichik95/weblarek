import { IBuyer, TPayment, TValidateErrors } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private buyerData: IBuyer;

  constructor(protected events: EventEmitter) {
    this.buyerData = {
      payment: "",
      email: "",
      phone: "",
      address: "",
    };
  }

  /**
   * сохранение вида оплаты
   */
  setPayment(payment: TPayment) {
    this.buyerData.payment = payment;
  }

  /**
   * сохранение email.
   */
  setEmail(email: string) {
    this.buyerData.email = email;
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
    this.buyerData.address = address;
  }

  setBuyerData(data: Partial<IBuyer>) {
    this.buyerData.payment = data.payment ?? this.buyerData.payment;
    this.buyerData.email = data.email ?? this.buyerData.email;
    this.buyerData.phone = data.phone ?? this.buyerData.phone;
    this.buyerData.address = data.address ?? this.buyerData.address;
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

  getBuyerData(): IBuyer {
    return this.buyerData;
  }

  setData(key: string, value: string) {
    switch (key) {
      case "address":
        this.setAddress(value);
        break;
      case "payment":
        this.setPayment(value as TPayment);
        break;
      case "phone":
        this.setPhone(value);
        break;
      case "email":
        this.setEmail(value);
        break;
    }
    this.events.emit("form:validate", this.validateData());
  }

  /**
   * очищение данных.
   */
  clearData() {
    this.buyerData.payment = "";
    this.buyerData.email = "";
    this.buyerData.phone = "";
    this.buyerData.address = "";
  }

  /**
   * проверка(валидация) данных
   */
  validateData(): TValidateErrors {
    const errors: TValidateErrors = {
      payment: "",
      email: "",
      phone: "",
      address: "",
    };

    if (this.getPayment() === "") errors.payment = "Выберите способ оплаты";

    if (this.getAddress() === "" || this.getAddress().length < 3)
      errors.address = "Введите адрес доставки";

    if (this.getEmail() === "") errors.email = "Введите email";
    else if (!/\S+@\S+\.\S+/.test(this.getEmail()))
      errors.email = "Неверный email";

    if (this.getPhone() === "") errors.phone = "Введите теелфон";
    else if (this.getPhone().replace(/\D/g, "").length < 10)
      errors.phone = "Неверный телефон";

    return errors;
  }
}
