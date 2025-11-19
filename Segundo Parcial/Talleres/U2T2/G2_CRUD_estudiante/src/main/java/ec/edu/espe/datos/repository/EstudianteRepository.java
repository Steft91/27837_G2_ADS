package main.java.ec.edu.espe.datos.repository;

import main.java.ec.edu.espe.datos.model.Estudiante;
import java.util.ArrayList;

public class EstudianteRepository {

    ArrayList<Estudiante> listaEstudiantes = new ArrayList<Estudiante>();

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

    public Estudiante buscarPorId(int id) {
        Estudiante estudianteEncontrado = null;
        for (Estudiante estudiante : listaEstudiantes) {
            if (estudiante.getId() == id) {
                estudianteEncontrado = estudiante;
                break;
            }
        }
        return estudianteEncontrado;
    }

    public Estudiante editar(int id, Estudiante estudianteEditado) {
        for (int i = 0; i < listaEstudiantes.size(); i++) {
            if (listaEstudiantes.get(i).getId() == id) {
                listaEstudiantes.set(i, estudianteEditado);
                return estudianteEditado;
            }
        }
        return null;
    }

    public String eliminar(int id) {
        try {
            listaEstudiantes.removeIf(estudiante -> estudiante.getId() == id);
        } catch (Exception e) {
            return "Hubo un error al eliminar un estudiante: " + e.toString();
        }
        return "El estudiante se eliminó con éxito";
    }

}
