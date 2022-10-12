<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 按钮 -->
            <el-button type="primary" @click="showAddCate">添加分类</el-button>

            <!-- 表格 -->
            <el-table :data="cateList" border style="width: 100%" row-key="cat_id"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column type="index">
                    <template v-slot="{row}">
                        <span v-if="row.isIndex">{{row.parentIndex}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cat_name" label="分类名称" width="266">
                </el-table-column>
                <el-table-column label="是否有效" width="266">
                    <template v-slot="{row}">
                        <div v-if="!row.cat_deleted">
                            <span>有效</span>&nbsp;
                            <i class="el-icon-success" style="color:#67c23a"></i>
                        </div>
                        <div v-if="row.cat_deleted">
                            <span>无效</span>&nbsp;
                            <i class="el-icon-error" style="color:red"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="分类排序" width="266">
                    <template v-slot="{row}">
                        <el-tag :type="['','success','info',][row.cat_level]" size="small">
                            {{['一级','二级','三级'][row.cat_level]}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="266">
                    <template v-slot="{row}">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditCateForm(row.cat_id)">
                            编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"
                            @click="delCate(row.cat_id,row.cat_name)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination :page-sizes="[3, 5, 10]" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :page-size="queryInfo.pagesize" :current-page="queryInfo.pagenum"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateVisible" width="35%" @close="resetAddCateForm">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="90px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input autocomplete="off" v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader :options="parentCateList" v-model="selectedKeys" @change="parentCateChanged"
                        :props="{ checkStrictly: true,expandTrigger: 'hover',value:'cat_id',label:'cat_name' }"
                        clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editCateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑按钮对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editCateVisible">
            <el-form :model="cateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="110px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input autocomplete="off" v-model="cateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editCateVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
export default {
    name: "Cate",
    created() {
        this.getCategory()
    },
    data() {
        return {
            cateList: [],
            parentCateList: [],
            cateForm: {},
            addCateForm: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            editCateVisible: false,
            addCateVisible: false,
            editCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ],
            },
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ],
            },
            selectedKeys: []

        }
    },
    methods: {
        // 获取分类列表
        async getCategory() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
            this.cateList = res.data.result
            this.cateList.forEach((item, index) => {
                item.isIndex = true
                item.parentIndex = index + 1
            })
            this.total = res.data.total
        },

        // 监听pagesize改变的事件
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize = newPageSize
            this.getCategory()
        },

        // 监听页码改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCategory()
        },

        // 拿到对应id后展示编辑对话框
        async showEditCateForm(id) {
            const { data: res } = await this.$http.get(`categories/${id}/`)
            if (res.meta.status !== 200) {
                return this.$message.error('发生错误')
            }
            this.cateForm = res.data
            this.editCateVisible = true
        },

        // 点击确认按钮后发送请求编辑分类信息
        editCate() {
            this.$refs.editCateFormRef.validate(
                async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.put(`categories/${this.cateForm.cat_id}/`, { cat_name: this.cateForm.cat_name })
                    if (res.meta.status !== 200) return this.$message.error('编辑分类信息失败')
                    this.editCateVisible = false
                    this.getCategory()
                    this.$message.success('编辑分类信息成功~')

                }
            )
        },

        // 删除分类
        delCate(id, catename) {
            this.$confirm(`此操作将永久删除分类【${catename}】, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`categories/${id}`)
                if (res.meta.status !== 200) return this.$message.error('删除失败')
                this.getCategory()
                this.$message.success('删除成功！')
            }).catch(() => {
                this.$message.info('已取消删除')
            });
        },

        // 拿到父级分类 展示添加分类对话框
        showAddCate() {
            this.getParentCateList()
            this.addCateVisible = true
        },

        // 发请求获取父级分类
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
            if (res.meta.status !== 200) return this.$message.error('获取父级商品分类列表失败')
            this.parentCateList = res.data
        },

        // 当选择项发生改变的时候
        parentCateChanged() {
            if (this.selectedKeys.length > 0) {
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }

        },

        // 点确认 发请求 添加分类
        addCate() {
            this.$refs.addCateFormRef.validate(
                async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.post('categories',this.addCateForm)
                    if (res.meta.status !== 201) return this.$message.error('添加商品分类失败')
                    this.$message.success('添加商品分类成功')
                    this.getCategory()
                    this.addCateVisible = false;


                })
        },

        // 重置添加分类对话框
        resetAddCateForm() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
        },


    },


}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>