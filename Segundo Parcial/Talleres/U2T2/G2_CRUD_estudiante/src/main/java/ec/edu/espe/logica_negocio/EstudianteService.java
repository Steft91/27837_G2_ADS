/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package main.java.ec.edu.espe.logica_negocio;

import java.util.ArrayList;

import main.java.ec.edu.espe.datos.model.Estudiante;
import main.java.ec.edu.espe.datos.repository.EstudianteRepository;

/**
 *
 * @author MATEO, Stefy
 */
public class EstudianteService {
    private EstudianteRepository repo;
    
    public EstudianteService() {
        this.repo = new EstudianteRepository();
    }

    //Create
     public String crearEstudiante(Estudiante estudiante) {

        if (estudiante.getId().isEmpty() ||
            estudiante.getNombre().isEmpty()) {
            return "Los campos no pueden estar vacíos";
        }

        if (estudiante.getEdad() <= 0) {
            return "La edad debe ser mayor a 0";
        }

        // Validar ID repetido
        if (repo.buscarPorId(estudiante.getId()) != null) {
            return "El ID ya existe, ingrese uno diferente";
        }

        return repo.agregar(estudiante);
    }

    // read
    public ArrayList<Estudiante> listarEstudiantes() {
        return repo.listar();
    }

    // update
    public Estudiante editarEstudiante(String id, Estudiante estudianteEditado) {

        if (id.isEmpty()) return null;

        if (estudianteEditado.getEdad() <= 0) return null;

        return repo.editar(id, estudianteEditado);
    }

    // delete
    // DELETE
    public String eliminarEstudiante(String id) {

        if (id.isEmpty()) {
            return "Debe seleccionar un estudiante";
        }

        if (repo.buscarPorId(id) == null) {
            return "El estudiante no existe";
        }

        return repo.eliminar(id);
    }



    
}
