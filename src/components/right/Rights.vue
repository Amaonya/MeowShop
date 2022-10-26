<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" height="560" stripe>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="357">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="357">
        </el-table-column>
        <el-table-column label="权限层级" width="357">
          <template v-slot="{row}">
            <el-tag :type="['info','success',''][row.level]">
              {{['一级权限','二级权限','三级权限'][row.level]}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
  </div>
</template>

<script>
export default {
  name: 'Right',
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
    }

  },
}
</script>

<style scoped lang="less">

</style>