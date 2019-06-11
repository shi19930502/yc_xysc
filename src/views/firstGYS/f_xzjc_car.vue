<template>
	<yd-layout id='fXzjcCar'>
		<div slot='top' class="header">
			<div>
				<a href="#/f_jcgl" class="header_left">进场管理</a>
			</div>
			<div class="name">车辆预告</div>
			<div></div>
		</div>
		<div class="content">
			<div class="c_top">
				<div class="circle"></div>
				<input class="car_input" placeholder="请输入车牌号，如川A12345(必选)" v-model="carVal" />
			</div>
			<!--merchant-->
			<div class="c_bottom" v-if='$root.userInfo.typeId=="market"'>
				<div class="circle"></div>
				<div class="select_father">
					<select class="select_merchant" name="" id="" v-model='selectVal'>
						<option disabled selected value="">请选择商户(必选)</option>
						<option v-for='item in dataList' :value="item.code+'&'+item.name">{{item.name}}</option>
					</select>
					<img class="img_right" src="../../assets/imgs/list_icon_right.png" alt="" />
				</div>
			</div>
			<div class="c_save" @click='save'>
				{{$root.userInfo.typeId=="market"?"下一步":"确认"}}
			</div>
		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				carVal: '',
				selectVal: '',
				customer: {},
				dataList: []
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '新增进场')
			if(this.$root.userInfo.typeId == "market") {
				this.init()
			} else {
				this.getCustomer()
			}

		},
		watch: {

		},
		computed: {

		},
		mounted() {

		},
		methods: {
			getCustomer() {
				this.postRequest('customer/queryById', {
					id: this.$root.userInfo.typeCode
				}).then(resp => {
					if(resp.data.state == 0) {
						this.customer = resp.data.aaData
					}
				})
			},
			init() {
				this.postRequest('customer/queryPageByChannelCode', {
					enabled: 1,
					pageNum: 0,
					pageSize: 0,
					customerType: 'merchant',
				}).then(resp => {
					if(resp.data.state == 0) {
						this.dataList = resp.data.aaData
					}
					console.log(this.dataList)

				})
			},
			save() {
				if(!this.carVal) {
					this.$dialog.toast({
						mes: '请输入车牌号-_-!',
						timeout: 1500
					});
					return
				}
				if(!this.$root.carReg(this.carVal)){
					this.$dialog.toast({
						mes: '请输正确的车牌号-_-!',
						timeout: 1500
					});
					return
				}
				var params = {
					channelCode: this.$root.userInfo.typeCode,
					areaName: '',
					baseName: '',
					wholesaleMarketName: '北环批发市场',
					wholesaleMarketId: '510100002',
					wholesalerId: '',
					wholesalerName: '',
					voucherType: '',
					voucherPic: '',
					tranId: '',
					transporterId: this.carVal,
					inmarketdetailList: '',
				}

				//merchant
				if(this.$root.userInfo.typeId == "market") {
					if(this.selectVal) {
						params.wholesalerId = this.selectVal.split('&')[0]
						params.wholesalerName = this.selectVal.split('&')[1]
					} else {
						this.$dialog.toast({
							mes: '请选择商户-_-!',
							timeout: 1500
						});
					}
					return
					params.statusId = 2
				} else {
					params.wholesalerId = this.customer.code
					params.wholesalerName = this.customer.name
					params.statusId = 0
				}
				this.saveAjax(params)
			},
			saveAjax(params) {
				this.$dialog.loading.open('数据保存中...');
				this.postRequest('inmarketmain/save', params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0) {
						this.$router.push({
							name: 'f_jcgl'
						})
					} else {
						this.$dialog.toast({
							mes: '保存失败',
							timeout: 1500,
							icon: 'error',
							callback: () => {

							}
						});
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	#fXzjcCar {
		background: white;
		line-height: .4rem;
		.header {
			.header_left {
				width: 100%;
			}
		}
		.content {
			.circle {
				width: .24rem;
				height: .24rem;
				border-radius: 50%;
				border: 2px solid #018BE6;
				flex-grow: 0;
			}
			.car_input {
				outline: none;
				border: none;
				flex-grow: 1;
				width: 3rem;
				font-size: .32rem;
				margin-left: .21rem;
				font-weight: bold;
				font-family: 'PingFang-SC-Bold';
			}
			.select_merchant {
				outline: none;
				border: none;
				flex-grow: 1;
				width: 3rem;
				width: 100%;
				font-size: .32rem;
				margin-left: .21rem;
				font-weight: bold;
				font-family: 'PingFang-SC-Bold';
				color: #848484;
			}
			.c_top,
			.c_bottom {
				display: flex;
				align-items: center;
				height: 1.35rem;
				margin-left: .22rem;
				padding-right: .22rem;
				border-bottom: 1px solid #DDDDDD;
			}
			.c_bottom {
				position: relative;
				.select_father {
					flex-grow: 1;
					width: 3rem;
					transition: 5s all initial;
					position: relative;
				}
				.circle {
					border: 2px solid #45A62A;
				}
				.img_right {
					width: .17rem;
					height: .28rem;
					position: absolute;
					right: .22rem;
					right: 0;
					top: .07rem;
				}
			}
			.c_save {
				background: #018BE6;
				width: 6.9rem;
				height: .8rem;
				line-height: .8rem;
				margin: auto;
				text-align: center;
				color: white;
				font-size: .32rem;
				margin-top: .4rem;
				border-radius: .1rem;
			}
		}
	}
</style>