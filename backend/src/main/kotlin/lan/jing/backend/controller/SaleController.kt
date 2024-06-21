package lan.jing.backend.controller

import com.mybatisflex.kotlin.extensions.db.filterOne
import com.mybatisflex.kotlin.extensions.db.insert
import com.mybatisflex.kotlin.extensions.kproperty.eq
import lan.jing.backend.entry.Restock
import lan.jing.backend.mapper.RestockMapper
import lan.jing.backend.mapper.SaleMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/sale")
class SaleController {

    @Autowired
    lateinit var saleMapper: SaleMapper

    @Autowired
    lateinit var restockMapper: RestockMapper

    data class AddRequest(
        var rid: Int,
        var saleVolume: Int,
        var saleDate: String
    )


    data class AddResponse(
        var code: String,
        var message: String
    )

    @PostMapping("/add")
    fun add(@RequestBody addRequest: AddRequest): AddResponse {
        val localDate = LocalDate.parse(addRequest.saleDate, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
        val localDateTime = localDate.atStartOfDay()
        val restock = filterOne<Restock> {
            Restock::id eq addRequest.rid
        }
        if (restock?.stock!! < addRequest.saleVolume) {
            return AddResponse("401", "库存不足")
        }
        restockMapper.update(
            Restock(
                id = addRequest.rid,
                stock = restock.stock!! - addRequest.saleVolume
            )
        )
        insert(
            lan.jing.backend.entry.Sale(
                rid = addRequest.rid,
                saleVolume = addRequest.saleVolume,
                saleDate = localDateTime
            )
        )
        return AddResponse("200", "出货成功")
    }

    data class ListResponse(
        var code: String,
        var message: String,
        var sales: List<lan.jing.backend.entry.Sale>
    )

    @GetMapping("/list")
    fun list(): ListResponse {
        val sales = saleMapper.selectAllWithRelations()
        return ListResponse("200", "success", sales)
    }

    data class UpdateRequest(
        var rid: Int,
        var saleDate: String
    )


    data class UpdateResponse(
        var code: String,
        var message: String
    )

    @PostMapping("/update")
    fun update(@RequestBody updateRequest: UpdateRequest): UpdateResponse {
        val localDate = LocalDate.parse(updateRequest.saleDate, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
        val localDateTime = localDate.atStartOfDay()
        insert(
            lan.jing.backend.entry.Sale(
                rid = updateRequest.rid,
                saleDate = localDateTime
            )
        )
        return UpdateResponse("200", "更新成功")
    }

}