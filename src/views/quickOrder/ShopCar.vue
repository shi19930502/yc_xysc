<template>
	<yd-layout id="ShopCar">
		<div class="list" v-for='(item,index) in allShopArr'>
			<div>
				<div class="select_a_shop">
					<div class="select_a_shop_name">
						<van-checkbox @change='selectAll(item,item.checkAll,item.idArr)' v-model="item.checkAll"></van-checkbox>
						<div class="name">{{item.name}}&nbsp;</div>
					</div>
					<yd-icon name="delete" @click.native="delShop(item,index)" size="0.36rem"></yd-icon>
				</div>
				<div class="check_box">
					<van-checkbox-group @change='selectOne(item,item.idArr)' v-model="item.idArr">
						<van-checkbox :label-disabled='true' v-for="(list, index) in item.sp" :key="list.id" :name="list.id">
							<div class="left">
								<img v-if='list.skuPicUrl' :src="imgUrl+list.skuPicUrl" alt="" />
								<img v-else-if='list.proPicUrl' :src="imgUrl+list.proPicUrl" alt="" />
								<img v-else-if='list.catPic' :src="imgUrl+list.catPic" alt="" />
								<img v-else src="../../assets/imgs/img_moren@2x.png">
								<div class="commodity">
									<div class="commodity_1">{{list.productName}}</div>
									<div class="commodity_2">{{list.skuName}}</div>
									<div class="commodity_2" v-if='list.skuMethodType==1'>计量方式:计重</div>
									<div class="commodity_2" v-else-if='list.skuMethodType==2'>计量方式:计件</div>
									<div class="commodity_3">￥{{list.promotionPrice}}</div>
								</div>
							</div>
							<div class="numjiajian">
								<van-stepper ref='stepperBlur' @blur='inputBlur(list,list.quantity)' @plus='addPlus(list,list.quantity)' @minus='addPlus(list,list.quantity)' @change='addOrMinus(list,list.quantity,item)' :min='list.skuMethodType==1?"0.01":1' :integer='list.skuMethodType==2' v-model="list.quantity" :max="9999" />
							</div>
						</van-checkbox>
					</van-checkbox-group>
				</div>
			</div>
			<div class="small_money">
				<div class="start_amount">起配金额：<span>￥{{item.startAmount.toFixed(2)}}</span></div>
				<div>小计：<span>￥{{item.smallMoney}}</span></div>
			</div>
		</div>
		<yd-tabbar slot="tabbar" class='footer'>
			<div class="footer_c">
				<div class="footer_all">
					<div>
						<van-checkbox @change='selectAllShop(checkAllFlg)' v-model="checkAllFlg">全选</van-checkbox>
					</div>
					<div class="footer_money">
						<div class="footer_money_all">合计: <span>￥{{shopCar.shopAllMoney}}</span></div>
						<div class="shop_number">商家<span>{{shopCar.shopNum}}</span>/商品<span>{{shopCar.commodityNum}}</span></div>
					</div>
				</div>
				<div v-if='startAmountFlg' @click='goSettle' class="go_js_btn">去结算<span>({{shopCar.commodityNum}})</span></div>
				<div v-else style='background: #989E92;' @click='stopSettle' class="go_js_btn">去结算<span>({{shopCar.commodityNum}})</span></div>
			</div>
		</yd-tabbar>
	</yd-layout>
</template>

