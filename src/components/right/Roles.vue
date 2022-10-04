<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addRoleFormVisible = true">添加角色</el-button>
      <el-table :data="rolesList">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="i1==0?'':'bt1'">
              <el-col :span="5">
                <el-tag closable @close="delRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="i2==0?'':'bt1'">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="delRight(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="info" v-for="item3 in item2.children" :key="item3.id"
                      @close="delRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column label="名称" prop="roleName" width="341">
        </el-table-column>
        <el-table-column label="描述" prop="roleDesc" width="341">
        </el-table-column>
        <el-table-column label="操作" width="341">
          <template v-slot="{row}">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRole(row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRole(row.id,row.roleName)">删除
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRight(row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色按钮的表单 -->
    <el-dialog title="添加角色" :visible.sync="addRoleFormVisible" @close="resetRoleForm">
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="110px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input autocomplete="off" v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input autocomplete="off" v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色按钮的表单 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleFormVisible" @close="resetEditForm">
      <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="110px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input autocomplete="off" v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input autocomplete="off" v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 分配权限按钮的表单 -->
    <el-dialog title="分配权限" :visible.sync="setRightVisible">
      <el-tree :data="rightsList" :props="treeProps" node-key="id" 
      :default-checked-keys="defkeys" show-checkbox default-expand-all ref="tree">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList()
  },

  data() {
    return {
      rolesList: [],
      rightsList: [],
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {},
      addRoleFormVisible: false,
      editRoleFormVisible: false,
      setRightVisible: false,
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      defkeys:[],
      roleId:''
    }
  },

  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },

    // 添加角色
    addRole() {
      this.$refs.addRoleFormRef.validate(
        async (valid) => {
          if (!valid) return
          const { data: res } = await this.$http.post('roles', this.addRoleForm)
          if (res.meta.status !== 201) return this.$message.error('添加角色失败')
          this.$message.success('添加角色成功~')
          this.addRoleFormVisible = false;
          this.getRolesList()

        }
      )
    },

    // 重置添加角色表单
    resetRoleForm() {
      this.$refs.addRoleFormRef.resetFields()
    },

    // 拿到id，拿到用户信息并传递后展示对话框
    async showEditRole(id) {
      const { data: res } = await this.$http.get(`roles/${id}/`)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑用户信息失败')
      }
      this.editRoleForm = res.data
      this.editRoleFormVisible = true;
    },

    // 确认表单，提交编辑用户信息
    editRole() {
      this.$refs.editRoleFormRef.validate(
        async (valid) => {
          if (!valid) return
          console.log(this.editRoleForm.roleId);
          const { data: res } = await this.$http.put(`roles/${this.editRoleForm.roleId}/`, { roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc })
          if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败')
          this.editRoleFormVisible = false;
          this.getRolesList()
          this.$message.success('编辑角色信息成功~')

        }
      )
    },
    // 重置编辑用户表单
    resetEditForm() {
      this.editRoleForm = {}
      this.$refs.editRoleFormRef.resetFields()
    },

    // 删除角色
    delRole(id, roleName) {
      this.$confirm(`此操作将永久删除角色【${roleName}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.getRolesList()
        this.$message.success('删除成功！')
      }).catch(() => {
        this.$message.info('已取消删除')
      });
    },

    // 根据id删除权限
    delRight(role, rightId) {
      this.$confirm(`将删除该权限, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        role.children = res.data
        this.$message.success('删除成功！')
      }).catch(() => {
        this.$message.info('已取消删除')
      });
    },

    // 展示分配权限表单
    async showSetRight(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      // 递归获取三级节点id
      this.defkeys = []
      this.sendDefKeys(role,this.defkeys)
      this.setRightVisible = true
    },

    // 发送节点的id到数组里 然后打开对话框时就能勾选上了
    sendDefKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => this.sendDefKeys(item,arr))
    },

    // 点击为角色分配权限
    async allotRights(){
      const keys = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
      // join方法把数组中的所有元素转换为一个字符串
      const idStr = keys.join(',')
      console.log(this.roleId);
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功~')
      this.getRolesList()
      this.setRightVisible = false

    }

  },

}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}

.bt1 {
  border-top: 1px solid #eee;
}
</style>