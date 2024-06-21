package lan.jing.backend.controller

import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.insert
import com.mybatisflex.kotlin.extensions.kproperty.eq
import lan.jing.backend.entry.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController {

    data class LoginRequest(
        val username: String,
        val password: String
    )

    data class LoginResponse(
        val code: String,
        val message: String,
    )

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): LoginResponse {
        val user = filterOne<User> {
            User::username eq request.username
        }
        if (user == null || user.password != request.password) {
            return LoginResponse("401", "用户名或密码错误")
        }
        return LoginResponse("200", "success")
    }

    data class RegisterRequest(
        val username: String,
        val email: String,
        val password: String
    )

    data class RegisterResponse(
        val code: String,
        val message: String,
    )

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): RegisterResponse {
        val user = filterOne<User> {
            User::username eq request.username
        }
        if (user != null) {
            return RegisterResponse("401", "用户名已存在")
        }
        insert(
            User(
                username = request.username,
                email = request.email,
                password = request.password
            )
        )
        return RegisterResponse("200", "注册成功")

    }

}