<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 问候语 -->
      <p class="hello1">让我们为您登录</p>
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
          <button class="button-68" role="button" @click="login">登录</button>
          <button class="button-69" role="button" @click="resetForm">重置</button>
        </el-form-item>

      </el-form>

    </div>

  </div>

</template>

<script>
export default {
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
.login_container {
  // background: url(../assets/cool-background.png) center;
  height: 100%;
  background: rgb(185, 147, 214);
  background: linear-gradient(90deg, rgba(185, 147, 214, 1) 0%, rgba(140, 166, 219, 1) 100%);
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

.hello1 {
  font-size: 22px;
  text-align: center;
  margin: 0 0 12px 0;
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
  background-color: rgb(167, 117, 207);
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
  color: rgb(167, 117, 207);

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