import faker from "faker";

class FakerClass {
  constructor() {
    this.data = [];
  }
  generar(cantidad) {
    let respuesta = [];

    for (let i = 0; i < cantidad; i++) {
      respuesta.push({
        title: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
        price: faker.finance.amount(10, 100000, 2),
        thumbnail: faker.image.avatar(),
      });
    }
    return respuesta;
  }
}
export const FakerService = new FakerClass();
