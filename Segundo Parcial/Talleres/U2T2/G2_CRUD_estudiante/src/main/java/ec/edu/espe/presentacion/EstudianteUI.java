package main.java.ec.edu.espe.presentacion;

import main.java.ec.edu.espe.datos.model.Estudiante;
import main.java.ec.edu.espe.logica_negocio.EstudianteService;
import javax.swing.table.DefaultTableModel;
import java.util.ArrayList;


public class EstudianteUI extends javax.swing.JFrame {
    
    EstudianteService servicio;
    DefaultTableModel modeloTabla;
    
    public EstudianteUI() {
        initComponents();
        servicio = new EstudianteService();
        aplicarEstiloCambridge();
        configurarTabla();
        cargarDatosTabla();

        setPlaceholder(txtId, "Ej: L00123556");
        setPlaceholder(txtNombre, "Ej: Kevin Hernández");
        setPlaceholder(txtEdad, "Ej: 20");

        guardarbtn.setFocusPainted(false);
        actualizarbtn.setFocusPainted(false);
        eliminarbtn.setFocusPainted(false);

        guardarbtn.setFont(new java.awt.Font("Segoe UI", java.awt.Font.BOLD, 12));
        actualizarbtn.setFont(new java.awt.Font("Segoe UI", java.awt.Font.BOLD, 12));
        eliminarbtn.setFont(new java.awt.Font("Segoe UI", java.awt.Font.BOLD, 12));

        guardarbtn.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 150, 0)));
        actualizarbtn.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(180, 150, 0)));
        eliminarbtn.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(150, 0, 0)));


        txtId.setBorder(javax.swing.BorderFactory.createCompoundBorder(
            txtId.getBorder(),
            javax.swing.BorderFactory.createEmptyBorder(5, 5, 5, 5)));

        txtNombre.setBorder(javax.swing.BorderFactory.createCompoundBorder(
            txtNombre.getBorder(),
            javax.swing.BorderFactory.createEmptyBorder(5, 5, 5, 5)));

        txtEdad.setBorder(javax.swing.BorderFactory.createCompoundBorder(
            txtEdad.getBorder(),
            javax.swing.BorderFactory.createEmptyBorder(5, 5, 5, 5)));

    }

    private void aplicarEstiloCambridge() {

        // Fondo principal Cambridge Blue
        this.getContentPane().setBackground(new java.awt.Color(127, 156, 150)); // #7F9C96

        // Panel tipo "card"
        jPanel2.setBackground(new java.awt.Color(249, 249, 249)); 
        jPanel2.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(77, 124, 138))); // #4D7C8A

        // Labels — Azul Yale
        java.awt.Color labelColor = new java.awt.Color(27, 64, 121); // #1B4079
        jLabel1.setForeground(labelColor);
        jLabel2.setForeground(labelColor);
        jLabel3.setForeground(labelColor);
        jLabel4.setForeground(labelColor);

        // TextFields
        estilizarTextFieldCambridge(txtId);
        estilizarTextFieldCambridge(txtNombre);
        estilizarTextFieldCambridge(txtEdad);

        // Botones estilo paleta
        estilizarBotonGuardar(guardarbtn);
        estilizarBotonActualizar(actualizarbtn);
        estilizarBotonEliminar(eliminarbtn);

        // Panel principal
        jPanel1.setBackground(new java.awt.Color(127, 156, 150)); // #7F9C96
    }

    private void estilizarTextFieldCambridge(javax.swing.JTextField txt) {
        txt.setBackground(new java.awt.Color(255, 255, 255));
        txt.setForeground(new java.awt.Color(33, 33, 33));
        txt.setCaretColor(new java.awt.Color(33, 33, 33));

        txt.setBorder(javax.swing.BorderFactory.createCompoundBorder(
            javax.swing.BorderFactory.createLineBorder(new java.awt.Color(77, 124, 138), 2), // #4D7C8A
            javax.swing.BorderFactory.createEmptyBorder(5, 8, 5, 8)
        ));
    }

    private void estilizarBotonGuardar(javax.swing.JButton btn) {
        btn.setBackground(new java.awt.Color(143, 173, 136)); // #8FAD88
        btn.setForeground(new java.awt.Color(27, 64, 121));   // Texto Yale Blue
        btn.setFocusPainted(false);
        btn.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(77, 124, 138)));

        btn.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                btn.setBackground(new java.awt.Color(130, 160, 123));
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                btn.setBackground(new java.awt.Color(143, 173, 136));
            }
        });
    }

    private void estilizarBotonActualizar(javax.swing.JButton btn) {
        btn.setBackground(new java.awt.Color(203, 223, 144)); // #CBDF90
        btn.setForeground(new java.awt.Color(27, 64, 121));  
        btn.setFocusPainted(false);
        btn.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(143, 173, 136)));

        btn.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                btn.setBackground(new java.awt.Color(190, 210, 130));
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                btn.setBackground(new java.awt.Color(203, 223, 144));
            }
        });
    }

    private void estilizarBotonEliminar(javax.swing.JButton btn) {
        btn.setBackground(new java.awt.Color(77, 124, 138)); // #4D7C8A
        btn.setForeground(new java.awt.Color(255, 255, 255));
        btn.setFocusPainted(false);
        btn.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(27, 64, 121)));

        btn.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                btn.setBackground(new java.awt.Color(65, 110, 125));
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                btn.setBackground(new java.awt.Color(77, 124, 138));
            }
        });
    }


    private void setPlaceholder(javax.swing.JTextField field, String placeholder) {
    field.setForeground(new java.awt.Color(150, 150, 150));
    field.setText(placeholder);

    field.addFocusListener(new java.awt.event.FocusAdapter() {
        @Override
        public void focusGained(java.awt.event.FocusEvent evt) {
            if (field.getText().equals(placeholder)) {
                field.setText("");
                field.setForeground(new java.awt.Color(0, 0, 0));
            }
        }

        @Override
        public void focusLost(java.awt.event.FocusEvent evt) {
            if (field.getText().isEmpty()) {
                field.setForeground(new java.awt.Color(150, 150, 150));
                field.setText(placeholder);
            }
        }
    });
}


    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        jTable1 = new javax.swing.JTable();
        jPanel2 = new javax.swing.JPanel();
        txtId = new javax.swing.JTextField();
        txtNombre = new javax.swing.JTextField();
        guardarbtn = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        jLabel3 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        eliminarbtn = new javax.swing.JButton();
        actualizarbtn = new javax.swing.JButton();
        txtEdad = new javax.swing.JTextField();
        jLabel1 = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setName("Frame"); // NOI18N

        jPanel1.setBackground(new java.awt.Color(255, 204, 204));

        jTable1.setBackground(new java.awt.Color(255, 255, 255));
        jTable1.setForeground(new java.awt.Color(0, 0, 0));
        jTable1.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "Title 1", "Title 2", "Title 3", "Title 4"
            }
        ));
        jScrollPane1.setViewportView(jTable1);

        jPanel2.setBackground(new java.awt.Color(255, 255, 204));
        jPanel2.setBorder(javax.swing.BorderFactory.createEtchedBorder());

        txtId.setBackground(new java.awt.Color(255, 255, 255));
        txtId.setForeground(new java.awt.Color(102, 102, 102));
        txtId.setText("Ej: L00123556");
        txtId.setName("idInput"); // NOI18N

        txtNombre.setBackground(new java.awt.Color(255, 255, 255));
        txtNombre.setForeground(new java.awt.Color(102, 102, 102));
        txtNombre.setText("Ej: Kevin Hernández");
        txtNombre.setName("nombreInput"); // NOI18N

        guardarbtn.setBackground(new java.awt.Color(102, 255, 102));
        guardarbtn.setForeground(new java.awt.Color(51, 51, 51));
        guardarbtn.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.RAISED));
        guardarbtn.setLabel("Guardar");
        guardarbtn.setName("guardarbtn"); // NOI18N
        guardarbtn.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                guardarbtnActionPerformed(evt);
            }
        });

        jLabel2.setForeground(new java.awt.Color(51, 51, 51));
        jLabel2.setText("ID del estudiante:");

        jLabel3.setForeground(new java.awt.Color(51, 51, 51));
        jLabel3.setText("Nombre Completo:");

        jLabel4.setForeground(new java.awt.Color(51, 51, 51));
        jLabel4.setText("Edad:");

        eliminarbtn.setBackground(new java.awt.Color(255, 102, 102));
        eliminarbtn.setForeground(new java.awt.Color(51, 51, 51));
        eliminarbtn.setText("Eliminar");
        eliminarbtn.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.RAISED));
        eliminarbtn.setName("eliminarbtn"); // NOI18N
        eliminarbtn.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                eliminarbtnActionPerformed(evt);
            }
        });

        actualizarbtn.setBackground(new java.awt.Color(255, 255, 102));
        actualizarbtn.setForeground(new java.awt.Color(51, 51, 51));
        actualizarbtn.setText("Actualizar");
        actualizarbtn.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.RAISED));
        actualizarbtn.setName("actualizarbtn"); // NOI18N
        actualizarbtn.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                actualizarbtnActionPerformed(evt);
            }
        });

        txtEdad.setBackground(new java.awt.Color(255, 255, 255));
        txtEdad.setForeground(new java.awt.Color(102, 102, 102));
        txtEdad.setText("Ej: 20");
        txtEdad.setName("nombreInput"); // NOI18N

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(55, 55, 55)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel2)
                            .addComponent(txtId, javax.swing.GroupLayout.PREFERRED_SIZE, 132, javax.swing.GroupLayout.PREFERRED_SIZE)))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(109, 109, 109)
                        .addComponent(guardarbtn, javax.swing.GroupLayout.PREFERRED_SIZE, 104, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addGap(29, 29, 29)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(67, 67, 67)
                        .addComponent(actualizarbtn, javax.swing.GroupLayout.PREFERRED_SIZE, 104, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 82, Short.MAX_VALUE)
                        .addComponent(eliminarbtn, javax.swing.GroupLayout.PREFERRED_SIZE, 104, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(149, 149, 149))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel3)
                            .addComponent(txtNombre, javax.swing.GroupLayout.PREFERRED_SIZE, 208, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                                .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 64, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(149, 149, 149))
                            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel2Layout.createSequentialGroup()
                                .addComponent(txtEdad, javax.swing.GroupLayout.PREFERRED_SIZE, 136, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addGap(78, 78, 78))))))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(27, 27, 27)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel2)
                    .addComponent(jLabel3)
                    .addComponent(jLabel4))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(txtId, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(txtNombre, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(txtEdad, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 32, Short.MAX_VALUE)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(guardarbtn, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(eliminarbtn, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(actualizarbtn, javax.swing.GroupLayout.PREFERRED_SIZE, 35, javax.swing.GroupLayout.PREFERRED_SIZE))
                .addGap(18, 18, 18))
        );

        jLabel1.setBackground(new java.awt.Color(0, 0, 0));
        jLabel1.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(0, 0, 0));
        jLabel1.setText("Registro de Estudiantes");

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addContainerGap(33, Short.MAX_VALUE)
                .addGroup(jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                    .addComponent(jScrollPane1)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addGap(27, 27, 27))
            .addGroup(jPanel1Layout.createSequentialGroup()
                .addGap(308, 308, 308)
                .addComponent(jLabel1)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, jPanel1Layout.createSequentialGroup()
                .addGap(21, 21, 21)
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(18, 18, 18)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 386, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(20, 20, 20))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jPanel1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    // Para el botón guardar
    private void guardarbtnActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_guardarbtnActionPerformed
        try {
            String id = txtId.getText().trim();
            String nombre = txtNombre.getText().trim();
            int edad = Integer.parseInt(txtEdad.getText().trim());

            Estudiante nuevoEstudiante = new Estudiante(id, nombre, edad);
            String resultado = servicio.crearEstudiante(nuevoEstudiante);

            javax.swing.JOptionPane.showMessageDialog(this, resultado);
            
            if(resultado.contains("éxito") || resultado.contains("exitosamente")) {
                limpiarCampos();
                cargarDatosTabla();
            }

        } catch (NumberFormatException e) {
            javax.swing.JOptionPane.showMessageDialog(this, "Por favor ingrese un número válido en Edad.");
        }
    }//GEN-LAST:event_guardarbtnActionPerformed
    
    private void actualizarbtnActionPerformed(java.awt.event.ActionEvent evt) {
        try {
            String id = txtId.getText().trim();
            String nombre = txtNombre.getText().trim();
            int edad = Integer.parseInt(txtEdad.getText().trim());
            
            if (id.isEmpty()) {
                javax.swing.JOptionPane.showMessageDialog(this, "Seleccione un estudiante de la tabla para actualizar.");
                return;
            }

            Estudiante estudianteActualizado = new Estudiante(id, nombre, edad);
            Estudiante resultado = servicio.editarEstudiante(id, estudianteActualizado);

            if (resultado != null) {
                javax.swing.JOptionPane.showMessageDialog(this, "Estudiante actualizado exitosamente.");
                limpiarCampos();
                cargarDatosTabla();
            } else {
                javax.swing.JOptionPane.showMessageDialog(this, "Error al actualizar el estudiante.");
            }

        } catch (NumberFormatException e) {
            javax.swing.JOptionPane.showMessageDialog(this, "Por favor ingrese un número válido en Edad.");
        }
    }
    
    private void eliminarbtnActionPerformed(java.awt.event.ActionEvent evt) {
        String id = txtId.getText().trim();
        
        if (id.isEmpty()) {
            javax.swing.JOptionPane.showMessageDialog(this, "Seleccione un estudiante de la tabla para eliminar.");
            return;
        }
        
        int confirmacion = javax.swing.JOptionPane.showConfirmDialog(this, 
            "¿Está seguro de eliminar al estudiante con ID " + id + "?", 
            "Confirmar eliminación", 
            javax.swing.JOptionPane.YES_NO_OPTION);
        
        if (confirmacion == javax.swing.JOptionPane.YES_OPTION) {
            String resultado = servicio.eliminarEstudiante(id);
            javax.swing.JOptionPane.showMessageDialog(this, resultado);
            
            if (resultado.contains("éxito") || resultado.contains("exitosamente") || resultado.contains("eliminado")) {
                limpiarCampos();
                cargarDatosTabla();
            }
        }
    }
    
    private void configurarTabla() {
        modeloTabla = new DefaultTableModel(
            new Object[][] {},
            new String[] {"ID", "Nombre", "Edad"}
        ) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        // Header Mindaro
        jTable1.getTableHeader().setOpaque(true);
        jTable1.getTableHeader().setBackground(new java.awt.Color(203, 223, 144)); // #CBDF90
        jTable1.getTableHeader().setForeground(new java.awt.Color(27, 64, 121));    // #1B4079
        jTable1.getTableHeader().setFont(new java.awt.Font("Segoe UI", java.awt.Font.BOLD, 13));

        // Fondo fila tipo Cambridge
        jTable1.setBackground(new java.awt.Color(242, 244, 243)); // #F2F4F3
        jTable1.setForeground(new java.awt.Color(27, 64, 121));
        jTable1.setGridColor(new java.awt.Color(200, 200, 200));

        jTable1.setSelectionBackground(new java.awt.Color(143, 173, 136)); // Cambridge green
        jTable1.setSelectionForeground(new java.awt.Color(255, 255, 255));
        jTable1.setRowHeight(26);


        // CABECERA
        jTable1.getTableHeader().setOpaque(false);
        jTable1.getTableHeader().setBackground(new java.awt.Color(255, 204, 204)); 
        jTable1.getTableHeader().setForeground(new java.awt.Color(50, 50, 50));
        jTable1.getTableHeader().setFont(new java.awt.Font("Segoe UI", java.awt.Font.BOLD, 14));

        // CUERPO DE LA TABLA
        jTable1.setRowHeight(28);
        jTable1.setBackground(new java.awt.Color(240, 240, 240));
        jTable1.setGridColor(new java.awt.Color(200, 200, 200));
        jTable1.setSelectionBackground(new java.awt.Color(255, 153, 153));
        jTable1.setSelectionForeground(new java.awt.Color(0, 0, 0));

        // Ancho automático
        jTable1.setAutoResizeMode(javax.swing.JTable.AUTO_RESIZE_ALL_COLUMNS);

        
        jTable1.setModel(modeloTabla);
        
        jTable1.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                int filaSeleccionada = jTable1.getSelectedRow();
                if (filaSeleccionada != -1) {
                    txtId.setText(modeloTabla.getValueAt(filaSeleccionada, 0).toString());
                    txtNombre.setText(modeloTabla.getValueAt(filaSeleccionada, 1).toString());
                    txtEdad.setText(modeloTabla.getValueAt(filaSeleccionada, 2).toString());
                }
            }
        });
    }
    
    private void cargarDatosTabla() {
        modeloTabla.setRowCount(0);
        ArrayList<Estudiante> estudiantes = servicio.listarEstudiantes();
        
        for (Estudiante est : estudiantes) {
            modeloTabla.addRow(new Object[]{
                est.getId(),
                est.getNombre(),
                est.getEdad()
            });
        }
    }
    
    private void limpiarCampos() {
        txtId.setText("");
        txtNombre.setText("");
        txtEdad.setText("");
        jTable1.clearSelection();
    }


    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new EstudianteUI().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton actualizarbtn;
    private javax.swing.JButton eliminarbtn;
    private javax.swing.JButton guardarbtn;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JPanel jPanel1;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JTable jTable1;
    private javax.swing.JTextField txtEdad;
    private javax.swing.JTextField txtId;
    private javax.swing.JTextField txtNombre;
    // End of variables declaration//GEN-END:variables
}
