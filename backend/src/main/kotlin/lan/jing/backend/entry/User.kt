package lan.jing.backend.entry

import com.mybatisflex.annotation.Id
import com.mybatisflex.annotation.KeyType
import com.mybatisflex.annotation.Table

@Table("user")
data class User(
    @Id(keyType = KeyType.Auto)
    val id: Int?=null,
    val username: String?,
    val email: String?,
    val password: String?
)