<script>
	import Vue from 'vue'
	import configs from '../../configs'
	import mixin_quick from '../../utils/mixin_quick.js'
	import { Checkbox, CheckboxGroup, Stepper } from 'vant';
	Vue.use(Checkbox).use(CheckboxGroup).use(Stepper);
	export default {
		mixins: [mixin_quick],
		data() {
			return {
				imgUrl: configs.imgURL,
				startAmountFlg: true,
				isCheckAll: false,
				allShopArr: [],
				shopName: [],
				flgAll: true,
				count: 0,
				shopNameArr: [],
				checkAllFlg: true,
				shopCar: {
					shopNum: 0,
					commodityNum: 0,
					shopAllMoney: "0.00",
				},
				startAmountMessage: [],
			}
		},
		watch: {
			allShopArr: {
				handler(val) {
					var flg = true;
					var startAmountFlg = true;
					this.startAmountMessage = []
					for(let a = 0; a < val.length; a++) {
						if(!val[a].checkAll) {
							flg = false
						}
						if(val[a].idArr.length > 0) {
							if(val[a].smallMoney < val[a].startAmount) {
								this.startAmountMessage.push(val[a])
								startAmountFlg = false
							}
						}
					}
					this.startAmountFlg = startAmountFlg
					this.checkAllFlg = flg
					this.countFooter(val);
					if(val.length <= 0) {
						this.$dialog.confirm({
							title: '购物车没有物品啦,去选购~~',
							opts: [{
								txt: '确认',
								color: true,
								callback: () => {
									//										this.$router.back();
									this.$router.push({ name: 'Enshrine' })
									window.localStorage.setItem('quickSettlementParam', '')
								}
							}, ]
						})
					}
					this.$nextTick(() => {
						//给select添加全选emmmmmmmmmmm
						for(let a = 0; a < this.$refs.stepperBlur.length; a++) {
							this.$refs.stepperBlur[a].$el.children[1].onfocus = function() {
								this.select()
							}
						}
					})
				},
				deep: true
			}
		},
		computed: {

		},
		created() {

		},
		mounted() {
			this.$store.dispatch('changeNavBarTitle', '购物车')
			this.getShopCar(true)
		},
		methods: {
			/*请求购物车数据*/
			getShopCar(flg) {
				this.quickQueryGrouplist().then((d) => {
					var allArr = []
					for(let key in d.aaData) {
						var o = {};
						o.checkAll = true
						o.flgAll = true
						o.sp = d.aaData[key]
						var arr = [];
						for(let a = 0; a < d.aaData[key].length; a++) {
							arr.push(d.aaData[key][a].id)
						}
						o.idArr = arr
						o.oldIdArr = arr
						o.smallMoney = this.countMoney(d.aaData[key])
						o.oldSmallMoney = this.countMoney(d.aaData[key])
						o.shopId = key
						allArr.push(o)
					}
					if(flg) {
						this.count = 0;
					} else {
						this.count = allArr.length;
					}
					this.getShopMessage(allArr, flg);
				})
			},
			/*请求商家信息*/
			getShopMessage(arr, flg) {
				if(this.count >= arr.length) {
					this.allShopArr = arr;
					for(let a = 0; a < this.allShopArr.length; a++) {
						this.allShopArr[a].name = this.shopNameArr[a].name
						this.allShopArr[a].startAmount = this.shopNameArr[a].startAmount
					}
					console.log('all', this.allShopArr)
				} else if(flg) {
					this.postRequest('customer/queryById', {
						id: arr[this.count].shopId,
					}).then(resp => {
						this.postRequest('quotation/listWithCount', {
							customerId: arr[this.count].shopId,
							buyersId: this.$root.userInfo.typeCode
						}).then(res => {
							var obj = {
								startAmount: 0,
								name: ''
							}
							if(res.data.aaData.length > 0) {
								obj.startAmount = res.data.aaData[0].startAmount
							}
							if(resp.data.aaData != null) {
								obj.name = resp.data.aaData.name
								this.shopNameArr.push(obj)
								this.count++
									this.getShopMessage(arr, flg)
							} else {
								this.$dialog.alert({ mes: `未请求到id为:${ arr[this.count].shopId}的店铺信息` });
							}
						})
					})
				}
			},
			//店铺全选
			selectAll(item, checkAll, val, index) {
				if(!checkAll) {
					if(item.flgAll) {
						item.idArr = []
						item.smallMoney = '0.00'
					}
				} else {
					item.flgAll = true
					item.idArr = item.oldIdArr
					item.smallMoney = item.oldSmallMoney
				}
			},
			//店铺单选
			selectOne(item, val, index) {
				//				item.oldIdArr.length
				if(val.length == item.oldIdArr.length) {
					item.checkAll = true
				} else {
					item.checkAll = false
					item.flgAll = false;
					var arr = []
					if(val.length > 0) {
						for(let a = 0; a < val.length; a++) {
							for(let b = 0; b < item.sp.length; b++) {
								if(val[a] == item.sp[b].id) {
									arr.push(item.sp[b])
								}
							}
						}
						item.smallMoney = this.countMoney(arr)
					} else {
						item.smallMoney = '0.00'
					}
				}
			},
			//防止2.3-1=1.299
			addPlus(d, val) {
				console.log(d, val)
				d.quantity = parseFloat(val).toFixed(2)
			},
			inputBlur(d, val, item) {
				d.quantity = parseFloat(d.quantity)
				d.quantity = d.quantity.toFixed(2)
			},
			//加减
			addOrMinus(d, val, item) {
				val = parseFloat(val).toFixed(2)
				var param = {
					buyerId: d.buyerId,
					productId: d.productId,
					productName: d.productName,
					skuId: d.skuId,
					skuName: d.skuName,
					quantity: val,
					comment: d.comment,
					sellerId: d.sellerId,
					id: d.id
				}

				this.postRequest('shippingcar/update', param).then(resp => {
					if(resp.data.state == 0 && resp.data.msg == 'success') {
						//this.getShopCar()
						//当加减商品的时候选择
						var isSelect = true;
						for(let a = 0; a < item.idArr.length; a++) {
							if(item.idArr[a] == d.id) {
								isSelect = false;
								break
							}
						}
						if(isSelect) {
							item.idArr.push(d.id)
						}
						var money = 0
						for(let m = 0; m < item.idArr.length; m++) {
							for(let n = 0; n < item.sp.length; n++) {
								if(item.idArr[m] == item.sp[n].id) {
									console.log(money, val, item.sp[n].promotionPrice)
									money += item.sp[n].quantity * parseFloat(item.sp[n].promotionPrice)
								}
							}
						}
						item.smallMoney = item.oldSmallMoney = money.toFixed(2)
					} else {
						if(resp.data.msg == '没有要修改的记录！' && resp.data.state == 2) {

						} else {
							this.$dialog.notify({
								mes: resp.data.msg,
								timeout: 2000,
								callback: () => {
									this.getShopCar()
								}
							});
						}

					}
				})
			},
			countMoney(arr) {
				var money = '0.00';
				for(let a = 0; a < arr.length; a++) {
					money = parseFloat(money) + parseFloat(arr[a].promotionPrice) * parseFloat(arr[a].quantity)
				}
				return money.toFixed(2)
			},
			//删除商品
			delShop(item, index) {
				if(item.idArr.length > 0) {
					this.$dialog.confirm({
						title: '确定移除所选商品？',
						opts: () => {
							this.postRequest('shippingcar/delete', {
								id: item.idArr,
							}).then(resp => {
								if(item.checkAll) {
									//this.getShopCar(true);
									this.allShopArr.splice(index, 1)
								} else {
									var money = 0
									console.log(item.idArr.length)
									console.log(item.sp.length)
									for(let a = 0; a < item.idArr.length; a++) {
										console.log(item.idArr.length)
										for(let b = 0; b < item.sp.length; b++) {
											if(item.sp[b].id == item.idArr[a]) {
												item.sp.splice(b, 1)
												item.idArr.splice(a, 1)
												item.oldIdArr.splice(b, 1)
												a--
												b--
											}
										}
									}
									console.log(item.oldIdArr)
									item.smallMoney = money.toFixed(2);
									item.oldSmallMoney = 0
									for(let x = 0; x < item.sp.length; x++) {
										item.oldSmallMoney += item.sp[x].promotionPrice * item.sp[x].quantity
									}
									item.oldSmallMoney = item.oldSmallMoney.toFixed(2)

									//this.getShopCar();
								}
								//this.getShopCar(true);
							})
						}
					});

				} else {
					this.$dialog.notify({
						mes: '请选择需要移除的商品~~',
						timeout: 2000,
						callback: () => {
							//	                        console.log('我走咯！');
						}
					});
				}
			},
			//footerAll
			selectAllShop(val) {
				if(val) {
					for(let a = 0; a < this.allShopArr.length; a++) {
						this.allShopArr[a].checkAll = true
					}
				} else {
					var arrFlg = [];
					for(let a = 0; a < this.allShopArr.length; a++) {
						if(this.allShopArr[a].checkAll) {
							arrFlg.push(this.allShopArr[a].checkAll)
						}
					}
					if(arrFlg.length == this.allShopArr.length) {
						for(let a = 0; a < this.allShopArr.length; a++) {
							this.allShopArr[a].checkAll = false;
						}
					}
				}
			},
			//计算结算
			countFooter(val) {
				this.shopCar = {
					shopNum: 0,
					commodityNum: 0,
					shopAllMoney: "0.00",
				}
				for(let a = 0; a < val.length; a++) {
					this.shopCar.shopAllMoney = (parseFloat(this.shopCar.shopAllMoney) + parseFloat(val[a].smallMoney)).toFixed(2)
					if(val[a].idArr.length > 0) {
						this.shopCar.shopNum++
					}
					this.shopCar.commodityNum += val[a].idArr.length
				}
			},
			stopSettle() {
				console.log(this.startAmountMessage)
				var msg = ''
				for(let a = 0; a < this.startAmountMessage.length; a++) {
					msg += this.startAmountMessage[a].name + '订单金额小于起配金额 <br/>'
				}
				this.$dialog.alert({ mes: msg })
			},
			//去结算页面
			goSettle() {
				var flg = false
				for(let a = 0; a < this.allShopArr.length; a++) { //不这样会this.allShopArr会watch
					if(this.allShopArr[a].idArr.length > 0) {
						flg = true
						break
					}
				}
				if(!flg) {
					this.$dialog.alert({
						mes: '请选择需要结算的商品~~'
					})
				} else {
					var arr = [];
					for(let m = 0; m < this.allShopArr.length; m++) {
						arr.push(this.allShopArr[m])
					}
					console.log(this.allShopArr)
					for(let a = 0; a < arr.length; a++) { //循环arr
						if(arr[a].idArr.length>0) {
							var spArr = []
							var money = '0.00'
							var obj = {}
							for(let b = 0; b < arr[a].sp.length; b++) {
								for(let c = 0; c < arr[a].idArr.length; c++) {
									if(arr[a].sp[b].id == arr[a].idArr[c]) {
										spArr.push(arr[a].sp[b]) //不这样会this.allShopArr会watch
										money = (parseFloat(money) + parseFloat(arr[a].sp[b].promotionPrice) * parseFloat(arr[a].sp[b].quantity)).toFixed(2)
									}
								}
							}
							arr[a].spArr = spArr
							arr[a].settleMoney = money
							arr[a].comment = '';
							arr[a].timeObj = {
								distributionType: 1,
								distributionTimeEnd: '',
								distributionTimeBegin: '',
								date: '',
								distributionToday: '',
								dateDayArrIndex: 0,
								dateTimeArrIndex: 0,
							}
						}else{
							arr.splice(a,1)
						}
					}
					localStorage.setItem('quickSettlementParam', JSON.stringify(arr))
					this.$router.push({ name: 'settleAccounts' })
				}
			},
		}
	}
