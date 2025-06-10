package com.example.estudo.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.estudo.demo.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Aqui você pode adicionar métodos personalizados, se necessário
    // Exemplo: List<Usuario> findByNome(String nome);
    List<Usuario> findByNome(String nome);
    // No entanto, JpaRepository já fornece métodos básicos como save, findById, deleteById, etc.

}

