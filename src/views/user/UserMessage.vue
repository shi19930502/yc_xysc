<template>
	<yd-layout>
		<div id="UserMessage">
			<ul v-if="dataList.length>0">
				<li v-for="d in dataList">
					<div class="flex flex-x-between flex-y-center">
						<div class="flex flex-item-6">
							<div class="icon">
								<img src="../../assets/imgs/message_icon_laba.png" style="width: 0.4rem;height: 0.4rem;">
								<div class="dot" v-show="d.noticeStatus == 0"></div>
							</div>
							<h1>{{d.title}}</h1>
						</div>
						<p style="padding-left: 15px">{{d.publishedDate}}</p>
					</div>
					<div class="msg">{{d.comment}}</div>
				</li>
			</ul>
			<div v-else class="empty">还没有消息~~ </div>
		</div>
	</yd-layout>
</template>
<script>
	import mixin from '../../utils/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				dataList: []
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '消息')
			this.getUserMessage()
		},
		mounted() {

		},
		methods: {
			// 获取消息列表
			getUserMessage() {
				this.postRequest('platformnoticeflow/list', {
					customerId: this.userInfo.userId
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.dataList = d.data.aaData
					}
				})
			},
		}
	};
</script>
<style lang="scss">
	#UserMessage {
		li {
			margin-bottom: 0.25rem;
			background: #fff;
			padding: 0.25rem;
			h1 {
				font-size: 0.3rem;
			}
			.icon {
				margin-right: 0.2rem;
				position: relative;
				.dot {
					width: 0.16rem;
					height: 0.16rem;
					background: #FF3D15;
					border-radius: 0.08rem;
					position: absolute;
					top: -0.05rem;
					right: -0.05rem;
				}
			}
			p {
				color: #989E92;
			}
			.msg {
				word-wrap: break-word;
				margin-top: 0.1rem;
				padding-left: 0.66rem;
				color: #989E92;
			}
		}
	}
</style>