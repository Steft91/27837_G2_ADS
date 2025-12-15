import { Dispositivo } from "../model/dispositivoModel";
import { RepositoryObserver } from "./repositoryObserver";

export class DispositivoRepository {
  private dispositivos: Dispositivo[] = [];
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
