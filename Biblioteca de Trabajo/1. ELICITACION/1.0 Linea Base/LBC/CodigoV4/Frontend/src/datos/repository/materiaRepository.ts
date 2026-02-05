import { Materia } from "../model/materiaModel";

export class MateriaRepository {
  private materias: Materia[] = [
    new Materia("101", "Matemáticas I", "Edificio A", 8, 10, ["Lunes", "Miércoles"], "1,2"),
    new Materia("102", "Programación I", "Edificio B", 10, 12, ["Martes", "Jueves"], "1"),
    new Materia("103", "Física I", "Edificio C", 12, 14, ["Viernes"], "1"),
    new Materia("104", "Electrónica Básica", "Edificio D", 8, 10, ["Lunes", "Miércoles"], "2"),
    new Materia("105", "Circuitos", "Edificio D", 10, 12, ["Martes", "Jueves"], "2"),
    new Materia("106", "Sistemas Digitales", "Edificio D", 12, 14, ["Viernes"], "2"),
    new Materia("107", "Construcción", "Edificio E", 8, 10, ["Lunes", "Miércoles"], "3"),
    new Materia("108", "Topografía", "Edificio E", 10, 12, ["Martes", "Jueves"], "3"),
    new Materia("109", "Materiales", "Edificio E", 12, 14, ["Viernes"], "3"),
    new Materia("110", "Ecología", "Edificio F", 8, 10, ["Lunes"], "4"),
  ];

  findAll(): Materia[] {
    return [...this.materias];
  }

  findById(id: string): Materia | undefined {
    return this.materias.find(m => m.id === id);
  }

  findByNombre(nombre: string): Materia[] {
    return this.materias.filter(m => m.nombre === nombre);
  }

  findByUbicacion(ubicacion: string): Materia[] {
    return this.materias.filter(m => m.ubicacion === ubicacion);
  }
}
