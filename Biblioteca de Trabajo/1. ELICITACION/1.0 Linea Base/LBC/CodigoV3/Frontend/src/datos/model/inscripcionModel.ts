export class Inscripcion {
  constructor(
    public id: string,
    public estudianteId: string, 
    public materiaId: string,   
    public fechaInscripcion: Date
  ) {}
}