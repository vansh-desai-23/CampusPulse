import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptCheck {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$ByI6UitJHia6m1.fV8jL9O.L.UIn.ZshAfsB/0.5pT599n9f.i6qG";
        System.out.println(encoder.matches("password123", hash));
    }
}
