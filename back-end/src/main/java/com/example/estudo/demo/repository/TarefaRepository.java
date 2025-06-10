package com.example.estudo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.estudo.demo.model.Tarefa;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    // Aqui você pode adicionar métodos personalizados, se necessário
    // Filtro por prioridade
    List<Tarefa> findByPrioridade(String prioridade);

    // List<Tarefa> findByUsuarioId(Long usuarioId);
    List<Tarefa> findByIdAndUsuarioId(Long id, Long usuarioId);
}
