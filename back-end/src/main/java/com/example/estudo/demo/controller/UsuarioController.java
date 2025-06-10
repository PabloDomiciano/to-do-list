package com.example.estudo.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.estudo.demo.model.Usuario;
import com.example.estudo.demo.service.UsuarioService;

@RestController
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Métodos para manipulação de usuários podem ser adicionados aqui
    // Exemplo: salvar, buscar, editar, deletar usuários
    @PostMapping("/usuarios/salvar")
    public ResponseEntity<Usuario> salvar(@RequestBody Usuario usuario) {
        return usuarioService.salvar(usuario);
    }

    // Outros métodos podem ser adicionados conforme necessário

    // Exemplo: buscarPorId, deletar, editar, buscarPorNome
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @DeleteMapping("/usuarios/delete/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return usuarioService.deletar(id);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> editar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return usuarioService.editar(id, usuario);
    }

    @GetMapping("/usuarios/nome/{nome}")
    public List<Usuario> buscarPorNome(@PathVariable String nome) {
        return usuarioService.buscarPorNome(nome);
    }

    @GetMapping("/usuarios")
    public List<Usuario> buscarTodos() {
        return usuarioService.buscarTodos();
    }

}