package br.com.malapronta.service;

import br.com.malapronta.config.SegurancaConfig;
import br.com.malapronta.model.Usuario;
import br.com.malapronta.repository.UsuarioRepository;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LoginService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public LoginService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
    }

    public String entrar(String email, String senha) {
        if (email == null || email.isBlank() || senha == null || senha.isEmpty()) {  // isBlank() verifica se a string é nula, vazia ou contém apenas espaços em branco
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe e-mail e senha.");
        }

        Optional<Usuario> usuario = usuarioRepository.findByEmail(email.strip()); // strip() remove espaços em branco no início e no fim do e-mail
        boolean senhaDentroDoLimite = senha.getBytes(StandardCharsets.UTF_8).length <= 72;  // Verifica se a senha não ultrapassa 72 bytes, que é o limite do BCrypt
        if (usuario.isPresent() && senhaDentroDoLimite && passwordEncoder.matches(senha, usuario.get().getSenha())) { // matches() compara a senha fornecida com a senha armazenada no banco de dados, que está criptografada
            return gerarToken(usuario.get());
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos.");
        }
    }

    private String gerarToken(Usuario usuario) {
        // O subject identifica o dono dos itens nas próximas requisições.
        Instant agora = Instant.now(); // Instant representa um ponto específico no tempo, com precisão de nanossegundos, e é usado aqui para definir o momento atual.
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(SegurancaConfig.EMISSOR)
                .subject(usuario.getId().toString())
                .issuedAt(agora)
                .expiresAt(agora.plus(2, ChronoUnit.HOURS))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
