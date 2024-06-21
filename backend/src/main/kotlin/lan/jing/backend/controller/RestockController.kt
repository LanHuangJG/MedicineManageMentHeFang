package lan.jing.backend.controller

import com.mybatisflex.kotlin.extensions.db.all
import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.insert
import com.mybatisflex.kotlin.extensions.kproperty.eq
import lan.jing.backend.entry.Restock
import lan.jing.backend.mapper.RestockMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/restock")
class RestockController {
    data class AddRequest(
        var name: String,
        var dosage: String,
        var usage: String,
        var stock: Int,
        var factory: String,
        var purchasePrice: Int,
        var sellingPrice: Int,
        var purchaseDate: String
    )

    data class AddResponse(
        var code: String,
        var message: String
    )

    @PostMapping("/add")
    fun add(@RequestBody request: AddRequest): AddResponse {
        val restock = filterOne<Restock> {
            Restock::name eq request.name
        }
        if (restock != null) {
            return AddResponse("401", "药品已存在")
        }
        val localDate = LocalDate.parse(request.purchaseDate, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
        val localDateTime = localDate.atStartOfDay()
        insert(
            Restock(
                name = request.name,
                dosage = request.dosage,
                usage = request.usage,
                stock = request.stock,
                factory = request.factory,
                purchasePrice = request.purchasePrice,
                sellingPrice = request.sellingPrice,
                purchaseDate = localDateTime
            )
        )
        return AddResponse("200", "进货成功")
    }

    data class ListResponse(
        var code: String,
        var message: String,
        var restocks: List<Restock>
    )

    @GetMapping("/list")
    fun list(): ListResponse {
        val restocks = all<Restock>()
        return ListResponse("200", "success", restocks)
    }

    data class UpdateRequest(
        var id: Int,
        var name: String,
        var dosage: String,
        var usage: String,
        var stock: Int,
        var factory: String,
        var purchasePrice: Int,
        var sellingPrice: Int,
        var purchaseDate: String
    )

    @Autowired
    lateinit var restockMapper: RestockMapper

    @PostMapping("/update")
    fun update(@RequestBody request: UpdateRequest): AddResponse {
        val restock = filterOne<Restock> {
            Restock::id eq request.id
        }
        if (restock == null) {
            return AddResponse("401", "药品不存在")
        }
        val localDate = LocalDate.parse(request.purchaseDate, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
        val localDateTime = localDate.atStartOfDay()
        restockMapper.update(
            Restock(
                id = request.id,
                name = request.name,
                dosage = request.dosage,
                usage = request.usage,
                stock = request.stock,
                factory = request.factory,
                purchasePrice = request.purchasePrice,
                sellingPrice = request.sellingPrice,
                purchaseDate = localDateTime
            )
        )
        return AddResponse("200", "更新成功")
    }
}