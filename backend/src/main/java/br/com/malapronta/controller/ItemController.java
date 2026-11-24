package br.com.malapronta.controller;

import br.com.malapronta.model.Item;
import br.com.malapronta.service.ItemService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/itens")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<Item> listar(@AuthenticationPrincipal Jwt jwt) {
        return itemService.listar(Long.valueOf(jwt.getSubject()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Item cadastrar(@Valid @RequestBody Item item, @AuthenticationPrincipal Jwt jwt) {
        return itemService.cadastrar(item, Long.valueOf(jwt.getSubject()));
    }

    @PutMapping("/{id}")
    public Item atualizar(@PathVariable Long id, @Valid @RequestBody Item dados, @AuthenticationPrincipal Jwt jwt) {
        return itemService.atualizar(id, dados, Long.valueOf(jwt.getSubject()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        itemService.excluir(id, Long.valueOf(jwt.getSubject()));
    }
}
