package lan.jing.backend

import com.mybatisflex.kotlin.extensions.db.all
import lan.jing.backend.entry.Restock
import lan.jing.backend.mapper.SaleMapper
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class BackendApplicationTests {

    @Test
    fun contextLoads() {
        val restocks = all<Restock>()
        println(restocks)
    }

    @Autowired
    lateinit var saleMapper: SaleMapper

    @Test
    fun testListSalesWithRelation() {
        val sales = saleMapper.selectAllWithRelations()
        println(sales)
    }
}
