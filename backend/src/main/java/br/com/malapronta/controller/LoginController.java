package br.com.malapronta.controller;

import br.com.malapronta.dto.LoginResposta;
import br.com.malapronta.model.Usuario;
import br.com.malapronta.service.LoginService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/api/login")
    public LoginResposta entrar(@RequestBody Usuario credenciais) {
        String token = loginService.entrar(credenciais.getEmail(), credenciais.getSenha());
        return new LoginResposta(token);
    }
}
