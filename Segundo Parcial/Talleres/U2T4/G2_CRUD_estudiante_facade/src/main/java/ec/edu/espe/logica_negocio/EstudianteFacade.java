package main.java.ec.edu.espe.logica_negocio;

import java.util.ArrayList;
import main.java.ec.edu.espe.datos.model.Estudiante;

/**
 * Patron Facade para simplificar operaciones CRUD de Estudiante
 * @author MATEO, Stefy
 */
public class EstudianteFacade {
    
    // Servicio de estudiantes
    private EstudianteService estudianteService;
    
    public EstudianteFacade() {
        this.estudianteService = new EstudianteService();
    }
    
    // Crear estudiante
    public String crearEstudiante(String id, String nombre, int edad) {
        Estudiante nuevoEstudiante = new Estudiante(id, nombre, edad);
        return estudianteService.crearEstudiante(nuevoEstudiante);
    }
    
    // Listar todos los estudiantes
    public ArrayList<Estudiante> obtenerTodosLosEstudiantes() {
        return estudianteService.listarEstudiantes();
    }
    
    // Actualizar estudiante
    public Estudiante actualizarEstudiante(String id, String nuevoNombre, int nuevaEdad) {
        Estudiante estudianteActualizado = new Estudiante(id, nuevoNombre, nuevaEdad);
        return estudianteService.editarEstudiante(id, estudianteActualizado);
    }
    
    // Eliminar estudiante
    public String eliminarEstudiante(String id) {
        return estudianteService.eliminarEstudiante(id);
    }
}
