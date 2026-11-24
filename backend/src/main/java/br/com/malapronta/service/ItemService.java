package br.com.malapronta.service;

import br.com.malapronta.model.Item;
import br.com.malapronta.model.Usuario;
import br.com.malapronta.repository.ItemRepository;
import br.com.malapronta.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final UsuarioRepository usuarioRepository;

    public ItemService(ItemRepository itemRepository, UsuarioRepository usuarioRepository) {
        this.itemRepository = itemRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Item> listar(Long usuarioId) {
        return itemRepository.findAllByUsuarioIdOrderByIdDesc(usuarioId);
    }

    @Transactional
    public Item cadastrar(Item item, Long usuarioId) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        if (usuario.isPresent()) {
            item.setNome(item.getNome().strip());  // strip() remove espaços em branco no início e no fim do nome do item
            item.setUsuario(usuario.get());
            return itemRepository.save(item);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado.");
        }
    }

    @Transactional
    public Item atualizar(Long id, Item dados, Long usuarioId) {
        Item item = buscarDoUsuario(id, usuarioId);
        item.setNome(dados.getNome().strip()); // strip() remove espaços em branco no início e no fim do nome do item
        item.setSeparado(dados.isSeparado());
        return itemRepository.save(item);
    }

    @Transactional
    public void excluir(Long id, Long usuarioId) {
        itemRepository.delete(buscarDoUsuario(id, usuarioId));
    }

    private Item buscarDoUsuario(Long id, Long usuarioId) {
        Optional<Item> item = itemRepository.findByIdAndUsuarioId(id, usuarioId);
        if (item.isPresent()) {
            return item.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado.");
        }
    }
}
