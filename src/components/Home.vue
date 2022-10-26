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
        <h2 class="headertext">MEOWSHOP
        <svg t="1666785074596" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1773" width="200" height="200"><path d="M904.362667 683.52a42.666667 42.666667 0 1 1-16.725334 83.626667l-84.266666-16.853334-133.205334 133.205334A42.538667 42.538667 0 0 1 640 896H384a42.666667 42.666667 0 0 1-30.165333-12.501333L220.586667 750.293333l-84.266667 16.853334a42.666667 42.666667 0 0 1-16.725333-83.626667L170.666667 673.28v-106.624l-53.034667-13.269333a42.666667 42.666667 0 0 1 20.736-82.773334l32.298667 8.064v-90.453333l-41.813334-209.194667a42.666667 42.666667 0 0 1 63.786667-44.928L395.818667 256h232.362666l203.178667-121.898667a42.752 42.752 0 0 1 63.829333 44.928L853.333333 388.224v90.453333l32.298667-8.064a42.666667 42.666667 0 0 1 20.736 82.773334L853.333333 566.656v106.624l51.029334 10.24zM622.336 810.666667l80.469333-80.469334-28.501333-5.717333a42.581333 42.581333 0 1 1 16.725333-83.626667l76.970667 15.36v-68.224l-32.298667 8.064a42.666667 42.666667 0 0 1-20.736-82.773333L768 500.010667V384c0-2.816 0.256-5.589333 0.853333-8.362667l23.722667-118.741333-130.602667 78.336A42.538667 42.538667 0 0 1 640 341.333333H384a42.538667 42.538667 0 0 1-21.973333-6.101333L231.424 256.896l23.765333 118.741333c0.554667 2.773333 0.810667 5.546667 0.810667 8.362667v116.010667l53.034667 13.269333a42.666667 42.666667 0 0 1-20.736 82.773333L256 587.989333v68.224l76.970667-15.36a42.624 42.624 0 1 1 16.725333 83.626667l-28.501333 5.717333L401.664 810.666667h220.672zM554.666667 554.666667a42.666667 42.666667 0 0 1 0 85.333333h-85.333334a42.666667 42.666667 0 0 1 0-85.333333h85.333334z m-85.333334-85.333334a42.666667 42.666667 0 1 1-85.333333 0 42.666667 42.666667 0 0 1 85.333333 0z m128-42.666666a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z" fill="#6968d7" p-id="1774"></path></svg>
          DASHBOARD</h2>
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
.icon{
  width: 23px;
  height: 23px;
}
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