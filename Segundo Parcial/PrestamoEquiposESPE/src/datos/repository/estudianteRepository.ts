import { Estudiante } from "../model/estudianteModel";

export class EstudianteRepository {
  private estudiantes: Estudiante[] = [
    new Estudiante("1", "Juan Pérez", "juan.perez@espe.edu.ec", "123456", "Ingeniería de Software", "101,102,103"),
    new Estudiante("2", "María García", "maria.garcia@espe.edu.ec", "abcdef", "Ingeniería Electrónica", "104,105,106"),
    new Estudiante("3", "Carlos Ruiz", "carlos.ruiz@espe.edu.ec", "qwerty", "Ingeniería Civil", "107,108,109"),
    new Estudiante("4", "Ana Torres", "ana.torres@espe.edu.ec", "torres2025", "Ingeniería Ambiental", "110,111,112"),
    new Estudiante("5", "Luis Martínez", "luis.martinez@espe.edu.ec", "martinez!", "Ingeniería Mecánica", "113,114,115"),
    new Estudiante("6", "Sofía Herrera", "sofia.herrera@espe.edu.ec", "sofiaH", "Ingeniería Química", "116,117,118"),
    new Estudiante("7", "Pedro Jiménez", "pedro.jimenez@espe.edu.ec", "pedroJ", "Ingeniería Industrial", "119,120,121"),
    new Estudiante("8", "Valeria Castro", "valeria.castro@espe.edu.ec", "valeriaC", "Ingeniería de Alimentos", "122,123,124"),
    new Estudiante("9", "Jorge Salazar", "jorge.salazar@espe.edu.ec", "jorgeS", "Ingeniería Agronómica", "125,126,127"),
    new Estudiante("10", "Gabriela Molina", "gabriela.molina@espe.edu.ec", "gabrielaM", "Ingeniería de Telecomunicaciones", "128,129,130"),
  ];

  findAll(): Estudiante[] {
    return [...this.estudiantes];
  }

  findById(id: string): Estudiante | undefined {
    return this.estudiantes.find(e => e.id === id);
  }

  findByCorreo(correo: string): Estudiante | undefined {
    return this.estudiantes.find(e => e.correo === correo);
  }

  findByCarrera(carrera: string): Estudiante[] {
    return this.estudiantes.filter(e => e.carrera === carrera);
  }

  authenticate(correo: string, contraseña: string): Estudiante | undefined {
    return this.estudiantes.find(e => e.correo === correo && e.contraseña === contraseña);
  }
}
