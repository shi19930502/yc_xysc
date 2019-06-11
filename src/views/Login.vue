<template>
	<yd-layout>
		<div v-if='showLogin' class="Login">
			<div class="logo flex flex-x-center">
				<img v-if='$root.city=="临沂"'  src="../assets/imgs/logo_ysh@2x_old1.png" alt="">
				<!--<img src="../assets/imgs/logo@2x.png" alt="">-->
				<img  v-else src="../assets/imgs/logo_ysh@2x.png" alt="">
			</div>

			<div class="form">
				<div class="flex form-group">
					<img src="../assets/imgs/login_icon_user@2x.png" alt="" class="pswicon">
					<yd-input style="padding-left: 10px" type="text" v-model="username" :show-success-icon="false" max="20" placeholder="请输入用户名"></yd-input>
				</div>
				<div class="flex form-group">
					<img src="../assets/imgs/login_icon_password@2x.png" alt="" class="pswicon">
					<yd-input @keydown.native='downSpace' style="padding-left: 10px" type="password" :show-success-icon="false" v-model="password" max="20" placeholder="请输入密码"></yd-input>
				</div>
				<div class="flex flex-x-end forget">
					<div>
						 <yd-checkbox v-model="checkbox">记住账号</yd-checkbox>
					</div>
					<div>忘记密码？</div>
				</div>
				<div class=" flex flex-x-center">
					<div @click="login" class="loginbtn flex flex-y-center flex-x-center">
						<span>登录</span>
					</div>
				</div>
			</div>
			<div v-if='false' class="reg">还没有账号？
				<span @click="reg">立即注册</span>
			</div>
		</div>
	</yd-layout>
