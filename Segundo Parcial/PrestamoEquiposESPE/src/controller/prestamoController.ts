import { Prestamo } from "../datos/model/prestamoModel";
import { PrestamoRepository } from "../datos/repository/prestamoRepository";

export class PrestamoController {
  constructor(private repository: PrestamoRepository) {}

  crear(data: Omit<Prestamo, "id" | "createdAt" | "updatedAt" | "code">): void {
    this.validar(data);

    const code = this.generarCodigoQR();
    const prestamo = new Prestamo(
      crypto.randomUUID(),
      data.estudianteId,
      data.idClase,
      data.estado,
      data.horaInicio,
      data.horaFin,
      data.idDispositivo,
      code
    );

    this.repository.create(prestamo);
  }

  listar() {
    return this.repository.findAll();
  }

  actualizar(id: string, data: Partial<Prestamo>): void {
    if (!id) throw new Error("ID inválido");
    this.validarParcial(data);
    const ok = this.repository.update(id, data);
    if (!ok) throw new Error("Préstamo no encontrado");
  }

  eliminar(id: string): void {
    if (!id) throw new Error("ID inválido");
    const ok = this.repository.delete(id);
    if (!ok) throw new Error("Préstamo no encontrado");
  }

  private validar(data: any): void {
    if (!data.estudianteId || typeof data.estudianteId !== "string" || data.estudianteId.trim().length === 0)
      throw new Error("ID de estudiante inválido");
    if (!data.idClase || typeof data.idClase !== "string" || data.idClase.trim().length === 0)
      throw new Error("ID de clase inválido");
    if (!data.estado || !["ACTIVO", "FINALIZADO", "MORA"].includes(data.estado))
      throw new Error("Estado inválido");
    if (!data.horaInicio || !(data.horaInicio instanceof Date))
      throw new Error("Hora de inicio inválida");
    if (!data.horaFin || !(data.horaFin instanceof Date))
      throw new Error("Hora de fin inválida");
    if (!data.idDispositivo || typeof data.idDispositivo !== "string" || data.idDispositivo.trim().length === 0)
      throw new Error("ID de dispositivo inválido");
    if (data.horaFin <= data.horaInicio)
      throw new Error("La hora de fin debe ser posterior a la hora de inicio");
  }

  private validarParcial(data: Partial<Prestamo>): void {
    if (data.estado && !["ACTIVO", "FINALIZADO", "MORA"].includes(data.estado))
      throw new Error("Estado inválido");
    if (data.horaInicio && !(data.horaInicio instanceof Date))
      throw new Error("Hora de inicio inválida");
    if (data.horaFin && !(data.horaFin instanceof Date))
      throw new Error("Hora de fin inválida");
    if (data.horaInicio && data.horaFin && data.horaFin <= data.horaInicio)
      throw new Error("La hora de fin debe ser posterior a la hora de inicio");
  }

  private generarCodigoQR(): string {
    return 'QR' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}