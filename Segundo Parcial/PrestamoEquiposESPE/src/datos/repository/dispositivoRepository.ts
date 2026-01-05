import { Dispositivo } from "../model/dispositivoModel";
import { RepositoryObserver } from "./repositoryObserver";

export class DispositivoRepository {
  private dispositivos: Dispositivo[] = [
    // --- 5 Proyectores ---
    new Dispositivo('PRJ-001', 'Proyector', 'Epson', 'PowerLite E20', 'Aula 101', 'Disponible'),
    new Dispositivo('PRJ-002', 'Proyector', 'BenQ', 'MW560', 'Sala de Juntas A', 'Prestado'),
    new Dispositivo('PRJ-003', 'Proyector', 'Sony', 'VPL-PHZ10', 'Auditorio Principal', 'Mantenimiento'),
    new Dispositivo('PRJ-004', 'Proyector', 'Optoma', 'X343E', 'Laboratorio 1', 'Disponible'),
    new Dispositivo('PRJ-005', 'Proyector', 'ViewSonic', 'PA503S', 'Bodega TIC', 'Dañado'),

    // --- 2 Laptops ---
    new Dispositivo('LPT-001', 'Laptop', 'Dell', 'Latitude 5420', 'Oficina de TI', 'Prestado'),
    new Dispositivo('LPT-002', 'Laptop', 'HP', 'ProBook 450 G8', 'Recepción', 'Disponible'),

    // --- 3 Pantallas Inteligentes ---
    new Dispositivo('SCN-001', 'Pantalla Inteligente', 'Samsung', 'Flip 2', 'Sala Creativa', 'Disponible'),
    new Dispositivo('SCN-002', 'Pantalla Inteligente', 'LG', 'One:Quick Works', 'Oficina Director', 'Disponible'),
    new Dispositivo('SCN-003', 'Pantalla Inteligente', 'Huawei', 'IdeaHub S2', 'Sala de Conferencias', 'Mantenimiento')
  ];
  private observers: RepositoryObserver<Dispositivo>[] = [];

  attach(observer: RepositoryObserver<Dispositivo>): void {
    this.observers.push(observer);
  }

  detach(observer: RepositoryObserver<Dispositivo>): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  private notify(): void {
    this.observers.forEach(o => o.update([...this.dispositivos]));
  }

  notifyError(error: Error) {
    this.observers.forEach(o => o.error?.(error));
  }

  create(dispositivo: Dispositivo): void {
    this.dispositivos.push(dispositivo);
    this.notify();
  }

  findAll(): Dispositivo[] {
    return [...this.dispositivos];
  }

  findById(id: string): Dispositivo | undefined {
    return this.dispositivos.find(d => d.id === id);
  }

  update(id: string, data: Partial<Dispositivo>): boolean {
    const dispositivo = this.findById(id);
    if (!dispositivo) return false;

    Object.assign(dispositivo, data, { updatedAt: new Date() });
    this.notify();
    return true;
  }

  delete(id: string): boolean {
    const lengthBefore = this.dispositivos.length;
    this.dispositivos = this.dispositivos.filter(d => d.id !== id);

    if (this.dispositivos.length !== lengthBefore) {
      this.notify();
      return true;
    }
    return false;
  }
}
