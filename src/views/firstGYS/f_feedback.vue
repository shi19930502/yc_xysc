<template>
	<yd-layout id='fFeedback'>
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="#/f_index" class="header_left">首页</a>
				<div v-else></div>
			</div>
			<div class="name">反馈信息</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="javascript:;"></a>
				<div v-else></div>
			</div>
		</div>
		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">
		            <div class="lable">
		              <strong>反馈对象</strong>
		            </div>
		        </span>
				<span slot="left">
            		管理员
          		</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
            <div class="lable">
              <strong>反馈标题</strong>
            </div>
          </span>
				<yd-input v-model="form.title" slot="right" max="20" placeholder="请输入反馈标题" :show-success-icon="false"></yd-input>
			</yd-cell-item>
			<!-- 反馈内容 -->
			<yd-cell-item>
				<span slot="left">
            <div class="lable">
              <strong>反馈内容</strong>
            </div>
          </span>
				<yd-textarea v-model="form.remark" slot="right" placeholder="请输入反馈内容" maxlength="100"></yd-textarea>
			</yd-cell-item>
		</yd-cell-group>
		<div class="flex flex-x-center" style="padding: 0 0.24rem;">
			<div @click="save" class="loginbtn flex flex-y-center flex-x-center">
				<span>提交反馈</span>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					type: "1",
					title: "",
					costomerId: "",
					remark: "",
					createUserId: "",
					createUserName: ""
				}
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '反馈信息')
		},
		watch: {

		},
		computed: {

		},
		mounted() {

		},
		methods: {
			// 提交
			save() {
				if(this.form.title == "") {
					this.$dialog.alert({
						mes: "请输入反馈标题！"
					});
					return false;
				}
				if(this.form.remark == "") {
					this.$dialog.alert({
						mes: "请输入反馈内容！"
					});
					return false;
				}
				let param = this.form;
				param.createUserId = this.$root.userInfo.userId;
				param.createUserName = this.$root.userInfo.nickName;

				this.postRequest("opinion/create", param).then(resp => {
					if(resp.data && resp.data.state == 0) {
						this.form.title = "";
						this.form.remark = "";
						this.$dialog.toast({
							mes: "反馈内容提交成功！",
							timeout: 1200,
							icon: "success"
						});
					}
				});
			},
		}
	}
</script>

<style lang='scss'>
	#fFeedback {
		background: white;
		.loginbtn {
			width: 100%;
			height: 0.78rem;
			background: #6fb138;
			border-radius: 0.39rem;
			color: #fff;
			font-size: 0.31rem;
			text-align: center;
		}
		.yd-textarea>textarea {
			font-family: "PingFang-SC-Medium";
		}
		.yd-cell-right select {
			margin-left: 0;
		}
		.lable {
			width: 1.8rem;
			font-size: 0.3rem;
		}
		.yd-tabbar {
			padding: 0 !important;
		}
		.yd-cell-item:not(:last-child):after,
		.yd-cell:after {
			border: 0.01rem solid #e4e4e4;
			background-image: none;
		}
		.submitbtn {
			width: 100%;
			height: 0.9rem;
			font-size: 0.3rem;
			background: #6fb138;
			color: #fff;
		}
	}
</style>