</template>
<script>
	import configs from '../configs'
	export default {
		data() {
			return {
				showLogin: false,
				openId: '',
				username: '',
				password: '',
				isFirst: true,
				checkbox:false,
			}
		},
		created() {
			this.$router.push({
				name:'f_login'
			})
			this.$dialog.loading.close();
			window.sessionStorage.setItem('isQrCode', 0);
			window.sessionStorage.setItem('loginSellerId', 'goLogin');
			this.$store.commit('login', {});
			this.$root.userInfo = {}
			if(this.$root.config.isSearch) {
				this.$dialog.loading.open('加载中，请稍后...');
				this.postRequest('customer/wxAuthor', {
					code: this.$root.config.code
				}).then(res => {
					this.$dialog.loading.close();
					if(!res) {
						this.showLogin = true
					} else {
						if(res.data.state == 0 && res.data.aaData.openid) {
							this.openId = res.data.aaData.openid
							window.sessionStorage.setItem('openId', this.openId)
							this.postRequest('', {
								openId: res.data.aaData.openid,
								systemId: 8,
								permisson: "no",
								flag: 1,
								authCode: '',
							}, true).then(resp => {
								console.log('login', resp)
								if(resp && resp.status == 200 && resp.data.state == 0) {
									if(resp.data && resp.data.state == 0) {
										this.isFirst = false;
										resp.data.sessionUser.token = resp.data.token
										if(resp.data.sessionUser.typeId == 'buyer') {
											this.loginBuyer(resp)
										} else {
											this.merchantOrbuyer(resp);

										}
									}
								} else {
									this.showLogin = true
								}
							})
						} else {
							this.showLogin = true
						}
					}
				})
			} else {
				this.showLogin = true
			}

		},
		mounted() {
			this.$store.dispatch('changeNavBarTitle', '登录')
			if(localStorage.getItem('accountObj')){
				var o=JSON.parse(localStorage.getItem('accountObj'));
				this.checkbox=o.checkbox;
				this.username=o.username
			}
		},
		methods: {
			/**
			 * 注册
			 */
			reg() {
				this.$router.push({
					name: 'UserReg'
				})
			},
			/**
			 * 登录
			 */
			//绑定微信
			updateMyDetail(resp) {
				return new Promise((resolve, rejct) => {
					this.$nextTick(()=>{
						this.$dialog.confirm({
							title: ' ',
							mes: `是否将${this.username}与微信绑定,方便下次直接登录!`,
							opts: [{
									txt: '否',
									color: false,
									callback: () => {
										resolve()
									}
								},
								{
									txt: '是',
									color: true,
									callback: () => {
										this.postRequest('user/updateMyDetail', {
											wxopenid: sessionStorage.getItem('openId') ? sessionStorage.getItem('openId') : '',
											userId: resp.data.sessionUser.userId,
											token: resp.data.token,
										}, false, true).then(res => {
											resolve(res.data)
										})
									}
								}
							]
						});
					})
					
				})
			},
			//买家登录
			loginBuyer(resp) {
				this.$store.commit('login', resp.data.sessionUser);
				this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
				if(sessionStorage.getItem('openId') && this.isFirst) {
					this.updateMyDetail(resp).then((d) => {
						this.$router.push({
							name: 'Enshrine'
						})
					})
				} else {
					this.$router.push({
						name: 'Enshrine'
					})
				}
			},
			//卖家登录
			loginMerchant(resp) {
				this.$store.commit('login', resp.data.sessionUser);
				this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
				if(sessionStorage.getItem('openId')&&this.isFirst) {
					this.updateMyDetail(resp).then((d) => {
						this.$router.push({
							name: 'Merchant',
							query: {
								sellerId: resp.data.sessionUser.typeCode
							}
						})
					})
				} else {
					this.$router.push({
						name: 'Merchant',
						query: {
							sellerId: resp.data.sessionUser.typeCode
						}
					})
				}
			},
			//既是买家也是卖家
			merchantOrbuyer(resp) {
				if(resp.data.sessionUser.typeId == 'merchant_buyer') {
					this.$dialog.confirm({
						title: `欢迎您:${resp.data.sessionUser.nickName},请选择登录身份`,
						mes: '',
						opts: [{
								txt: '以采购商身份登录',
								color: '#03a9d7',
								callback: () => {
									resp.data.sessionUser.typeId = 'buyer'
									this.loginBuyer(resp)
								}
							},
							{
								txt: '以供应商身份登录',
								color: true,
								callback: () => {
									resp.data.sessionUser.typeId = 'merchant'
									this.loginMerchant(resp)
								}
							}
						]
					});
				} else {
					this.loginMerchant(resp)
				}
			},
			downSpace(event) {
				var e = event || window.event;
				if(e && e.keyCode == 13) { //回车键的键值为13
					this.login() //调用登录按钮的登录事件
				}
			},
			//登录
			login() {
				if(this.username == '') {
					this.$dialog.alert({
						mes: '请输入用户名'
					});
					return false
				}
				if(this.password == '') {
					this.$dialog.alert({
						mes: '请输入密码'
					});
					return false
				}
				this.$dialog.loading.open('登录中，请稍后...');
				this.postRequest('', {
					loginName: this.username,
					password: this.password,
					systemId: 8,
					permisson: "no",
					flag: 1,
					authCode: '',
				}, true).then(resp => {
					if(resp && resp.status == 200) {
						if(resp.data && resp.data.state == 0) {
							this.$dialog.loading.close();
							resp.data.sessionUser.token = resp.data.token
							var accountObj={
								checkbox:this.checkbox,
								username:''
							}
							if(this.checkbox){
								accountObj.username=this.username
							}
							window.localStorage.setItem('accountObj',JSON.stringify(accountObj));
							if(resp.data.sessionUser.typeId == 'buyer') {
								this.loginBuyer(resp);
							} else {
								this.merchantOrbuyer(resp);
							}

						} else {
							this.$dialog.loading.close();
							this.$dialog.alert({
								mes: resp.data.msg
							});
						}
					} else {
						this.$dialog.loading.close();
						this.$dialog.alert({
							mes: resp.data.msg
						});
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	.yd-scrollview:after {
		height: 0;
	}
	
	.Login {
		input {
			font-family: 'PingFang-SC-Medium';
			font-size: 0.28rem;
		}
		height: 100%;
		background: url(../assets/imgs/bg@2x.png);
		background-size: 100% 100%;
		.logo {
			padding-top: 1.74rem;
			img {
				width: 4.78rem;
				height: 2.37rem;
			}
		}
		.form {
			width: 5.3rem;
			margin: 0 auto;
			padding-top: 1.2rem;
			.form-group {
				.yd-input {
					height: 0.46rem;
					font-size: 0.28rem;
				}
				border-bottom: 1px solid #C6C6C6;
				padding: 0.18rem 0;
				margin-bottom: 0.15rem;
				img.pswicon {
					width: 0.4rem;
					height: 0.46rem;
				}
			}
			.loginbtn {
				width: 100%;
				margin-top: 0.3rem;
				height: 0.78rem;
				background: #00A3FF;
				border-radius: 0.39rem;
				color: #fff;
				font-size: 0.31rem;
				text-align: center;
			}
		}
		.reg {
			padding-top: 2.5rem;
			width: 100%;
			text-align: center;
			span {
				color: #00A3FF;
			}
		}
		.forget {
			color: #626262;
			font-size: 0.24rem;
			display: flex;
			justify-content: space-between;
		}
	}
</style>