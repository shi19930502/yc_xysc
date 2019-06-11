<template>
	<yd-layout v-if='cs' class="Enshrine">
		<div v-show='isShowAll' slot='top' :style="{justifyContent:isShowSearch?'normal': 'space-around'}" class="search_input search_input_popup gradient">
			<!--isShowSearch-->
			<input v-if='isShowSearch' class="search_input_children" type="text" @focus='inputFocus' placeholder="查看所有商品" :value='inputVal' />
			<div :style="{width:isShowSearch?'': '100%'}" class="close_popup" @click="selectLogin">注销</div>
			<!--<yd-icon name="type" @click.native='selectLogin' class="close_popup" size=".42rem" color="#FFFFFF"></yd-icon>-->
		</div>
		<div v-show='searchPopup' class="search_input search_input_popup gradient search_input_children_fixed">
			<input @focus='searchFocus' @blur='searchBlur' class="search_input_children " ref='searchRef' type="text" placeholder="搜索商品" v-model='searchInputVal' />
			<div class="close_popup" @click="closePopup">关闭</div>
		</div>

		<yd-popup v-model="searchPopup" position="bottom" height="100%">
			<div v-show='searchPopup' style="width: 100%;height: .88rem;"></div>
			<yd-infinitescroll v-if="searchPopup" :callback="getProductcollection" ref="searchAllGoods">
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
								<p v-if='d.price-d.promotionPrice>0'>
									<span class="name_3">促销</span>
									<span :style="name_4Style(d.price-d.promotionPrice>0)">
											<span>￥</span>{{d.price}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
									</span>
								</p>
								<div class="name_4">
									<div v-if='d.price-d.promotionPrice>0'>
										<span>￥</span>{{d.promotionPrice}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
									</div>
									<div v-else>
										<span>￥</span>{{d.price}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
									</div>
								</div>
							</div>
							<div class="flex-item-3 settleMoney tar">
								<template v-if='d.quantity==""||d.quantity>0'>
									<img @click='countQuantity(d,index,0,true)' class="minus" src="../../assets/imgs/caigou_icon_jian.png">
									<yd-input max='6' :on-focus='focusSelectAll' :on-blur='blurMouse' @change.native="countQuantity(d,index,2,true)" type="number" class='input' v-model="d.quantity" :show-clear-icon='false' :show-success-icon='false' :show-error-icon='false'></yd-input>
								</template>
								<img @click='countQuantity(d,index,1,true)' class="add" src="../../assets/imgs/caigou_icon_add.png">
							</div>
						</div>
					</li>
				</ul>
				<span slot="doneTip">没有更多商品啦~~</span>
			</yd-infinitescroll>
		</yd-popup>
		<menuTab slot='top' :item-click="menuclick" :dataList="menu"></menuTab>
		<ul class="list" v-show="showSellerList&&isShowAll" v-if="sellerList.length>0">
			<li v-for="(d,index) in sellerList">
				<div class="flex flex-x-between flex-y-center">
					<div class="list-img">
						<img v-if="d.headPicUrl" :src="imgURL+d.headPicUrl" />
						<img v-else src="../../assets/imgs/img_dianpu.png">
					</div>
					<div class="flex-item-5 time">
						<p class="name"><strong>{{d.storeName}}</strong></p>
						<p style="color:#989E92">采购时间：{{d.distributionStart}}:00~{{d.distributionEnd}}:00</p>
						<div class="flex flex-y-center contact_sj">
							<img src="../../assets/imgs/mine_icon_phone.png">
							<span style="color:#4D7BFE;margin-left: 0.1rem;">
				            		<a :href="'tel:'+d.phoneNumber">联系商家</a>
				            	</span>
						</div>
					</div>
					<div class="flex-item-2 tar ">
						<div class="goShop" @click='goShop(d.sellerId)'>
							进店
						</div>
					</div>
				</div>
			</li>
		</ul>
		<div v-else class="empty" style="margin-top: .87rem;" v-show="showSellerList">还没有收藏店铺~~ </div>

		<yd-infinitescroll v-show='isShowAll' v-if="showProductcollection" :callback="getProductcollection" ref="infinitescrollDemo">
			<ul class="list" slot="list" v-if="showProductcollection">
				<!--:key="d.id"-->
				<li v-for="(d,index) in productcollection">
					<div class="flex flex-x-between flex-y-center">
						<div class="list-img">
							<img v-if="d.skuPic" :src="imgURL + d.skuPic ">
							<img v-else-if="d.proPic" :src="imgURL + d.proPic ">
							<img v-else-if="d.catPic" :src="imgURL + d.catPic ">
							<img v-else src="../../assets/imgs/img_moren@2x.png">
							<!--<div v-if='d.f_stock_limit==1&&d.f_stock_quantity_sku==0' class="quehuo">
									缺货
								</div>-->
						</div>
						<div class="flex-item-5 time">
							<!--[{{d.proMeasureName==d.skuMeasureName?d.proMeasureName:d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName}}]-->
							<p class="name_1"><strong>{{d.productName}}-{{d.skuName}}&nbsp;[{{d.skuMethodType==2?d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName:d.proMeasureName}}]</strong></p>
							<p class="name_2">{{d.sellerName}}</p>
							<p v-if='d.skuMethodType==1'>计量方式:计重</p>
							<p v-else-if='d.skuMethodType==2'>计量方式:计件</p>
							<p v-if='d.f_stock_limit==1&&d.f_stock_quantity_sku==0'>库存较少</p>
							<p v-else-if='d.f_stock_limit==0'>库存充足</p>
							<p v-else>库存量:{{d.f_stock_quantity_sku}}</p>
							<p v-if='d.price-d.promotionPrice>0'>
								<span class="name_3">促销</span>
								<span :style="name_4Style(d.price-d.promotionPrice>0)">
										<span>￥</span>{{d.price}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
								</span>
							</p>
							<div class="name_4">
								<div v-if='d.price-d.promotionPrice>0'>
									<span>￥</span>{{d.promotionPrice}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
								</div>
								<div v-else>
									<span>￥</span>{{d.price}} <span class="name_4_span">/ {{d.skuMeasureName}}</span>
								</div>
							</div>
						</div>
						<div class="flex-item-3 settleMoney tar">
							<template v-if='d.quantity==""||d.quantity>0'>
								<img @click='countQuantity(d,index,0)' class="minus" src="../../assets/imgs/caigou_icon_jian.png">
								<yd-input max='6' :on-focus='focusSelectAll' :on-blur='blurMouse' @change.native="countQuantity(d,index,2)" type="number" class='input' v-model="d.quantity" :show-clear-icon='false' :show-success-icon='false' :show-error-icon='false'></yd-input>
							</template>
							<img @click='countQuantity(d,index,1)' class="add" src="../../assets/imgs/caigou_icon_add.png">
						</div>
					</div>
				</li>
			</ul>
			<span v-if='productcollection.length>0' slot="doneTip">没有更多商品啦~~</span>
			<span v-else slot="doneTip"></span>
		</yd-infinitescroll>
		<div v-if=' productcollection.length<=0&&showProductcollection' class="empty">还没有收藏商品~~ </div>
		<!--<div v-show='showProductcollection' class="kong_div"></div>-->
		<!--v-show='showProductcollection'-->
		<yd-tabbar slot="tabbar" v-show='searchFlg' class='footer'>
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
	import menuTab from '../component/menu.vue'
	import mixin from '../../utils/mixin.js'
	import mixin_store from '../../utils/mixin_store.js'
	import addShop from '../../utils/mixin_addShop.js'
	export default {
		mixins: [mixin, mixin_store, addShop],
		components: {
			menuTab,
		},
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				menu: ['收藏商品', '收藏商家'],
				showSellerList: false,
				sellerList: [],
				showProductcollection: true,
				productcollection: [],
				shopCar: {
					shopNum: 0,
					commodityNum: 0,
					shopMoney: "0.00",
				},
				searchPopup: false,
				inputVal: '',
				searchInputVal: '',
				isShowSearch: true,
				searchFlg: true,
				count: 0,
				isShowAll: true,
				cs:false,
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
			if(this.$root.userInfo.typeId=='merchant'){
				this.$router.push({
					name:'Merchant',
					query:{
						sellerId:this.$root.userInfo.typeCode
					}
				})
			}else{
				this.cs=true
				if(CITY!='临沂'||CITY!='农批'){
					this.postRequest('customer/queryById', {
					id: this.$root.userInfo.typeCode,
					}).then(resp => {
						if(resp.data.state == 0) {
							if(resp.data.aaData.isChoiceSupplier == 1) {
								this.isShowSearch = true;
							} else {
								this.isShowSearch = false;
							}
						}
					})
				}
				this.getQueryGrouplist()
				this.$store.dispatch('changeNavBarTitle', '我的收藏')
			}
			
		},
		mounted() {
			
		},
		methods: {
			//是否显示所有商品
			inputFocus() {
				//				this.searchPopup = true
				//				this.isShowAll=false
				//				if(document.documentElement && document.documentElement.scrollTop) {
				//					document.documentElement.scrollTop = document.body.scrollTop = 0;
				//				} else if(document.body) {
				//					document.body.scrollTop = 0;
				//				}
				//				this.$nextTick(() => {
				//					this.$refs.searchRef.select();
				//					this.productcollection = []
				//					this.pageNum = 1
				//					this.$refs.searchAllGoods.$emit('ydui.infinitescroll.reInit');
				//					this.getProductcollection(true)
				//				})
				/* 上面的是一个页面打开的，下面的是分成两个页面*/
				/*下面的好处，刷新后还是在搜索页面，上面的好处，不用请求新的页面*/
				this.inputVal = '';
				this.$router.push({ name: 'SearchAllGoods', params: { isSearch: 1 } })
			},
			searchBlur() {
				this.searchFlg = true
			},
			searchFocus() {
				this.searchFlg = true
			},
			closePopup() {
				this.searchFlg = true
				this.isShowAll = true
				this.searchPopup = false
				this.productcollection = []
				this.pageNum = 1
				if(!this.showSellerList) {
					this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
					this.getProductcollection(true)
				}
			},
			/**
			 * 点击商品分类
			 */
			menuclick(index) {
				this.getQueryGrouplist(true)
				if(index == 1) {
					this.showSellerList = true
					this.showProductcollection = false
					this.count = 0
					this.getSellerList()
					
				} else {
					this.showProductcollection = true
					this.showSellerList = false
					this.productcollection = []
					this.pageNum = 1
					this.getProductcollection(true)
				}
			},
			/**
			 * 获取收藏的供应商
			 */
			getSellerList() {
				var vm = this
				vm.sellerList = [];
				this.postRequest('suppliercollection/querySellerByCustomerId', {
					customerId: this.userInfo.typeCode,
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						this.getQueryBySellerId(resp.data.aaData);
					}
				})
			},

			getQueryBySellerId(arr) {
				if(this.count < arr.length) {
					this.postRequest('store/queryBySellerId', {
						sellerId: arr[this.count].sellerId
					}).then(resp => {
						if(resp.data && resp.data.state == 0) {
							if(resp.data.aaData) {
								var o = Object.assign(resp.data.aaData, arr[this.count])
								this.sellerList.push(o)

							} else {
//								this.$dialog.alert({
//									mes: '未找到店铺信息~',
//									callback: () => {
//										this.$router.push({
//											name: 'Home'
//										})
//									}
//								})
							}
							this.count++
							this.getQueryBySellerId(arr)
						}
					})

				}

			},
			/**
			 * 获取收藏品
			 */
			getProductcollection(flg) {
				//				this.$dialog.loading.open('商品加载中');\
				var url = 'Productcollection/querylistByCustomerId';
				var str = 'infinitescrollDemo'
				var param = {
					customerId: this.userInfo.typeCode,
					pageNum: this.pageNum,
					pageSize: 10,
				}
				if(this.searchPopup) {
					url = 'productsku/getSkuByOftenBuyOverChannel'
					url = 'productsku/getSkuOverStore'
					param.purchaserId = this.$root.userInfo.typeCode
					param.keyWord = this.searchInputVal
					str = 'searchAllGoods'
				}
				this.postRequest(url, param).then((resp) => {
					if(resp.data && resp.data.state == 0) {
						//resp.data.aaData=[]
						this.addQuantity(resp.data.aaData, this.queryGrouplist)
						this.productcollection = [...this.productcollection, ...resp.data.aaData];
						if(this.productcollection.length >= resp.data.dataCount) {
							/* 所有数据加载完毕 */
							this.$refs[str].$emit('ydui.infinitescroll.loadedDone');
							return;
						}
						/* 单次请求数据完毕 */
						if(resp.data.aaData.length > 0) {
							this.$refs[str].$emit('ydui.infinitescroll.finishLoad');
						}
						this.pageNum++;
					}

				});
			},
			//收藏商品
			createProductcollection(d, index, arr) {
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
							d.isCollection = 1
							this.$dialog.toast({
								mes: '收藏成功',
								timeout: 1200,
								icon: 'success',
								callback: () => {
									this.$set(arr[index], 'isCollection', 1)
								}
							});
						} else {
							this.$dialog.alert({
								mes: d.data.msg
							})
						}
					})
				} else {
					this.postRequest('productcollection/deleteByCustomerIdAndSkuId', {
						customerId: this.userInfo.typeCode - 0,
						skuId: d.skuId
					}).then(d => {
						if(d.data && d.data.state == 0) {
							this.$dialog.toast({
								mes: '取消收藏',
								timeout: 1200,
								icon: 'success',
								callback: () => {
									this.$nextTick(() => {
										this.$set(arr[index], 'isCollection', 0)
									})
								}
							});
						} else {
							this.$dialog.alert({
								mes: d.data.msg
							})
						}
					})
				}
			},

			blurMouse(t) {
				this.searchFlg = true
			},
			/**
			 * 跳转到商店
			 */
			goShop(sellerId) {
				this.$router.push({ name: 'Merchant', query: { sellerId: sellerId } })
			},
			goShopCar() {
				if(this.shopCar.commodityNum > 0) {
					this.$router.push({ name: 'ShopCar' })

				} else {
					this.$dialog.toast({
						mes: '购物车还没有数据哟~~',
						timeout: 1500
					});
				}
			},
			selectLogin() {
				this.$dialog.confirm({
					title: '提示：',
					mes: '立即注销登录?',
					opts: () => {
						if(sessionStorage.getItem('openId')) {
							this.postRequest('user/updateMyDetail', {
								wxopenid: '',
								userId: this.$root.userInfo.userId,
								token: this.$root.userInfo.token,
							}, false, true).then(res => {
								this.$store.commit('login', {});
								this.$root.userInfo = {}
								if(sessionStorage.getItem('isQrCode') == 1) {
									this.$router.push({ name: 'qrcodelogin' })
									//注销过后那个code就不能用了。重定向去那个页面感觉又不友好。
									//只有每次扫码登录的时候才能绑定微信
								} else {
									this.$router.push({ name: 'Login' })
								}
							})
						} else {
							this.$store.commit('login', {});
							this.$root.userInfo = {}
							if(sessionStorage.getItem('isQrCode') == 1) {
								this.$router.push({ name: 'qrcodelogin' })
								//注销过后那个code就不能用了。重定向去那个页面感觉又不友好。
								//只有每次扫码登录的时候才能绑定微信
							} else {
								this.$router.push({ name: 'Login' })
							}
						}

					}
				});
			}
		}
	};
</script>
<style lang="scss">
	.Enshrine {
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
				padding: .1rem 0;
				flex-grow: 0;
			}
		}
		.search_input_children_fixed {
			position: fixed;
		}
		ul.list {
			li {
				padding: 0.25rem;
				border-bottom: 1px solid #ddd;
				.list-img {
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
					.scpic {
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
				display: inline-block;
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
		.goShop {
			width: 1.2rem !important;
			height: .56rem;
			color: #6FB138;
			text-align: center;
			margin: auto;
			line-height: .56rem;
			border: 1px solid #6FB138;
			border-radius: 0.08rem;
		}
		.kong_div {
			width: 100%;
			height: .98rem;
			height: .98rem;
			background: transparent;
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
		.yd-list-donetip {
			background: #efeff3;
		}
	}
</style>