import { Dispositivo } from "../datos/model/dispositivoModel";
import { DispositivoRepository } from "../datos/repository/dispositivoRepository";
import { DeviceDisponibility } from "@/types";
import { Monitor, Laptop, Tablet, Camera, Mic } from 'lucide-react';

export class DispositivoController {
  constructor(private repository: DispositivoRepository) {}

  crear(data: Omit<Dispositivo, "id" | "createdAt" | "updatedAt">): void {
    this.validar(data);

    const dispositivo = new Dispositivo(
      crypto.randomUUID(),
      data.tipo.trim(),
      data.marca.trim(),
      data.modelo.trim(),
      data.ubicacion.trim(),
      data.estado.trim()
    );

    this.repository.create(dispositivo);
  }

  listar() {
    return this.repository.findAll();
  }

  actualizar(id: string, data: Partial<Dispositivo>): void {
    if (!id) throw new Error("ID inválido");

    this.validarParcial(data);
    const ok = this.repository.update(id, data);

    if (!ok) throw new Error("Dispositivo no encontrado");
  }

  eliminar(id: string): void {
    if (!id) throw new Error("ID inválido");

    const ok = this.repository.delete(id);
    if (!ok) throw new Error("Dispositivo no encontrado");
  }


  private validar(data: any): void {
    if (!data.tipo || data.tipo.trim().length < 3)
      throw new Error("Tipo inválido");

    if (!data.marca || data.marca.trim().length < 2)
      throw new Error("Marca inválida");

    if (!data.modelo || data.modelo.trim().length < 2)
      throw new Error("Modelo inválido");

    if (!data.ubicacion)
      throw new Error("Ubicación obligatoria");

    if (!data.estado)
      throw new Error("Estado obligatorio");
  }

  private validarParcial(data: Partial<Dispositivo>): void {
    if (data.tipo && data.tipo.trim().length < 3)
      throw new Error("Tipo inválido");

    if (data.modelo && data.modelo.trim().length < 2)
      throw new Error("Modelo inválido");
  }

  obtenerDisponibles(): DeviceDisponibility[] {
    const iconMap: Record<string, React.ElementType> = {
      'Proyector': Monitor,
      'Laptop': Laptop,
      'Pantalla Inteligente': Tablet,
      'Cámara': Camera,
      'Micrófono': Mic,
    };

    const all = this.repository.findAll();
    const disponibles = all.filter(d => d.estado.trim().toLowerCase() === 'disponible');
    const tipoCounts: { [key: string]: { available: number; total: number } } = {};

    all.forEach(d => {
      const tipo = d.tipo.trim();
      if (!tipoCounts[tipo]) tipoCounts[tipo] = { available: 0, total: 0 };
      tipoCounts[tipo].total++;
    });
    disponibles.forEach(d => {
      const tipo = d.tipo.trim();
      if (tipoCounts[tipo]) tipoCounts[tipo].available++;
    });

    return Object.entries(tipoCounts).map(([type, { available, total }]) => ({
      type,
      available,
      total,
      icon: iconMap[type] || Monitor
    }));
  }
}
