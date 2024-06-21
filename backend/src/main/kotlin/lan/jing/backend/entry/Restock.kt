package lan.jing.backend.entry

import com.mybatisflex.annotation.Id
import com.mybatisflex.annotation.KeyType
import com.mybatisflex.annotation.Table
import java.time.LocalDateTime

@Table("restock")
data class Restock(
    @Id(keyType = KeyType.Auto)
    var id: Int?=null,
    var name: String?=null,
    var dosage: String?=null,
    var usage: String?=null,
    var stock: Int?=null,
    var factory: String?=null,
    var purchasePrice: Int?=null,
    var sellingPrice: Int?=null,
    var purchaseDate: LocalDateTime?=null
)
