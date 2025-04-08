package com.foodychat.user.service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public String googleLogin(String token) {
        GoogleUserInfo userInfo = GoogleTokenVerifier.verify(token);
        User user = userRepository.findByEmail(userInfo.getEmail())
                     .orElseGet(() -> userRepository.save(new User(userInfo)));
        return jwtProvider.createToken(user.getEmail());
    }

    public void signup(UserDto userDto) {
        userRepository.save(new User(userDto));
    }

    public String login(UserDto userDto) {
        User user = userRepository.findByEmail(userDto.getEmail())
                     .orElseThrow(() -> new RuntimeException("회원 정보 없음"));
        return jwtProvider.createToken(user.getEmail());
    }
}
