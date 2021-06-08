<!--
 * @author: wangxue
 * @Date: 2020-07-13 10:10:08
 * @description: 音频播放组件 包含倍速功能
 -->
<template>
    <div class="audio-box">
        <audio class="audio"
            ref="audio"
			controls
            :src="url">
            对不起，您的浏览器不支持HTML5音频播放。</audio>
		<div class="speed-box">
			<span>倍速播放：</span>
			<el-select v-model="speed"
				placeholder="请选择"
				@change="changeRate">
				<el-option v-for="item in speedOps"
					:key="item.value"
					:label="item.name"
					:value="item.value">
				</el-option>
			</el-select>
		</div>
    </div>
</template>

<script>
export default {
    name: 'audio-play',
    props: {
		// 音频链接
        url: {
            type: String,
            default: ''
		},
		// 倍速列表
        speedOps: {
            type: Array,
            default: function() {
                return [
					{
                        name: '0.75X',
                        value: '0.75'
					},
                    {
                        name: '1X',
                        value: '1'
					},
					{
                        name: '1.25X',
                        value: '1.25'
					},
					{
                        name: '1.5X',
                        value: '1.5'
					},
					{
                        name: '1.75X',
                        value: '1.75'
					},
					{
                        name: '2X',
                        value: '2'
					}
                ];
            }
        }
    },
    data() {
        return {
            // 速度
            speed: '1'
        };
    },
    methods: {
        /**
         * @description: 切换倍速
         * @param {String} val 倍速值
         */
        changeRate(val) {
            this.$refs['audio'].playbackRate = val;
        }
    }
};
</script>
<style lang="less" scoped>
.audio-box {
	display: flex;
	justify-content: flex-start;
	.audio {
        outline:none;
        height: 40px;
	}
	/deep/.speed-box {
        margin-left: 20px;
        .el-select {
            width: 100px;
        }
	}
}
</style>
