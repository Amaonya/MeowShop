<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 问候语 -->
      <div class="title">
        <svg t="1666785074596" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1773" width="200" height="200"><path d="M904.362667 683.52a42.666667 42.666667 0 1 1-16.725334 83.626667l-84.266666-16.853334-133.205334 133.205334A42.538667 42.538667 0 0 1 640 896H384a42.666667 42.666667 0 0 1-30.165333-12.501333L220.586667 750.293333l-84.266667 16.853334a42.666667 42.666667 0 0 1-16.725333-83.626667L170.666667 673.28v-106.624l-53.034667-13.269333a42.666667 42.666667 0 0 1 20.736-82.773334l32.298667 8.064v-90.453333l-41.813334-209.194667a42.666667 42.666667 0 0 1 63.786667-44.928L395.818667 256h232.362666l203.178667-121.898667a42.752 42.752 0 0 1 63.829333 44.928L853.333333 388.224v90.453333l32.298667-8.064a42.666667 42.666667 0 0 1 20.736 82.773334L853.333333 566.656v106.624l51.029334 10.24zM622.336 810.666667l80.469333-80.469334-28.501333-5.717333a42.581333 42.581333 0 1 1 16.725333-83.626667l76.970667 15.36v-68.224l-32.298667 8.064a42.666667 42.666667 0 0 1-20.736-82.773333L768 500.010667V384c0-2.816 0.256-5.589333 0.853333-8.362667l23.722667-118.741333-130.602667 78.336A42.538667 42.538667 0 0 1 640 341.333333H384a42.538667 42.538667 0 0 1-21.973333-6.101333L231.424 256.896l23.765333 118.741333c0.554667 2.773333 0.810667 5.546667 0.810667 8.362667v116.010667l53.034667 13.269333a42.666667 42.666667 0 0 1-20.736 82.773333L256 587.989333v68.224l76.970667-15.36a42.624 42.624 0 1 1 16.725333 83.626667l-28.501333 5.717333L401.664 810.666667h220.672zM554.666667 554.666667a42.666667 42.666667 0 0 1 0 85.333333h-85.333334a42.666667 42.666667 0 0 1 0-85.333333h85.333334z m-85.333334-85.333334a42.666667 42.666667 0 1 1-85.333333 0 42.666667 42.666667 0 0 1 85.333333 0z m128-42.666666a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z" fill="#6968d7" p-id="1774"></path></svg>
        <p>MeowShop</p>
      </div>  
      <p class="hello2">欢迎回来，祝您拥有美好的一天！</p>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input placeholder="用户名" v-model="loginForm.username"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input placeholder="密码" v-model="loginForm.password" show-password></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <button class="button-68" role="button" @click.prevent="login">登录</button>
          <button class="button-69" role="button" @click.prevent="resetForm">重置</button>
        </el-form-item>

      </el-form>

    </div>

  </div>

</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },

      // 表单的验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    
    login() {
      this.$refs.loginFormRef.validate(
        async (valid) => {
          if(!valid) return
          const {data:res} = await this.$http.post('login',this.loginForm)
          if(res.meta.status!==200) return this.$message.error(`${res.meta.msg}，请重试！`)
          this.$message.success('登录成功，欢迎回来！')
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        }
      )
    },
    
  },
}

</script>

<style lang="less" scoped>

.icon{
  width: 25px;
  height: 25px;
  text-align: center;
}
.login_container {
  height: 100%;
  background: rgb(185, 147, 214);
  background: linear-gradient(90deg, rgba(185, 147, 214, 1) 0%, rgba(140, 166, 219, 1) 100%);
  background: rgb(160,132,202);
  background: linear-gradient(90deg, rgba(160,132,202,1) 0%, rgba(100,92,170,1) 50%);
}

.login_box {
  padding: 40px 32px;
  width: 360px;
  background-color: #fff;
  border-radius: 48px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.title{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
  gap: 5px;
  font-size: 22px;
}

.hello2 {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  margin: 0 0 40px 0;
  color: rgba(143, 146, 161, 1);
}


.btns {
  display: flex;
  justify-content: flex-end;

}

.button-68 {
  margin-left: 10px;
  appearance: none;
  backface-visibility: hidden;
  background-color: #9962c6;
  border-radius: 16px;
  border-style: none;
  box-shadow: rgba(73, 39, 174, 0.15) 0 4px 9px;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: Inter, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 10px 20px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;

  &:hover {
    background-color: #6968d7;
    opacity: 1;
    transform: translateY(0);
    transition-duration: .35s;
    box-shadow: rgba(73, 39, 174, 0.15)0 6px 12px;
  }

  &:active {
    transform: translateY(2px);
    transition-duration: .35s;
  }
}


.button-69:extend(.button-68) {
  background-color: rgb(255, 255, 255);
  // color: #9c61cc;
  color: #9962c6;

  &:hover {
    opacity: 1;
    transform: translateY(0);
    transition-duration: .35s;
    box-shadow: rgba(73, 39, 174, 0.15)0 6px 12px;
  }

  &:active {
    transform: translateY(2px);
    transition-duration: .35s;
  }
}
</style>