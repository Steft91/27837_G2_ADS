/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package main.java.ec.edu.espe.logica_negocio;

import java.util.ArrayList;
import main.java.ec.edu.espe.datos.model.Estudiante;

/**
 * Patrón Facade para simplificar las operaciones CRUD de Estudiante
 * Proporciona una interfaz unificada y simplificada para las operaciones
 * del sistema de gestión de estudiantes
 * 
 * @author MATEO, Stefy
 */
public class EstudianteFacade {
    
    // Instancia única del servicio de estudiantes
    private EstudianteService estudianteService;
    
    /**
     * Constructor que inicializa el servicio de estudiantes
     */
    public EstudianteFacade() {
        this.estudianteService = new EstudianteService();
    }
    
    /**
     * Crea un nuevo estudiante en el sistema
     * 
     * @param id Identificador único del estudiante
     * @param nombre Nombre completo del estudiante
     * @param edad Edad del estudiante
     * @return Mensaje indicando el resultado de la operación
     */
    public String crearEstudiante(String id, String nombre, int edad) {
        Estudiante nuevoEstudiante = new Estudiante(id, nombre, edad);
        return estudianteService.crearEstudiante(nuevoEstudiante);
    }
    
    /**
     * Obtiene la lista completa de estudiantes
     * 
     * @return ArrayList con todos los estudiantes registrados
     */
    public ArrayList<Estudiante> obtenerTodosLosEstudiantes() {
        return estudianteService.listarEstudiantes();
    }
    
    /**
     * Actualiza la información de un estudiante existente
     * 
     * @param id Identificador del estudiante a actualizar
     * @param nuevoNombre Nuevo nombre del estudiante
     * @param nuevaEdad Nueva edad del estudiante
     * @return Estudiante actualizado o null si no existe
     */
    public Estudiante actualizarEstudiante(String id, String nuevoNombre, int nuevaEdad) {
        Estudiante estudianteActualizado = new Estudiante(id, nuevoNombre, nuevaEdad);
        return estudianteService.editarEstudiante(id, estudianteActualizado);
    }
    
    /**
     * Elimina un estudiante del sistema
     * 
     * @param id Identificador del estudiante a eliminar
     * @return Mensaje indicando el resultado de la operación
     */
    public String eliminarEstudiante(String id) {
        return estudianteService.eliminarEstudiante(id);
    }
}
