<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
            <div id="main" style="height:500px;"></div>
        </el-card>
    </div>
</template>
<script>
import _ from 'lodash'
import * as echarts from 'echarts';
export default {
    name: 'Report',
    data() {
        return {
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false,
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    // 此时页面上的元素以及渲染完毕，可以初始化echart了
    async mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 发请求拿到数据
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) return this.$message.$error('获取报表失败')

        const result = _.merge(this.options, res.data)
  
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);

    },

    methods: {

    },
}
</script>

<style>

</style>