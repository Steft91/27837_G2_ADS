export class Estudiante {
  constructor(
    public id: string,
    public nombre: string,
    public correo: string,
    public contraseña: string,
    public carrera: string,
    public materiasInscritasIds: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}