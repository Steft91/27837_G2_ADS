export class Materia {
  constructor(
    public id: string,
    public nombre: string,
    public ubicacion: string,
    public horaInicio: number,
    public horaFin: number,
    public dias: string[],
    public estudianteIds: string, 
  ) {}
}