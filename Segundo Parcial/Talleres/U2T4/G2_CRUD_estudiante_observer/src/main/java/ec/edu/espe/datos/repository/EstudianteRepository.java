package main.java.ec.edu.espe.datos.repository;

import main.java.ec.edu.espe.datos.model.Estudiante;
import java.util.ArrayList;

public class EstudianteRepository {

    // Variable estática que almacenará la única instancia de la clase
    // Al ser static, pertenece a la clase y no a un objeto específico
    private static EstudianteRepository instance;
       
    // Lista donde se almacenarán todos los estudiantes en memoria
    private ArrayList<Estudiante> listaEstudiantes = new ArrayList<>();
    
    /*
        Lista donde se almacenarán todos los observadores *Patrón de diseño comportamental: Observer*
    */
    private ArrayList<RepositoryObserver> observers = new ArrayList<>();
    
    // Constructor PRIVADO para evitar que se creen objetos desde fuera
    // Con esto obligamos a que solo se use getInstance()
    private EstudianteRepository() {
        // Inicializamos la lista
        listaEstudiantes = new ArrayList<>();
    }
    
    // Método público y estático que permite obtener la ÚNICA instancia de la clase
    public static EstudianteRepository getInstance() {
        // Si aún no existe ninguna instancia...
        if (instance == null) {
            // Se crea la única instancia
            instance = new EstudianteRepository();
        }
        // Se devuelve la misma instancia siempre
        return instance;
    }
    
    /*
        Método para agregar un observador a la lista de observadores
    */
    public void addObserver(RepositoryObserver observer) {
        observers.add(observer);
    }
    
    /*
        Método para eliminar un observador a la lista de observadores
    */
    public void removeObserver(RepositoryObserver observer) {
        observers.remove(observer);
    }
    
    /*
        Método para notificar a todos los observadores de un cambio
    */
    private void notificarSuscriptores() {
        for (RepositoryObserver observer : observers) {
            observer.onDataChanged();
        }
    }

    public String agregar(Estudiante estudiante) {
        try {
            listaEstudiantes.add(estudiante);
            notificarSuscriptores();
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
                notificarSuscriptores();
                return estudianteEditado;
            }
        }
        return null;
    }

    public String eliminar(String id) {
        try {
            listaEstudiantes.removeIf(estudiante -> estudiante.getId().equals(id));
            notificarSuscriptores();
        } catch (Exception e) {
            return "Hubo un error al eliminar un estudiante: " + e.toString();
        }
        return "El estudiante se eliminó con éxito";
    }

}
