package com.example.estudo.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.estudo.demo.model.Tarefa;
import com.example.estudo.demo.repository.TarefaRepository;

@Service
public class TarefaService {

    @Autowired
    private final TarefaRepository tarefaRepository;

    public Tarefa salvar(Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }

    public List<Tarefa> buscarTodas() {
        return tarefaRepository.findAll();
    }

    public void deletar(Long id) {
        tarefaRepository.deleteById(id);
    }

    public Tarefa buscarPorId(Long id) {
        return tarefaRepository.findById(id).orElse(null);
    }

    public Tarefa editar(Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }

    public TarefaService(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    // Método para buscar tarefas por prioridade
    public List<Tarefa> buscarTarefasPorPrioridade(String prioridade) {
        return tarefaRepository.findByPrioridade(prioridade);
    }

    // Método para buscar tarefas por ID e ID do usuário
    public List<Tarefa> buscarTarefaPorIdEUsuario(Long id, Long usuarioId) {
        return tarefaRepository.findByIdAndUsuarioId(id, usuarioId);
    }
}