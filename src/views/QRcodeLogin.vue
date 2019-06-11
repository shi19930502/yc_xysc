<template>
	<yd-layout>
		<div v-if='showLogin' class="QRcode_login">
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
					<yd-input style="padding-left: 10px" type="password" :show-success-icon="false" v-model="password" max="20" placeholder="请输入密码"></yd-input>
				</div>
				<div class="flex flex-x-end forget">忘记密码？</div>
				<div class=" flex flex-x-center">
					<div @click="login" class="loginbtn flex flex-y-center flex-x-center">
						<span>关联供应商并登录</span>
					</div>
				</div>
			</div>
			<div class="reg">还没有账号？
				<span @click="reg">立即注册为采购商</span>
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
				sellerId: '',
				loginInvitationCode: '',
			}
		},
		created() {
			this.$dialog.loading.close();
			window.sessionStorage.setItem('isQrCode', 1);
			this.sellerId = sessionStorage.getItem('loginSellerId');
			this.getSellerId();
			console.log(sessionStorage.getItem('loginSellerId'))
			if(this.$root.config.isSearch) {
				this.$dialog.loading.open('加载中，请稍后...');
				this.postRequest('customer/wxAuthor', {
					code: this.$root.config.code
				}).then(res => {
					this.$dialog.loading.close();
					//					||res.data.aaData.errcode
					if((!res)) {
						this.showLogin = false
						if(!this.sellerId || res.data.aaData.errcode) {
							this.$dialog.confirm({
								title: ' ',
								mes: `请通过店铺扫码进入该页面,现为你跳转到登录页面`,
								opts: [{
									txt: '确定',
									color: true,
									callback: () => {
										this.$router.push({ name: 'Login' })
									}
								}]
							});
						}
					} else {
						if(res.data.state == 0 && res.data.aaData.openid) {
							this.openId = res.data.aaData.openid;
							window.sessionStorage.setItem('openId', this.openId)
							this.getSellerId()
							this.showLogin = true
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
										resp.data.sessionUser.token = resp.data.token
										if(resp.data.sessionUser.typeId == 'buyer') {
											this.$store.commit('login', resp.data.sessionUser);
											this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
											this.relevance();
										} else if((resp.data.sessionUser.typeId == 'merchant' || resp.data.sessionUser.typeId == 'merchant_buyer') && resp.data.sessionUser.typeCode == this.sellerId) {
											this.goShop(resp)
										} else {
											this.merchantOrbuyer(resp, true)

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
				if(!this.sellerId || this.sellerId == 'goLogin') {
					this.$dialog.confirm({
						title: ' ',
						mes: `请通过店铺二维码进入该页面,现为你跳转到登录页面`,
						opts: [{
							txt: '确定',
							color: true,
							callback: () => {
								this.$router.push({ name: 'Login' })
							}
						}]
					});
				} else {
					this.showLogin = true
				}
			}

		},
		mounted() {
			this.$store.dispatch('changeNavBarTitle', '登录')
		},
		methods: {
			/**
			 * 注册
			 */
			reg() {
				this.$router.push({
					name: 'UserReg',
					params: {
						isQrCode: 1,
					}
				})
			},
			getSellerId() {
				var sellerId = ''
				if(this.$root.config.isSearch) {
					sellerId = this.$root.config.state
				}
				if(sellerId) {
					this.sellerId = sellerId.split('Y')[0];
					window.sessionStorage.setItem('loginSellerId', this.sellerId);
					if(sellerId.indexOf('Y') >= 0) {
						this.loginInvitationCode = sellerId.split('Y')[1]
						window.sessionStorage.setItem('loginInvitationCode', this.loginInvitationCode);
					}
				}
			},
			//登录函数
			loginFun(flg) {
				var param = {
					loginName: this.username,
					password: this.password,
					systemId: 8,
					permisson: "no",
					flag: 1,
					authCode: '',
				}
				this.postRequest('', param, true).then(resp => {
					if(resp && resp.status == 200) {
						if(resp.data && resp.data.state == 0) {
							this.$dialog.loading.close();
							resp.data.sessionUser.token = resp.data.token
							if(resp.data.sessionUser.typeId == 'buyer') {
								this.$store.commit('login', resp.data.sessionUser);
								this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
								this.getSellerId()
								if(flg) {
									this.postRequest('user/updateMyDetail', {
										wxopenid: sessionStorage.getItem('openId'),
										userId: resp.data.sessionUser.userId,
										token: resp.data.token,
									}, false, true).then(res => {
										this.relevance();
									})
								} else {
									this.relevance();
								}
							} else if((resp.data.sessionUser.typeId == 'merchant' || resp.data.sessionUser.typeId == 'merchant_buyer') && resp.data.sessionUser.typeCode == this.sellerId) {
								this.goShop(resp);
							} else {
								this.merchantOrbuyer(resp)

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
			},
			//q去自己的店铺
			goShop(resp) {
				this.$dialog.confirm({
					title: `欢迎您:${resp.data.sessionUser.nickName}`,
					mes: `是否去您的商铺?`,
					opts: () => {
						resp.data.sessionUser.typeId = 'merchant'
						this.$store.commit('login', resp.data.sessionUser);
						this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'));
						this.$router.push({
							name: 'Merchant',
							query: {
								sellerId: this.sellerId
							}
						})
					}
				});
			},
			merchantOrbuyer(resp, flg) {
				if(resp.data.sessionUser.typeId == 'merchant_buyer') {
					resp.data.sessionUser.typeId = 'buyer'
					this.$store.commit('login', resp.data.sessionUser);
					this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
					this.relevance();
				} else {
					var str = '该账号为供应商，请使用采购商账号登录'
					if(flg) {
						str = '你的微信绑定为供应商账号，请使用采购商账号登录'
					}
					this.$dialog.alert({
						mes: str
					});
					this.$dialog.alert({
						mes: str
					});
				}

			},
			/**
			 * 登录
			 */
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
				if(this.openId) {
					this.bindingWx()
				} else {
					if(sessionStorage.getItem('openId')) {
						this.bindingWx();
					} else {
						this.loginFun(false)
					}

				}
			},
			//是否绑定微信询问
			bindingWx() {
				this.$dialog.confirm({
					title: ' ',
					mes: `是否将${this.username}与微信绑定,方便下次直接登录!`,
					opts: [{
							txt: '否',
							color: false,
							callback: () => {
								this.loginFun(false)
							}
						},
						{
							txt: '是',
							color: true,
							callback: () => {
								this.loginFun(true);
							}
						}
					]
				});
			},
			//得到seller邀请码
			getInvitationCode() {
				this.postRequest('customer/list', {
					id: this.sellerId,
				}).then(r => {
					console.log(r)
				})
			},
			//关联
			relevance() {
				console.log(this.sellerId)
				return new Promise((resolve, reject) => {
					//查询是否已经关联
					this.postRequest('suppliercollection/getListBySellerId', {
						sellerId: this.sellerId
					}).then(res => {
						var flg = false
						for(let a = 0; a < res.data.aaData.length; a++) {
							if(res.data.aaData[a].customerId == this.$root.userInfo.typeCode) {
								flg = true;
								break
							}
						}
						if(!flg) {
							//查询商家的名称
							this.postRequest('customer/list', {
								id: this.sellerId,
							}).then(r => {
								console.log(Array.isArray(r.data.aaData))
								console.log(r.data.state == 0)
								if(r.data.state == 0 && Array.isArray(r.data.aaData)) {
									//关联
									this.postRequest('suppliercollection/updateSellerRelete', {
										sellerId: this.sellerId,
										sellerName: r.data.aaData[0].name,
										joininCustomerIdsString: this.$root.userInfo.typeCode,
										customerName: this.$root.userInfo.nickName,
										type: 1,
									}).then(re => {
										if(re.data.state == 0) {
											this.$router.push({
												name: 'Enshrine',
											})
										} else {
											this.$dialog.toast({
												mes: re.data.msg,
												timeout: 1500,
											});
											this.$store.commit('login', {});
											this.$root.userInfo = {}
										}
									})
								}

							})

						} else {
							this.$router.push({
								name: 'Enshrine',
							})
						}
					})
				})
			}
		}
	};
</script>
<style lang="scss">
	.yd-scrollview:after {
		height: 0;
	}
	
	.QRcode_login {
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
		}
	}
</style>