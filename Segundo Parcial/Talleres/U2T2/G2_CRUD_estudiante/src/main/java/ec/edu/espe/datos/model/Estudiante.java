package main.java.ec.edu.espe.datos.model;

public class Estudiante {
    private int Id;
    private String nombre;
    private int edad;
    
    public Estudiante(int Id, String nombre, int edad) {
        this.Id = Id;
        this.nombre = nombre;
        this.edad = edad;
    } 

    public int getId() {
        return Id;
    }

    public void setId(int Id) {
        this.Id = Id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }
          
}
