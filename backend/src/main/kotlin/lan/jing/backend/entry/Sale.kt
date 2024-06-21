package lan.jing.backend.entry

import com.mybatisflex.annotation.Id
import com.mybatisflex.annotation.KeyType
import com.mybatisflex.annotation.RelationOneToOne
import com.mybatisflex.annotation.Table
import java.time.LocalDateTime

@Table("sale")
data class Sale(
    @Id(keyType = KeyType.Auto)
    var id: Int?=null,
    var rid: Int?=null,
    var saleDate: LocalDateTime?=null,
    var saleVolume: Int?=null,
    @RelationOneToOne(selfField = "rid", targetField = "id", targetTable = "restock")
    var restock: Restock?=null
)
