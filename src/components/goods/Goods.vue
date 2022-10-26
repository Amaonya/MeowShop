<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column prop="goods_name" label="商品名称" width="570">
                </el-table-column>
                <el-table-column prop="goods_price" label="商品价格" width="90">
                </el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="90">
                </el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="145">
                </el-table-column>
                <el-table-column label="操作" width="115">
                    <template v-slot="{ row }">
                        <!-- 编辑 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditGoods(row.goods_id)">
                        </el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(row.goods_id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 编辑商品表单 -->
        <el-dialog title="编辑商品" :visible.sync="editGoodsFormVisible" @close="resetEditForm">
            <el-form :model="editGoodsForm" :rules="editGoodsFormRules" ref="editGoodsFormRef">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input autocomplete="off" v-model="editGoodsForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input autocomplete="off" v-model="editGoodsForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input autocomplete="off" v-model="editGoodsForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input autocomplete="off" v-model="editGoodsForm.goods_weight"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editGoodsFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editGoods">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: "Goods",
    created() {
        this.getGoodsList()
    },
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            editGoodsForm: {},
            editGoodsFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
            },
            editGoodsFormVisible: false,
            goodsList: [],
            total: 0

        }
    },
    watch: {
        'queryInfo.query': {
            handler() {
                this.getGoodsList(this.queryInfo.query)
            },
            deep: true
        }
    },
    methods: {
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.$error('获取商品列表失败')
            this.goodsList = res.data.goods
            this.goodsList.forEach(item => {
                item.add_time = this.dayjs(item.add_time).format('YYYY-MM-DD HH:mm:ss')
            })
            this.total = res.data.total
        },

        // 监听pagesize改变的事件
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize = newPageSize
            this.getGoodsList()
        },

        // 监听页码改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },

        // 删除商品
        delGoods(id) {
            this.$confirm(`此操作将永久删除该商品, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`goods/${id}`)
                if (res.meta.status !== 200) return this.$message.error('删除失败')
                this.getGoodsList()
                this.$message.success('删除成功！')
            }).catch(() => {
                this.$message.info('已取消删除')
            });

        },

        // 路由跳转到添加商品页
        goAddPage() {
            this.$router.push('/goods/add')
        },

        // 拿到id，发请求拿到商品信息后展示对话框
        async showEditGoods(id) {
            const { data: res } = await this.$http.get(`goods/${id}/`)
            if (res.meta.status !== 200) {
                return this.$message.error('发生错误')
            }
            this.editGoodsForm = res.data
            this.editGoodsFormVisible = true;
        },

        // 确认表单，提交编辑商品信息
        editGoods() {
            this.$refs.editGoodsFormRef.validate(
                async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.put(`goods/${this.editGoodsForm.goods_id}/`,
                        {
                            goods_name: this.editGoodsForm.goods_name, goods_price: this.editGoodsForm.goods_price,
                            goods_number: this.editGoodsForm.goods_number, goods_weight: this.editGoodsForm.goods_weight,
                            goods_cat: '0'
                        })
                    if (res.meta.status !== 200) return this.$message.error('编辑商品信息失败')
                    this.editGoodsFormVisible = false;
                    this.getGoodsList()
                    this.$message.success('编辑商品信息成功~')

                }
            )
        },

        // 重置编辑商品表单
        resetEditForm() {
            this.$refs.editGoodsFormRef.resetFields()
            this.editGoodsForm = {}
        },
    },
}
</script>

<style lang="less" scoped>

</style>