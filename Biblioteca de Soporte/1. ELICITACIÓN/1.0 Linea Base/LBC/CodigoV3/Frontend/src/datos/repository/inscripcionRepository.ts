import { Inscripcion } from "../model/inscripcionModel";

export class InscripcionRepository {
  private inscripciones: Inscripcion[] = [
    new Inscripcion("1", "1", "101", new Date("2025-01-10")),
    new Inscripcion("2", "2", "104", new Date("2025-01-11")),
    new Inscripcion("3", "3", "107", new Date("2025-01-12")),
    new Inscripcion("4", "4", "110", new Date("2025-01-13")),
    new Inscripcion("5", "5", "113", new Date("2025-01-14")),
    new Inscripcion("6", "6", "116", new Date("2025-01-15")),
    new Inscripcion("7", "7", "119", new Date("2025-01-16")),
    new Inscripcion("8", "8", "122", new Date("2025-01-17")),
    new Inscripcion("9", "9", "125", new Date("2025-01-18")),
    new Inscripcion("10", "10", "128", new Date("2025-01-19")),
  ];

  findAll(): Inscripcion[] {
    return [...this.inscripciones];
  }

  findById(id: string): Inscripcion | undefined {
    return this.inscripciones.find(i => i.id === id);
  }

  findByEstudianteId(estudianteId: string): Inscripcion[] {
    return this.inscripciones.filter(i => i.estudianteId === estudianteId);
  }

  findByMateriaId(materiaId: string): Inscripcion[] {
    return this.inscripciones.filter(i => i.materiaId === materiaId);
  }
}