</script>

<style lang='scss'>
	#ShopCar {
		.list {
			margin: 0 0 .2rem 0;
			background: white;
		}
		.select_a_shop {
			padding: .28rem .24rem;
			display: flex;
			align-items: center;
			background: white;
			justify-content: space-between;
			.select_a_shop_name {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				font-size: .28rem;
				color: #2F3927;
				.name {
					margin: 0 0 0 .27rem;
					font-weight: 700;
				}
			}
		}
		.check_box {
			box-sizing: border-box;
			background: white;
			padding: 0 .24rem;
			.van-checkbox {
				display: flex;
				align-items: center;
				padding: .3rem 0;
				border-bottom: 1px solid #D6D6D6;
			}
			/*.van-checkbox:last-child{
				border-bottom: none ;
			}*/
			img {
				width: 1.28rem;
				height: 1.28rem;
			}
			.van-checkbox__label {
				display: flex;
				width: 2rem;
				flex-grow: 1;
				justify-content: space-between;
				.left {
					display: flex;
					width: 2rem;
					flex-grow: 1;
					.commodity {
						padding: 0 .24rem;
						line-height: .4rem;
						color: #2F3927;
						font-size: .3rem;
						.commodity_1 {
							font-weight: 700;
						}
						.commodity_2 {
							color: #797D77;
							font-size: .2rem;
						}
						.commodity_3 {
							padding: .2rem 0 0rem 0;
							color: #FF3D15;
							font-weight: 700;
						}
					}
				}
			}
			.numjiajian {
				width: 2.32rem;
				flex-grow: 0;
			}
		}
		.select_list {
			background: white;
			label {
				display: block;
			}
		}
		.small_money {
			display: flex;
			font-size: .28rem;
			color: #2F3927;
			justify-content: space-between;
			align-items: center;
			padding: .3rem .3rem;
			font-weight: bold;
			span {
				font-size: .3rem;
				color: #FF3D15;
				font-weight: 700;
			}
		}
		.footer_c {
			/*position: fixed;*/
			/*bottom: 0;*/
			width: 100%;
			max-width: 750px;
			height: .98rem;
			display: flex;
			background: white;
			align-items: center;
			justify-content: space-between;
			padding: .1rem 0 0.1rem .24rem;
			color: #2F3927;
			.footer_all {
				display: flex;
				align-items: center;
				.footer_money {
					padding: 0 .24rem;
					.footer_money_all {
						font-size: .36rem;
						span {
							font-weight: 700;
							color: #FF3D15;
						}
					}
					.shop_number {
						font-size: .2rem;
						color: #797D77;
					}
				}
			}
			.go_js_btn {
				background: #FE971D;
				color: white;
				font-size: .36rem;
				height: .98rem;
				line-height: .98rem;
				padding: 0 .53rem;
				span {
					font-size: .28rem;
				}
			}
		}
	}
</style>