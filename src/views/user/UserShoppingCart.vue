<template>
	<yd-layout>
		<div id="UserShoppingCart">
			<template v-if="dataList.length>0">
				<div class="cart-group" v-for="d in dataList" v-if="d.sellerProducts.length > 0">
					<div class="head flex flex-x-between flex-y-center">
						<div class="flex flex-y-center" @click="toShopEvaluate(d)">
							<strong>{{d.storeInfo.storeName}}</strong>
							<yd-navbar-next-icon></yd-navbar-next-icon>
						</div>
						<div>
							<yd-icon @click.native="del(d.sellerInfo.sellerId)" name="delete" size="0.4rem"></yd-icon>
						</div>
					</div>
					<ul class="list">
						<li v-for="item in d.sellerProducts" class="flex flex-y-center">
							<div class="img">
								<img v-if="item.skuPicUrl" :src="imgURL+item.skuPicUrl">
								<img v-else-if="item.proPicUrl" :src="imgURL+item.proPicUrl">
								<img v-else src="../../assets/imgs/img_moren@2x.png">
							</div>
							<div class="flex-item-6">
								<p>{{item.productName+'['+item.skuName+']'}}</p>
								<div class="flex flex-x-between">
									<span style="color:#989E92">{{'x'+item.quantity}}</span>
									<span class="price" v-if="item.promotionPrice>0 && item.promotionBasePrice>0">{{'￥'+item.promotionPrice*100*item.quantity/100}}</span>
									<span class="price" v-else>{{'￥'+item.price*100*item.quantity/100}}</span>
								</div>
							</div>
						</li>
					</ul>
					<div class="js flex flex-y-center flex-x-end">
						<span>合计</span>
						<span class="price">{{'￥'+d.orderTotal}}</span>
						<div class="btn" @click="toOrderSettlement(d)">去结算</div>
					</div>
				</div>
			</template>
			<div v-else class="empty">购物车什么都还没有~~ </div>
		</div>
	</yd-layout>
</template>

<script>
	import mixin from '../../utils/mixin.js'
	import mixin_store from '../../utils/mixin_store.js'
	import mixin_shop from '../../utils/mixin_shop.js'

	export default {
		mixins: [mixin, mixin_store, mixin_shop],
		data() {
			return {
				sellerList: [],
				dataList: [],
				orderTotal: 0
			}
		},
		created() {

			this.getSellers()
			this.getStoreCar()

		},
		mounted() {

		},
		methods: {
			/**
			 * 查看店铺详情
			 */
			toShopEvaluate(d) {
				this.$router.push({
					name: 'ShopDetails',
					query: {
						sellerid: d.sellerInfo.sellerId
					}
				})
			},
			/**
			 * 结算
			 */
			toOrderSettlement(d) {
				for(var i in d.sellerProducts) {
					d.sellerProducts[i].btnText = '备注'
					d.sellerProducts[i].showRemarks = false
				}
				var settlementParam = {
					settlementGoods: d.sellerProducts,
				}
				var priceTotal = this.getOrderTotal(d.sellerProducts).priceTotal;
				var quantityTotal = this.getOrderTotal(d.sellerProducts).quantityTotal;
				this.$dialog.confirm({
					title: d.storeInfo.storeName,
					mes: `共${d.sellerProducts.length}件商品,总数量${quantityTotal},总价:￥${priceTotal}`,
					opts: () => {
						localStorage.setItem('settlementParam', JSON.stringify(settlementParam))
						this.$router.push({
							name: 'OrderSettlement',
							query: {
								sellerId: d.sellerInfo.sellerId,
								sellerName: d.storeInfo.storeName,
								distributionType: d.storeInfo.distributionToday
							}
						})
					}
				});
			},
			/**
			 * 删除购物车
			 */
			del(sellerId) {
				this.$dialog.confirm({
					title: '提示',
					mes: '该操作不可逆，是否继续',
					opts: () => {
						this.postRequest('shippingcar/queryGrouplist', {
							buyerId: this.userInfo.typeCode,
							sellerId: sellerId
						}).then(d => {
							if(d.data && d.data.state == 0) {
								for(var i in d.data.aaData) {
									if(sellerId == i) { //如果卖家id等于购物车中的卖家id就删除
										var items = d.data.aaData[i]
										for(var j in items) {
											this.deleteShopCarById(items[j].id)
										}
									}
								}
							}
						})
					}
				});
			},
			/**
			 * 删除购物车byId
			 */
			deleteShopCarById(id) {
				this.postRequest('shippingcar/delete', {
					id: id
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.getStoreCar()
					}
				})
			},
			/**
			 * 获取购物车store
			 */
			getStoreCar() {
				this.postRequest('shippingcar/queryGrouplist', {
					buyerId: this.userInfo.typeCode,
				}).then(d => {
					if(d.data && d.data.state == 0) {
						var arr = []
						for(var i in d.data.aaData) {
							for(var j in this.sellerList) {
								if(this.sellerList[j].sellerId == i - 0) {
									(function(i, j) {
										this.getStore(this.sellerList[j].sellerId, (storeInfo) => {
											var o = {
												sellerInfo: this.sellerList[j],
												sellerProducts: d.data.aaData[i],
												orderTotal: this.getOrderTotal(d.data.aaData[i]).priceTotal,
											}
											o.storeInfo = storeInfo
											console.log(o)
											arr.push(o)

										})
									}.bind(this))(i, j)
								}
							}
						}
						this.dataList = arr
					}
				})
			},
			/**
			 * 获取登录用户的供应商列表
			 */
			getSellers() {
				this.postRequest('suppliercollection/querySellerByCustomerId', {
					customerId: this.userInfo.typeCode
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						this.sellerList = resp.data.aaData
					}
				})
			},
		}
	};
</script>
<style lang="scss">
	#UserShoppingCart {
		.yd-back-icon:before,
		.yd-next-icon:before {
			font-size: 0.3rem;
		}
		.cart-group {
			margin-bottom: 0.3rem;
			background: #fff;
			.head {
				padding: 0.2rem 0.25rem;
				border-bottom: 1px solid #ddd;
				strong {
					margin-top: -0.05rem;
					font-size: 0.3rem;
					margin-right: 0.1rem;
				}
			}
			ul.list {
				padding-left: 0.24rem;
				border-bottom: 1px solid #d9d9d9;
				li {
					border-bottom: 1px solid #d9d9d9;
					padding: 0.1rem 0.25rem 0.1rem 0;
					.img {
						height: 0.8rem;
						width: 0.8rem;
						border-radius: 2px;
						margin-right: 0.2rem;
						overflow: hidden;
						img {
							width: 100%;
							height: 100%;
						}
					}
					p {
						margin: 0.08rem 0;
					}
					.price {
						font-size: 0.3rem;
						color: #FF6A16;
						font-weight: 700;
					}
				}
				li:last-child {
					border-bottom: none;
				}
			}
			.js {
				padding: 0.25rem;
				.btn {
					background: #6FB138;
					font-size: 0.25rem;
					color: #fff;
					padding: 0.1rem 0.15rem;
					border-radius: 3px;
				}
				.price {
					font-size: 0.35rem;
					color: #FF6A16;
					font-weight: 600;
					margin-right: 0.1rem;
				}
			}
		}
	}
</style>