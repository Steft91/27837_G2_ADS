export class Prestamo {
  constructor(
    public id: string,
    public estudianteId: string, 
    public idClase: string,
    public estado: 'ACTIVO' | 'FINALIZADO' | 'MORA', 
    public horaInicio: Date,
    public horaFin: Date,
    public idDispositivo: string , 
    public code: string,
    
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}