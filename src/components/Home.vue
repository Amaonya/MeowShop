<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header height="72px">

      <!-- 展开层 -->

      <div class="headerbtn" @click="toggleCollapse">
        <i class="material-icons">subject</i>
      </div>

      <!-- 中间 -->
      <router-link to="/welcome">
        <h2 class="headertext">MYSHOP DASHBOARD</h2>
      </router-link>

      <!-- 退出登录 -->
      <el-tooltip content="退出登录" placement="left" :enterable="false">
        <div @click="logout" class="headerbtn">
          <i class="material-icons">logout</i>
        </div>
      </el-tooltip>

    </el-header>

    <!-- 主体 -->
    <el-container>


      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' :'220px'" class="hidden-md-and-down">
        <!-- 主菜单 -->
        <el-menu unique-opened :collapse="isCollapse" :collapse-transition="false" router
          :default-active="this.$route.path">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 内容 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i :class="iconList[subItem.id]"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>


      <!-- 内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>


    </el-container>


  </el-container>
</template>

<script>
export default {
  name: 'Home',
  created() {
    this.getMenuList()
    this.currentPath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menuList: [],
      iconList: {
        125: 'el-icon-user',
        103: 'el-icon-key',
        101: 'el-icon-goods',
        102: 'el-icon-document',
        145: 'el-icon-data-analysis',
        110: 'el-icon-tickets',
        111: 'el-icon-view',
        112: 'el-icon-unlock',
        104: 'el-icon-sell',
        115: 'el-icon-set-up',
        121: 'el-icon-takeaway-box',
        107: 'el-icon-document-copy',
        146: 'el-icon-pie-chart',
      },
      isCollapse: false,
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // 如果失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
  z-index: 10;


  .headertext {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 2px;
    color: #6968d7;
    cursor: pointer;
  }

  .headerbtn {
    color: #9aa2aa;
    cursor: pointer;
    transition: .3s;
    user-select: none;

    &:hover {
      color: #7a848e;
    }
  }

}

.el-aside {
  z-index: 9;
  transition: .3s;
  box-shadow: 0.125rem 0.8rem 0.8rem rgb(0 0 0 / 5%);
  
  .el-menu {
    border-right: none;
  }
}


.el-main {
  background-color: #f5f6f8;
}
</style>