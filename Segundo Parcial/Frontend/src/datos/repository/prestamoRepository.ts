import { Prestamo } from "../model/prestamoModel";
import { RepositoryObserver } from "./repositoryObserver";

export class PrestamoRepository {
  private prestamos: Prestamo[] = [];
  private observers: RepositoryObserver<Prestamo>[] = [];

  attach(observer: RepositoryObserver<Prestamo>): void {
    this.observers.push(observer);
  }

  detach(observer: RepositoryObserver<Prestamo>): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  private notify(): void {
    this.observers.forEach(o => o.update([...this.prestamos]));
  }

  notifyError(error: Error) {
    this.observers.forEach(o => o.error?.(error));
  }

  create(prestamo: Prestamo): void {
    this.prestamos.push(prestamo);
    this.notify();
  }

  findAll(): Prestamo[] {
    return [...this.prestamos];
  }

  findById(id: string): Prestamo | undefined {
    return this.prestamos.find(p => p.id === id);
  }

  update(id: string, data: Partial<Prestamo>): boolean {
    const prestamo = this.findById(id);
    if (!prestamo) return false;
    Object.assign(prestamo, data, { updatedAt: new Date() });
    this.notify();
    return true;
  }

  delete(id: string): boolean {
    const lengthBefore = this.prestamos.length;
    this.prestamos = this.prestamos.filter(p => p.id !== id);
    if (this.prestamos.length !== lengthBefore) {
      this.notify();
      return true;
    }
    return false;
  }
}
