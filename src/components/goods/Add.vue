<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>

            <el-steps :active="activeIndex - 0" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTableLeave"
                    @tab-click="tabClicked">

                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input autocomplete="off" v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input autocomplete="off" v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input autocomplete="off" v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input autocomplete="off" v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader :options="cateList" v-model="addForm.goods_cat" @change="handleChange"
                                :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox v-for="cb, index in item.attr_vals" :key="index" :label="cb" border
                                    size="small"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品图片" name="3">
                        <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
                            :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture"
                            :headers="headerObj">
                            <el-button class="uploadBtn" size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" @click="addGoods" class="addGoodsBtn" size="medium">添加商品</el-button>

                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <el-dialog title="图片预览" :visible.sync="previewPicVisible">
            <el-image :src="picSrc">
                <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                </div>
            </el-image>
        </el-dialog>
    </div>
</template>

<script>
export default {

    name: 'Add',
    created() {
        this.getCateList()
    },
    data() {
        return {
            cateList: [],
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            addForm: {
                goods_name: '',
                goods_cat: [],
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                goods_introduce: '',
                pics: [],
                attrs: [],
            },
            manyTableData: [],
            onlyTableData: [],
            selectedKeys: [],
            activeIndex: '0',
            previewPicVisible: false,
            picSrc: '',
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
            },
        }
    },
    methods: {
        // 发请求获取商品分类
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
            this.cateList = res.data
        },

        // 选择器发生变化时
        handleChange() {
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
        },

        // 即将切换tabs时
        beforeTableLeave(_, oldActiveName) {
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
        },


        // 点击左侧标签页
        async tabClicked() {
            // 访问商品参数页
            if (this.activeIndex === '1') {
                const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'many' } })
                if (res.meta.status !== 200) return this.$message.error('获取参数失败')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                })
                this.manyTableData = res.data
            }

            // 访问商品属性页
            else if (this.activeIndex === '2') {
                const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'only' } })
                if (res.meta.status !== 200) return this.$message.error('获取参数失败')
                this.onlyTableData = res.data
            }

        },

        // 点击预览图片
        handlePreview(file) {
            this.picSrc = file.response.data.url
            this.previewPicVisible = true
        },

        // 移除图片
        handleRemove(file) {
            // 获取到图片路径
            const filePath = file.response.data.tmp_path
            // 用findIndex方法拿到数组里面对应那一项的索引
            const fileIndex = this.addForm.pics.findIndex(x => {
                x.pic === filePath
            })
            // 根据拿到的索引用splice切掉那一项
            this.addForm.pics.splice(fileIndex, 1)
        },

        // 监听图片上传成功
        handleSuccess(response) {
            const picInfo = { pic: response.data.tmp_path }
            this.addForm.pics.push(picInfo)
        },

        // 校验所有信息 发请求添加商品
        addGoods() {
            this.$refs.addFormRef.validate(
                async (valid) => {
                    if (!valid) return this.$message.error('请填写必要的表单项！')


                    // 处理动态参数
                    this.manyTableData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(',') }
                        this.addForm.attrs.push(newInfo)
                    })

                    // 处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
                        this.addForm.attrs.push(newInfo)
                    })

                    // 深拷贝addForm
                    const copyAddForm = JSON.parse(JSON.stringify(this.addForm))
                    // 把goods_cat改成字符串
                    copyAddForm.goods_cat = copyAddForm.goods_cat.join(',')

                    // 发请求
                    const { data: res } = await this.$http.post('goods',copyAddForm)
                    if (res.meta.status !== 201) return this.$message.error('添加商品失败')
                    this.$message.success('添加商品成功~')
                    this.$router.push('/goods')


                })
        }

    },
}
</script>

<style lang="less" scoped>
.el-form-item {
    padding: 0 15px;
}

.el-tag {
    margin-right: 8px;
}

.el-checkbox {
    margin: 0 10px 0 0 !important;
}

.uploadBtn {
    margin-left: 15px;
}

.addGoodsBtn {
    margin-top: 15px;
}
</style>