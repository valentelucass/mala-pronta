package br.com.malapronta.repository;

import br.com.malapronta.model.Item;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findAllByUsuarioIdOrderByIdDesc(Long usuarioId);

    Optional<Item> findByIdAndUsuarioId(Long id, Long usuarioId);
}
