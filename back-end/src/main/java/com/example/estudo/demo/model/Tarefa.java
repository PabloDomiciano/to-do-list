package com.example.estudo.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "tarefas")
@Getter
@Setter
public class Tarefa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descricao;
    private boolean concluida;
    private Long usuarioId;

    private LocalDate dataCriacao;
    private LocalDate dataConclusao;
    private String prioridade;
}
