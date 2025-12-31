export class Prestamo {
  constructor(
    public id: string,
    public estudianteId: string, 
    public ubicacion: string,
    public estado: 'ACTIVO' | 'FINALIZADO' | 'MORA', 
    public horaInicio: Date,
    public horaFin: Date,
    public idDispositivo: string , 
    
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}