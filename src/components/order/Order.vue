<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable></el-input>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" align="center">
                </el-table-column>
                <el-table-column prop="order_number" label="订单编号" width="280" align="center">
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="120" align="center">
                </el-table-column>
                <el-table-column prop="pay_status" label="是否付款" width="120" align="center">
                    <template v-slot="{ row }">
                        <el-tag :type="['danger', 'success'][row.pay_status]">
                            {{ ['未付款', '已付款'][row.pay_status] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="120" align="center">
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="165" align="center">
                </el-table-column>
                <el-table-column label="操作" width="145" align="center">
                    <template v-slot="{ row }">
                        <!-- 编辑 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit">
                        </el-button>
                        <!-- 查看物流 -->
                        <el-tooltip content="物流状态" placement="top" :enterable="false" size="small">
                            <el-button type="success" icon="el-icon-location" size="mini"
                                @click="checkLogistics(row.order_id)">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[8, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 编辑 -->
        <el-dialog title="修改地址" :visible.sync="editFormVisible" @close="resetEditForm">
            <el-form :model="addressForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address">
                    <el-cascader :options="cityData" v-model="addressForm.address" :props="{ expandTrigger: 'hover' }">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="location">
                    <el-input autocomplete="off" v-model="addressForm.location"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 物流 -->
        <el-dialog title="物流状态" :visible.sync="logisticsVisible">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in logisticsList" :key="index" :timestamp="activity.time">
                    {{ activity.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
export default {
    name: "Order",
    created() {
        this.getOrderList()
    },
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 8
            },
            addressForm: {
                address: [],
                location: ''
            },
            total: 0,
            orderList: [],
            editFormVisible: false,
            logisticsVisible: false,
            editFormRules: {
                address: [
                    { required: true, message: '请选择省市区/县', trigger: 'blur' },
                ],
                location: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ]
            },
            logisticsList: [{
                "time": "2018-05-10 09:39:00",
                "ftime": "2018-05-10 09:39:00",
                "context": "已签收,感谢使用顺丰,期待再次为您服务",
                "location": ""
            },
            {
                "time": "2018-05-10 08:23:00",
                "ftime": "2018-05-10 08:23:00",
                "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                "location": ""
            },
            {
                "time": "2018-05-10 07:32:00",
                "ftime": "2018-05-10 07:32:00",
                "context": "快件到达 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-10 02:03:00",
                "ftime": "2018-05-10 02:03:00",
                "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-09 23:05:00",
                "ftime": "2018-05-09 23:05:00",
                "context": "快件到达 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 21:21:00",
                "ftime": "2018-05-09 21:21:00",
                "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 13:07:00",
                "ftime": "2018-05-09 13:07:00",
                "context": "顺丰速运 已收取快件",
                "location": ""
            },
            {
                "time": "2018-05-09 12:25:03",
                "ftime": "2018-05-09 12:25:03",
                "context": "卖家发货",
                "location": ""
            },
            {
                "time": "2018-05-09 12:22:24",
                "ftime": "2018-05-09 12:22:24",
                "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                "location": ""
            },
            {
                "time": "2018-05-08 21:36:04",
                "ftime": "2018-05-08 21:36:04",
                "context": "商品已经下单",
                "location": ""
            }],
            cityData
        }
    },
    watch: {
        'queryInfo.query': {
            handler() {
                this.getOrderList(this.queryInfo.query)
            },
            deep: true
        }
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.$error('获取订单列表失败')
            this.orderList = res.data.goods
            this.orderList.forEach(item => {
                item.create_time = this.dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
            })
            this.total = res.data.total
        },
        // 监听pagesize改变的事件
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize = newPageSize
            this.getOrderList()
        },

        // 监听页码改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },

        // 展示编辑框
        showEdit() {
            this.editFormVisible = true
        },

        // 重置编辑商品表单
        resetEditForm() {
            this.$refs.editFormRef.resetFields()
        },

        // 查看物流
        checkLogistics() {
            this.logisticsVisible = true
        }
    },
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>