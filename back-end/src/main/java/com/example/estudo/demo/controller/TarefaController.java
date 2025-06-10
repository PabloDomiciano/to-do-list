package com.example.estudo.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.estudo.demo.model.Tarefa;

import com.example.estudo.demo.service.TarefaService;

@RestController
@RequestMapping("/tarefas")
@CrossOrigin(origins = "*") 
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @PostMapping("/salvar")
    public ResponseEntity<Tarefa> salvar(@RequestBody Tarefa tarefa) {
        Tarefa savedTarefa = tarefaService.salvar(tarefa);
        return ResponseEntity.ok(savedTarefa);
    }

    @GetMapping("/buscarTodos")
    public ResponseEntity<List<Tarefa>> buscarTodas() {
        List<Tarefa> tarefas = tarefaService.buscarTodas();
        return ResponseEntity.ok(tarefas);
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tarefaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscarPorId/{id}")
    public ResponseEntity<Tarefa> buscarPorId(@PathVariable Long id) {
        Tarefa tarefa = tarefaService.buscarPorId(id);
        return tarefa != null ? ResponseEntity.ok(tarefa) : ResponseEntity.notFound().build();
    }

    @PutMapping("/editar")
    public ResponseEntity<Tarefa> editar(@RequestBody Tarefa tarefa) {
        Tarefa updatedTarefa = tarefaService.editar(tarefa);
        return ResponseEntity.ok(updatedTarefa);
    }
}
