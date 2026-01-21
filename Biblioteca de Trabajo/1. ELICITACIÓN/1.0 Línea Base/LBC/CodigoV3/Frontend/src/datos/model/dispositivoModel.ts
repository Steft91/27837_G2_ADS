export class Dispositivo {
  constructor(
    public id: string,
    public tipo: string,
    public marca: string,
    public modelo: string,
    public ubicacion: string,
    public estado: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
