<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 提示 -->
            <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false">
            </el-alert>

            <!-- 选择框 -->
            <el-row>
                <el-col class="cateSel">
                    <span style="font-size:14px">请选择商品分类：</span>
                    <el-cascader :options="cateList" v-model="selectedKeys" @change="cateChanged"
                        :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name' }">
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- 切换页 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 1.动态参数 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="small" :disabled="isDisable" @click="addAttrVisible = true">添加参数
                    </el-button>
                    <el-table :data="attrList">
                        <!-- （标签）展开行 -->
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="item,index in scope.row.attr_vals" :key="index" closable
                                    @close="handleDelTag(scope.row,index)">{{item}}
                                </el-tag>
                                <!-- 添加新标签 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    添加新标签
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index">
                        </el-table-column>
                        <el-table-column label="参数名称" width="500" prop="attr_name">
                        </el-table-column>
                        <el-table-column label="操作" width="500">
                            <template v-slot="{row}">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(row)">编辑
                                </el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delAttr(row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 2.静态属性 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="small" :disabled="isDisable" @click="addAttrVisible = true">添加属性
                    </el-button>
                    <el-table :data="attrList">
                        <!-- （标签）展开行 -->
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="item,index in scope.row.attr_vals" :key="index" closable
                                    @close="handleDelTag(scope.row,index)">{{item}}
                                </el-tag>
                                <!-- 添加新标签 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    添加新标签
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index">
                        </el-table-column>
                        <el-table-column label="属性名称" width="500" prop="attr_name">
                        </el-table-column>
                        <el-table-column label="操作" width="500">
                            <template v-slot="{row}">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditForm(row)">编辑
                                </el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delAttr(row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>
        </el-card>

        <!-- 添加参数按钮对话框 -->
        <el-dialog :title="`添加${titleText}`" :visible.sync="addAttrVisible" @close="resetAddAttrForm">
            <el-form :model="addAttrForm" :rules="addAttrFormRules" ref="addAttrFormRef" label-width="110px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input autocomplete="off" v-model="addAttrForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addAttrVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAttr">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑参数按钮对话框 -->
        <el-dialog :title="`编辑${titleText}`" :visible.sync="editAttrVisible" @close="resetEditAttrForm">
            <el-form :model="editAttrForm" :rules="editAttrFormRules" ref="editAttrFormRef" label-width="110px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input autocomplete="off" v-model="editAttrForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editAttrVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAttr">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Params',
    created() {
        this.getCateList()
    },
    data() {
        return {
            cateList: [],
            selectedKeys: [],
            activeName: 'many',
            attrList: [],
            addAttrVisible: false,
            editAttrVisible: false,
            addAttrFormRules: {
                attr_name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
            },
            editAttrFormRules: {
                attr_name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
            },
            addAttrForm: {
                attr_name: ''
            },
            editAttrForm: {},

        }
    },
    computed: {
        isDisable() {
            // 没选中就返回false
            if (this.selectedKeys.length !== 3) {
                return true
            }
        },
        cateId() {
            if (this.selectedKeys.length === 3) {
                return this.selectedKeys[2]
            }
            return null
        },
        titleText() {
            if (this.activeName == 'many') {
                return '动态参数'
            }
            return '静态属性'
        },


    },
    methods: {
        // 发请求获取商品分类
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
            this.cateList = res.data
        },

        // 当选择了分类时 发送请求获取参数渲染到表格
        async cateChanged() {
            this.getData()
        },

        // 标签页改变时
        handleTabClick() {
            this.getData()
        },

        // 当选择了分类时 发送请求获取参数渲染到表格
        async getData() {
            if (this.selectedKeys.length !== 3) {
                this.selectedKeys = []
                this.attrList = []
                return
            }
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
            if (res.meta.status !== 200) return this.$message.error('获取参数失败')
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                this.$set(item, 'inputVisible', false)
                this.$set(item, "inputValue", "");
            })
            this.attrList = res.data
        },

        // 重置添加参数表单
        resetAddAttrForm() {
            this.$refs.addAttrFormRef.resetFields()
            this.addAttrForm = {}
        },

        //重置编辑参数表单
        resetEditAttrForm() {
            this.$refs.editAttrFormRef.resetFields()
            this.editAttrForm = {}
        },

        // 点确定发请求添加参数
        addAttr() {
            this.$refs.addAttrFormRef.validate(
                async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
                        { attr_name: this.addAttrForm.attr_name, attr_sel: this.activeName })
                    if (res.meta.status !== 201) return this.$message.error('添加参数失败')
                    this.$message.success('添加参数成功~')
                    this.addAttrVisible = false
                    this.getData()
                })
        },

        // 通过插槽拿到参数Id 发请求拿到数据展示对话框
        async showEditForm(attr) {
            console.log(attr);
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr.attr_id}/`)
            if (res.meta.status !== 200) {
                return this.$message.error('编辑失败')
            }
            this.editAttrForm = res.data
            this.editAttrVisible = true
        },

        // 点确认发请求编辑参数
        editAttr() {
            this.$refs.editAttrFormRef.validate(
                async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editAttrForm.attr_id}`,
                        { attr_name: this.editAttrForm.attr_name, attr_sel: this.activeName })
                    if (res.meta.status !== 200) return this.$message.error('编辑失败')
                    this.editAttrVisible = false;
                    this.getData()
                    this.$message.success('编辑成功~')
                }
            )
        },

        // 删除参数
        delAttr(attr) {
            this.$confirm(`此操作将永久删除该参数, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr.attr_id}`)
                if (res.meta.status !== 200) return this.$message.error('删除失败')
                this.getData()
                this.$message.success('删除成功！')
            }).catch(() => {
                this.$message.info('已取消删除')
            });
        },

        // 点击按钮展示输入框
        showInput(row) {
            row.inputVisible = true;
            // 页面渲染后会执行的函数
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        // 新标签编辑完毕后
        async handleInputConfirm(row) {
            // 
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false;
                return
            }
            // 新增到attr_vals数组中
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false;

            this.saveAttrVals(row)

        },

        // 把对attr_vals的操作保存到数据库
        async saveAttrVals(row) {
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(',') })
            if (res.meta.status !== 200) return this.$message.error('编辑失败')
        },

        // 删除标签
        handleDelTag(row,i) {
            //根据索引从attr_vals数组中删去
            row.attr_vals.splice(i, 1)

            this.saveAttrVals(row)
        }

    },
}
</script>

<style scoped lang="less">
.el-tag {
    margin: 5px;
}

.cateSel {
    margin: 18px 0;
}

.button-new-tag {
    margin: 5px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    margin: 5px;
    width: 90px;
    vertical-align: bottom;
}
</style>