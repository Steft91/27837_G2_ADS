package main.java.ec.edu.espe.datos.repository;

import main.java.ec.edu.espe.datos.model.Estudiante;
import java.util.ArrayList;

public class EstudianteRepository {

    private ArrayList<Estudiante> listaEstudiantes = new ArrayList<>();

    public EstudianteRepository() {
    }

    public String agregar(Estudiante estudiante) {
        try {
            listaEstudiantes.add(estudiante);
        } catch (Exception e) {
            return "Hubo un error al insertar un estudiante: " + e.toString();
        }
        return "El estudiante se agregó con éxito";
    }

    public ArrayList<Estudiante> listar() {
        return listaEstudiantes;
    }

    public Estudiante buscarPorId(String id) {
        for (Estudiante estudiante : listaEstudiantes) {
            if (estudiante.getId().equals(id)) {
                return estudiante;
            }
        }
        return null;
    }

    public Estudiante editar(String id, Estudiante estudianteEditado) {
        for (int i = 0; i < listaEstudiantes.size(); i++) {
            if (listaEstudiantes.get(i).getId().equals(id)) {
                listaEstudiantes.set(i, estudianteEditado);
                return estudianteEditado;
            }
        }
        return null;
    }

    public String eliminar(String id) {
        try {
            listaEstudiantes.removeIf(estudiante -> estudiante.getId().equals(id));
        } catch (Exception e) {
            return "Hubo un error al eliminar un estudiante: " + e.toString();
        }
        return "El estudiante se eliminó con éxito";
    }

}
