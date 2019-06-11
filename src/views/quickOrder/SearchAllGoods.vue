<template>
	<yd-layout v-if='isSearch' id="search_all_goods">
		<div slot='top' class="search_input search_input_popup gradient search_input_children_fixed">
			<input class="search_input_children " ref='searchRef' type="text" placeholder="搜索商品" v-model='searchInputVal' />
			<div class="close_popup" @click="cancle">关闭</div>
		</div>
		<yd-pullrefresh :callback="loadList" ref="pullrefreshDemo">
		<yd-infinitescroll :callback="getProductcollection" ref="searchAllGoods">
			<ul class="list" slot="list">
				<!--:key="d.id"-->
				<li v-for="(d,index) in productcollection">
					<div class="flex flex-x-between flex-y-center">
						<div class="list-img">
							<img v-if="d.isCollection==0&&$root.userInfo.typeId=='buyer'" src="../../assets/imgs/sc-icon.png" class="scpic" @click="createProductcollection(d,index,productcollection)">
							<img v-if="d.isCollection==1&&$root.userInfo.typeId=='buyer'" src="../../assets/imgs/sc-icon_a.png" class="scpic" @click="createProductcollection(d,index,productcollection)">
							<img v-if="d.skuPic" :src="imgURL + d.skuPic ">
							<img v-else-if="d.proPic" :src="imgURL + d.proPic ">
							<img v-else-if="d.catPic" :src="imgURL + d.catPic ">
							<img v-else-if="d.skuPicUrl" :src="imgURL + d.skuPicUrl ">
							<img v-else src="../../assets/imgs/img_moren@2x.png">
							<!--<div v-if='d.stockLimit==1&&d.canUseQuantity==0' class="quehuo">
										缺货
									</div>-->
						</div>
						<div class="flex-item-5 time">
							<p class="name_1"><strong>{{d.productName}}-{{d.skuName}}&nbsp;[{{d.skuMethodType==2?d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName:d.proMeasureName}}]</strong></p>
							<p class="name_2">{{d.f_created_person_name}}</p>
							<p v-if='d.skuMethodType==1'>计量方式:计重</p>
							<p v-else-if='d.skuMethodType==2'>计量方式:计件</p>
							<p v-if='d.stockLimit==1&&d.canUseQuantity==0'>库存较少</p>
							<p v-else-if='d.stockLimit==0'>库存充足</p>
							<p v-else>库存量:{{(d.canUseQuantity/100).toFixed(2)}}</p>
							<p v-if='d.f_price-d.promotionPrice>0'>
								<span class="name_3">促销</span>
								<span :style="name_4Style(d.f_price-d.promotionPrice>0)">
											<span>￥</span>{{d.f_price}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
								</span>
							</p>
							<div class="name_4">
								<div v-if='d.f_price-d.promotionPrice>0'>
									<span>￥</span>{{d.promotionPrice}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
								</div>
								<div v-else>
									<span>￥</span>{{d.f_price}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
								</div>
							</div>
						</div>
						<div class="flex-item-3 settleMoney tar">
							<template v-if='d.quantity==""||d.quantity>0'>
								<img @click='countQuantity(d,index,0,true)' class="minus" src="../../assets/imgs/caigou_icon_jian.png">
								<yd-input max='6' :on-focus='focusSelectAll' @change.native="countQuantity(d,index,2,true)" type="number" class='input' v-model="d.quantity" :show-clear-icon='false' :show-success-icon='false' :show-error-icon='false'></yd-input>
							</template>
							<img @click='countQuantity(d,index,1,true)' class="add" src="../../assets/imgs/caigou_icon_add.png">
						</div>
					</div>
				</li>
			</ul>
			<span slot="doneTip">没有更多商品啦~~</span>
		</yd-infinitescroll>
		</yd-pullrefresh>
		<!--<div style="width: 100%;height: .98rem;background: transparent;" class="kong_div"></div>-->
		<yd-tabbar slot="tabbar" class='footer'>
			<div class="go_shop_car">
				<div class="go_shop_car_top">
					<div class="all_money">￥{{shopCar.shopMoney}}</div>
					<div class="shop_number"><span>商家{{shopCar.shopNum}}</span><span class="xiexian">/</span><span>商品{{shopCar.commodityNum}}</span></div>
				</div>
				<div @click='goShopCar' class="go_shop_car_btn">购物车<span>({{shopCar.commodityNum}})</span></div>
			</div>
		</yd-tabbar>
	</yd-layout>
</template>

<script>
	import addShop from '../../utils/mixin_addShop.js'
	import configs from '../../configs'
	export default {
		mixins: [addShop],
		data() {
			return {
				searchInputVal: '',
				productcollection: [],
				isSearch: false,
				imgURL: configs.imgURL,
			}
		},
		watch: {
			searchInputVal(val) {
				this.productcollection = []
				this.pageNum = 1
				this.$refs.searchAllGoods.$emit('ydui.infinitescroll.reInit');
				this.getProductcollection(true)
			},
		},
		created() {
			//直接回到收藏页面
			//			if(!this.$route.params.isSearch) {
			//				this.$router.push({ name: 'Enshrine' })
			//			}else{
			//				this.isSearch=true
			//				this.getQueryGrouplist()
			//			}
			this.$store.dispatch('changeNavBarTitle', '搜索商品')
			this.isSearch = true
			this.getQueryGrouplist()
		},
		mounted() {

		},
		methods: {
			cancle() {
				//				this.$router.back()
				this.$router.push({ name: 'Enshrine' })
			},
			loadList(){
				this.pageNum = 1
				this.productcollection=[]
				this.$refs.searchAllGoods.$emit('ydui.infinitescroll.reInit');
				this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
				this.getQueryGrouplist()
			},
			/**
			 * 收藏商品
			 */
			createProductcollection(d, index, arr) {
				console.log(d)
				if(d.isCollection == 0) {
					var param = {
						customerId: this.$root.userInfo.typeCode - 0,
						sellerId: d.supplierId,
						sellerName: d.supplierName,
						productId: d.productId,
						productName: d.productName,
						skuId: d.skuId,
						skuName: d.skuName,
					}
					this.postRequest('Productcollection/create', param).then(d => {
						if(d.data && d.data.state == 0) {
							this.$dialog.toast({
								mes: '收藏成功',
								timeout: 1200,
								icon: 'success',
								callback: () => {
									//this.getProductList(this.searchValue)
									this.$set(arr[index], 'isCollection', 1)
								}
							});
						} else {
							if(d.data.msg=='已收藏的记录！'){
								this.$set(arr[index], 'isCollection', 1)
								this.$dialog.toast({
				                    mes: '该商品已被收藏过了，推荐刷新页面查看商品状态！',
				                    timeout: 1500
				                });
							}else{
								this.$dialog.alert({
									mes: d.data.msg
								})
							}
						}
					})
				} else {
					this.postRequest('productcollection/deleteByCustomerIdAndSkuId', {
						customerId: this.$root.userInfo.typeCode - 0,
						skuId: d.skuId
					}).then(d => {
						if(d.data && d.data.state == 0) {
							this.$dialog.toast({
								mes: '取消收藏',
								timeout: 1200,
								icon: 'success',
								callback: () => {
									//this.getProductList(this.searchValue)
									this.$set(arr[index], 'isCollection', 0)
								}
							});
						} else {
							if(d.data.msg=='没有要删除的记录！'){
								this.$dialog.toast({
				                    mes: '该商品已被取消收藏，推荐刷新页面查看商品状态！',
				                    timeout: 1500
				                });
								this.$set(arr[index], 'isCollection', 0)
							} else{
								this.$dialog.alert({
									mes: d.data.msg
								})
							}
						}
					})
				}
			},
		},
	}
</script>

<style lang="scss">
	#search_all_goods {
		.search_input {
			width: 100%;
			box-sizing: border-box;
			padding: .08rem .25rem;
			/*background: #80C551;*/
			.search_input_children {
				border-radius: .08rem;
				border: 1px solid white;
				width: 100%;
				padding: .15rem;
				font-size: .28rem;
				color: #2F3927;
				text-indent: .5rem;
				width: 100%;
				background-color: white;
				background-image: url(../../assets/imgs/fangdajing.png);
				background-repeat: no-repeat;
				background-size: contain;
				background-size: .4rem .4rem;
				background-position: .1rem .12rem;
			}
		}
		.search_input_popup {
			/*position: fixed;*/
			z-index: 9999;
			top: 0;
			display: flex;
			align-items: center;
			padding: .08rem 0 .08rem .25rem;
			.search_input_children {
				width: 5rem;
				flex-grow: 1;
			}
			.close_popup {
				font-size: .32rem;
				text-align: center;
				color: white;
				width: 1rem;
				flex-grow: 0;
			}
		}
		ul.list {
			li {
				padding: 0.25rem;
				border-bottom: 1px solid #ddd;
				.list-img {
					position: relative;
					flex-grow: 0;
					width: 1.52rem;
					margin-right: 0.25rem;
					width: 1.52rem;
					position: relative;
					height: 1.52rem;
					img {
						width: 100%;
						height: 100%;
					}
					img.scpic {
						position: absolute;
						top: 0;
						width: 0.32rem;
						height: 0.36rem;
					}
					.quehuo {
						width: 1.52rem;
						height: 1.52rem;
						text-align: center;
						line-height: 1.52rem;
						color: white;
						z-index: 12;
						background: rgba(0, 0, 0, 0.5);
						position: absolute;
						top: 0;
					}
				}
				.time,
				.tar {
					width: 2rem;
				}
				p {
					line-height: .4rem;
				}
				p.name {
					font-size: 0.27rem;
					padding-bottom: 0.06rem;
				}
				.name_1 {
					color: #2F3927;
					font-size: .3rem;
				}
				.name_2 {
					color: #797D77;
					font-size: .2rem;
				}
				.name_3 {
					display: inline-block;
					padding: .03rem;
					margin: 0 0 .11rem 0;
					font-size: .2rem;
					line-height: .24rem;
					color: white;
					border-radius: 2px;
					background: -webkit-linear-gradient(180deg, #FF3D15, #FF7316);
					/* Safari 5.1 - 6.0 */
					background: -o-linear-gradient(180deg, #FF3D15, #FF7316);
					/* Opera 11.1 - 12.0 */
					background: -moz-linear-gradient(180deg, #FF3D15, #FF7316);
					/* Firefox 3.6 - 15 */
					background: linear-gradient( 180deg, #FF3D15, #FF7316);
					/* 标准的语法 */
				}
				.name_4 {
					color: #FF3D15;
					font-size: .32rem;
					line-height: .4rem;
					display: flex;
					font-weight: 700;
					span {
						font-size: .24rem;
						padding-right: .03rem;
					}
					.name_4_span {
						color: #797D77;
						font-weight: 500;
					}
				}
			}
			background: #fff;
		}
		.settleMoney {
			display: flex;
			justify-content: flex-end;
			img {
				width: .56rem;
				height: .56rem;
			}
			.input {
				width: 1.1rem;
				height: .56rem;
				background: rgba(242, 242, 242, 1);
				border-radius: 4px;
				text-align: center;
				input {
					text-align: center;
				}
			}
		}
		.contact_sj {
			width: 1.4rem;
			height: .36rem;
			display: flex;
			border: 1px solid #4D7BFE;
			border-radius: .04rem;
			align-items: center;
			margin: .1rem;
			img {
				width: .2rem;
				height: .2rem;
				margin-left: .01rem;
			}
		}
		.go_shop_car {
			display: flex;
			align-items: center;
			padding: 0 0 0 .31rem;
			width: 100%;
			max-width: 750px;
			height: .98rem;
			background: rgba(59, 110, 17, 0.2);
			background: white;
			z-index: 99999;
			.go_shop_car_top {
				width: 4rem;
				flex-grow: 1;
				align-items: center;
				display: flex;
				.all_money {
					color: #FF3D15;
					font-size: .36rem;
					margin: 0 .18rem 0 0;
					font-weight: 700;
				}
				.shop_number {
					/*width: 1.35rem;*/
					font-size: .2rem;
					color: #797D77;
					display: flex;
					align-items: center;
					.xiexian {
						font-size: .3rem;
						padding: .05rem;
						/*font-weight: bold;*/
					}
				}
			}
			.go_shop_car_btn {
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
		.footer {
			footer {
				padding: 0;
			}
		}
	}
</style>