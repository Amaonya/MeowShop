<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList"
                        @change="getUserList">
                        <el-button slot="prepend" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUserFormVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="181">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="181">
                </el-table-column>
                <el-table-column prop="mobile" label="电话" width="181">
                </el-table-column>
                <el-table-column prop="role_name" label="角色" width="181">
                </el-table-column>
                <el-table-column label="状态" width="181">
                    <template v-slot="{row}">
                        <el-switch v-model="row.mg_state" @change="handleSwitchChange(row.mg_state,row.id)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="181">
                    <template v-slot="{row}">
                        <!-- 编辑 -->
                        <el-button type="primary" icon="el-icon-edit" circle size="small" @click="showEditUser(row.id)">
                        </el-button>
                        <!-- 分配角色 -->
                        <el-tooltip content="分配角色" placement="top" :enterable="false" size="small">
                            <el-button type="warning" icon="el-icon-setting" circle size="small"></el-button>
                        </el-tooltip>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" circle size="small"
                            @click="delUser(row.id,row.username)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

        </el-card>

        <!-- 添加用户按钮的表单 -->
        <el-dialog title="添加用户" :visible.sync="addUserFormVisible" @close="resetUserForm">
            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input autocomplete="off" v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input autocomplete="off" v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input autocomplete="off" v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input autocomplete="off" v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改用户表单 -->
        <el-dialog title="编辑用户" :visible.sync="editUserFormVisible" @close="resetEditForm">
            <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input autocomplete="off" v-model="editUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input autocomplete="off" v-model="editUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input autocomplete="off" v-model="editUserForm.mobile"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editUserFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'Users',
    created() {
        this.getUserList()
    },

    data() {
        var checkEmail = (rule, value, callback) => {
            const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (regEmail.test(value)) return callback()
            callback(new Error('请输入正确的邮箱'))
        }

        var checkMobile = (rule, value, callback) => {
            const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
            if (regMobile.test(value)) return callback()
            callback(new Error('请输入合法的手机号'))
        }


        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            userList: [],
            total: 0,
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            editUserForm: {},

            addUserFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
            },
            editUserFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
            },

            addUserFormVisible: false,
            editUserFormVisible: false,

        }
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
            this.userList = res.data.users
            this.total = res.data.total
        },

        // 监听pagesize改变的事件
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize = newPageSize
            this.getUserList()
        },

        // 监听页码改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },

        // 更新状态
        async handleSwitchChange(state, id) {
            const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
            if (res.meta.status !== 200) {
                // 因为是设置失败了，所以不能让人改变开关
                state = !state
                return this.$message.error('更新状态失败')
            }
            this.$message.success('更新状态成功~')
        },

        // 确认表单，添加新用户
        addUser() {
            this.$refs.addUserFormRef.validate(
                async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.post('users', this.addUserForm)
                    if (res.meta.status !== 201) return this.$message.error('添加用户失败')
                    this.$message.success('添加用户成功')
                    this.addUserFormVisible = false;
                    this.getUserList()

                }
            )
        },

        // 重置添加用户表单
        resetUserForm() {
            this.$refs.addUserFormRef.resetFields()
        },

        // 拿到id，拿到用户信息并传递后展示对话框
        async showEditUser(id) {
            const { data: res } = await this.$http.get(`users/${id}/`)
            if (res.meta.status !== 200) {
                return this.$message.error('编辑用户信息失败')
            }
            this.editUserForm = res.data
            this.editUserFormVisible = true;
        },

        // 确认表单，提交编辑用户信息
        editUser() {
            this.$refs.editUserFormRef.validate(
                async (valid) => {
                    if (!valid) return
                    const { data: res } = await this.$http.put(`users/${this.editUserForm.id}/`, { email: this.editUserForm.email, mobile: this.editUserForm.mobile })
                    if (res.meta.status !== 200) return this.$message.error('编辑用户信息失败')
                    this.editUserFormVisible = false;
                    this.getUserList()
                    this.$message.success('编辑用户信息成功~')

                }
            )
        },
        // 重置编辑用户表单
        resetEditForm() {
            this.$refs.editUserFormRef.resetFields()
        },

        delUser(id, username) {
            this.$confirm(`此操作将永久删除用户【${username}】, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`users/${id}`)
                if (res.meta.status !== 200) return this.$message.error('删除失败')
                this.getUserList()
                this.$message.success('删除成功！')
            }).catch(() => {
                this.$message.info('已取消删除')
            });
        }
    }
}
</script>

<style lang="less" scoped>

</style>