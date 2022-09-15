<template>
    <el-card class="welcomePage">
        <el-row type="flex" :gutter="10" justify="center"  align="middle"> 
            <el-col :xs="24" :sm="24" :md="12" :lg="11" :xl="14">
                <div class="welcomeText">
                    <h2>欢迎回来。</h2>
                    <h3>WELCOME BACK.</h3>
                    <h4>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio eum temporibus eos dolor repellat
                        voluptatem nisi in mollitia? Recusandae eligendi natus quas optio repudiandae, laborum sed
                        magni.
                        <a
                            href="https://www.freepik.com/free-vector/flat-people-business-training_13560919.htm#query=flat%20business%20training&position=6&from_view=search">Image
                            by pikisuperstar</a> on Freepik.
                    </h4>
                    <!-- <h4></h4> -->
                    <el-button type="primary" round>联系作者</el-button>
                </div>
            </el-col>

            <el-col :md="12" :lg="13" :xl="10" class="hidden-sm-and-down">
                <div class="welcomeImg">
                    <img src="../assets/welcometo.png">
                </div>
            </el-col>
        </el-row>
        <div class="links">
            <el-link >GITHUB</el-link>
            <el-link >GITEE</el-link>
            <el-link >BILIBILI</el-link>

        </div>
    </el-card>
</template>

<script>
export default {
    name: 'Welcome',

}
</script>

<style lang="less" scoped>
.welcomePage {
    border-radius: 15px;
    padding: 5%;
}

.welcomeText {
    h2 {
        margin: 0 0;
        font-size: 70px;
        font-weight: 600;
        color: #703fbf;
    }

    h3 {
        margin: 0 0 40px 0;
        color: #ffac00;
        font-size: 30px;
    }

    h4 {
        font-size: 18px;
        margin: 0 0 50px 0;
    }
}

.welcomeImg {
    img {
        max-width: 100%;
        max-height: 100%;
    }
}

.links{
    display: flex;
    width: 100%;
    
    justify-content: space-around;
    align-items: center;
    margin-top: 40px;

    .el-link{
        font-size: 16px;
        letter-spacing: 3px;
    }
}
</style>