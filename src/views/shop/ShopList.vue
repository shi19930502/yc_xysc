<template>
	<yd-layout id="ShopList">
		<div class="header gradient" v-if="isLoad">
			<div class="search flex flex-y-center">
				<div class="select-pfs flex-item-4 flex flex-y-center">
					<!-- <span>选择批发商</span> -->
					<select style="border: none;color: #fff;" @change="changeSeller" v-model="sellerId">
						<template v-for="d,index in sellerList">
							<option :value="d.sellerId">{{d.sellerName}}</option>
						</template>
					</select>
					<img src="../../assets/imgs/icon_up.png" style="display: block;width: 0.24rem;height: 0.14rem;">
				</div>
				<div>
					<yd-icon @click.native="showSearchFNC" name="search" color="#fff" size="0.4rem"></yd-icon>
					<img class="close-icon" src="../../assets/imgs/tab_close.png" @click="backHome">
				</div>
			</div>
			<div class="header-content">
				<div class="flex flex-y-center">
					<div class="headimg">
						<img v-if="storeInfo.headPicUrl" :src="imgURL+storeInfo.headPicUrl">
						<img v-else src="../../assets/imgs/img_dianpu.png">
					</div>
					<div class="info">
						<p class="name flex-y-center" @click="toShopDetails">
							<strong>{{storeInfo.storeName || ' '}}</strong>
							<img src="../../assets/imgs/icon_right.png" alt="" style="display: inline-block;width: 0.14rem;height: 0.24rem;">
						</p>
						<p class="time">配送时间：{{storeInfo.distributionStart+':00'+'-'+storeInfo.distributionEnd+':00'}}</p>
						<yd-badge shape="square" bgcolor="#FE971D" v-if="storeInfo.distributionToday==1">支持当天配送</yd-badge>
						<yd-badge shape="square" bgcolor="#FE971D" v-else>次日配送</yd-badge>
					</div>
					<div class="scbtn" v-show="sellerInfo.isChoiceSupplier == 1">收藏</div>
				</div>
			</div>
		</div>
		<!-- 信用评分 -->
		<div class="credit-score flex flex-x-between flex-y-center" v-if="isLoad">
			<div class="left flex flex-y-center">
				<img src="../../assets/imgs/icon_xinyong.png">
				<span>信用等级
          <span class="score">{{reputationLevel}}</span></span>
			</div>
			<div class="right flex flex-y-center">
				<span @click="toShopEvaluate">查看详情 ></span>
			</div>
		</div>
		<!-- 分类 -->
		<yd-scrolltab v-show="isLoad">
			<!-- 菜单导航 -->
			<div class="classify flex-y-start">
				<div>
					<!-- 商品分类列表 -->
					<div class="menu">
						<div class="menu-tab" style="overflow-x: auto">
							<ul class="flex">
								<template v-for="(d, index) in categoryList">
									<li :class="d.isActive?'active':''" :style="'min-width: ' + (d.name.length*0.3 +0.5) + 'rem'" @click="menuClick(d)">
										<strong>{{d.name}}</strong>
									</li>
								</template>
							</ul>
						</div>
					</div>
				</div>
				<div class="flex" style="height: 88%;">
					<div class="left" v-if="secondCategoryList.length>0">
						<template v-for="d,index in secondCategoryList">
							<div v-if="d.isActive" class="item active" @click="secondCategoryListClick(d,d.gbgoodsId)">
								<div class="iteminner">{{d.name}}</div>
							</div>
							<div v-else class="item" @click="secondCategoryListClick(d,d.gbgoodsId)">
								<div class="iteminner">{{d.name}}</div>
							</div>
						</template>
					</div>
					<div class="right flex-item-6">
						<yd-infinitescroll :callback="getProductList" ref="productList" v-if="productList.length>0">
							<ul class="product-list" slot="list" v-if="productList.length>0">
								<li class="flex flex-y-center flex-x-between" v-for="d in productList">
									<div class="flex">
										<div class="imgwarp">
											<img v-if="d.isCollection==0" src="../../assets/imgs/sc-icon.png" class="scpic" @click="createProductcollection(d)">
											<img v-if="d.isCollection==1" src="../../assets/imgs/sc-icon_a.png" class="scpic" @click="createProductcollection(d)">
											<img class="goodpic" v-if="d.skuPicUrl" :src="imgURL+d.skuPicUrl" alt="">
											<img class="goodpic" v-else src="../../assets/imgs/img_moren@2x.png">
											<div v-if="d.stockLimit==1 && d.canUseQuantity<=0" class="quehuo-s flex flex-x-center flex-y-center">
												<span>缺货</span>
											</div>
										</div>
										<div class="info flex-item-1">

											<h1 v-if="d.proMeasureName != d.skuMeasureName">{{d.productName+'['+d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName+']'}}</h1>
											<h1 v-else>{{d.productName+'['+d.proMeasureName+']'}}</h1>

											<p v-if="d.remark" style="padding: 3px;">
												<template v-if="d.remark.length>6">{{d.remark.substring(0,6)+'...'}}</template>
												<template v-else>{{d.remark}}</template>
											</p>
											<p v-else style="padding: 3px 0;">暂无描述</p>
											<p style="padding: 0;">{{d.stockLimit == '0' ? '库存充足' : d.canUseQuantity>0 ? '库存量:'+d.canUseQuantity/100 : '库存不足'}}</p>

											<template v-if="d.promotionPrice < d.price">
												<span class="active-status">促销</span>
												<span style="text-decoration: line-through;color: #797D77;">{{'￥'+d.price}}</span>
											</template>
											<h3 v-if="d.promotionPrice>0 && d.promotionBasePrice>0">{{'￥'+d.promotionPrice}}</h3>
											<h3 v-else>{{'￥'+d.price}}</h3>
										</div>
									</div>
									<div class="caigou_icon" v-if="(d.stockLimit==1 &&  d.canUseQuantity>0) || d.stockLimit==0">
										<div class="flex flex-y-center">
											<template v-if="d.quantity>0 || d.quantity=== ''">
												<div @click="jian(d)">
													<img src="../../assets/imgs/caigou_icon_jian.png">
												</div>
												<yd-input @change.native="quantityInput(d)" v-model="d.quantity" max="6" type="number" :show-success-icon="false" :show-clear-icon="false" class="quantity-input"></yd-input>
											</template>
											<div @click="add(d)">
												<img src="../../assets/imgs/caigou_icon_add.png">
											</div>
										</div>
									</div>
								</li>
							</ul>
							<span slot="doneTip">没有更多商品啦~~</span>
						</yd-infinitescroll>
						<div v-else style="height: 100%" class="flex flex-y-center flex-x-center">暂无商品信息</div>
					</div>
				</div>
			</div>
		</yd-scrolltab>

		<!--搜索框-->
		<yd-popup v-model="showSearch" position="bottom" height="100%">
			<div class="searchbox" style="background-color:#fff;">
				<div class="flex" style="background-color:#efeff4;">
					<yd-search v-model="searchValue" placeholder="搜索商品" class="flex-item-8"></yd-search>
					<div class="quxbtn" @click="initSearch">取消</div>
				</div>
				<yd-scrolltab style="top: 1rem;">
					<div class="search-pro">
						<yd-infinitescroll :callback="getProductList" ref="productListsearch" v-if="productList.length>0">
							<ul class="product-list" v-if="productList.length>0" slot="list">
								<li class="flex flex-y-center flex-x-between" v-for="d in productList">
									<div class="flex">
										<div class="imgwarp">
											<img v-if="d.isCollection==0" src="../../assets/imgs/sc-icon.png" class="scpic" @click="createProductcollection(d)">
											<img v-if="d.isCollection==1" src="../../assets/imgs/sc-icon_a.png" class="scpic" @click="createProductcollection(d)">
											<img class="goodpic" v-if="d.skuPicUrl" :src="imgURL+d.skuPicUrl" alt="">
											<img class="goodpic" v-else src="../../assets/imgs/img_moren@2x.png">
											<div v-if="d.canUseQuantity<0" class="quehuo-s flex flex-x-center flex-y-center">
												<span>缺货</span>
											</div>
										</div>
										<div class="info">
											<h1 v-if="d.proMeasureName != d.skuMeasureName">{{d.productName+'['+d.skuWeight+d.proMeasureName+'/'+d.skuMeasureName+']'}}</h1>
											<h1 v-else>{{d.productName+'['+d.proMeasureName+']'}}</h1>
											<div style="font-size: .28rem;font-weight: 700;">12</div>
											<p v-if="d.remark" style="padding: 3px;">
												<template v-if="d.remark.length>6">{{d.remark.substring(0,6)+'...'}}</template>
												<template v-else>{{d.remark}}</template>
											</p>
											<p v-else style="padding: 3px 0;">暂无描述</p>
											
											<p style="padding: 0;">{{d.stockLimit == '0' ? '库存充足' : d.canUseQuantity>0 ? '库存量:'+d.canUseQuantity/100 : '库存不足'}}</p>

											<template v-if="d.promotionPrice < d.price">
												<span class="active-status">促销</span>
												<span style="text-decoration: line-through;color: #797D77;">{{'￥'+d.price}}</span>
											</template>
											<h3 v-if="d.promotionPrice>0 && d.promotionBasePrice>0">{{'￥'+d.promotionPrice}}</h3>
											<h3 v-else>{{'￥'+d.price}}</h3>
										</div>
									</div>
									<div class="caigou_icon" v-if="(d.stockLimit==1 &&  d.canUseQuantity>0) || d.stockLimit==0">
										<div class="flex flex-y-center">
											<template v-if="d.quantity>0 || d.quantity===''">
												<div @click="jian(d)">
													<img src="../../assets/imgs/caigou_icon_jian.png">
												</div>
												<yd-input @change.native="quantityInput(d)" v-model="d.quantity" max="6" type="number" :show-success-icon="false" :show-clear-icon="false" class="quantity-input"></yd-input>
											</template>
											<div @click="add(d)">
												<img src="../../assets/imgs/caigou_icon_add.png">
											</div>
										</div>
									</div>
								</li>
							</ul>
							<span slot="doneTip">没有更多商品啦~~</span>
						</yd-infinitescroll>
					</div>
				</yd-scrolltab>
			</div>
		</yd-popup>
		<!-- 当前店铺的购物车 -->
		<yd-popup v-model="showShopCar" position="bottom" height="70%">
			<div class="flex flex-x-between" style="padding: 0.2rem;border-bottom: 1px solid #ddd;">
				<yd-checkbox v-model="isCheckAll" shape="circle" :change="checkAll">全选</yd-checkbox>
				<yd-icon name="delete" @click.native="del" size="0.36rem"></yd-icon>
			</div>
			<yd-checklist v-model="carSettlementGoods" ref="checklistDemo" :callback="change">
				<div v-for="d in alreadyChosenGoods" class="flex flex-x-between flex-y-center">
					<yd-checklist-item :val="d.id" class="flex-item-6">
						<div style="padding: 12px 0;" class="flex flex-x-between flex-y-center">
							<span>{{d.productName+'['+d.skuName+']'}}</span>
						</div>
						<div></div>
					</yd-checklist-item>
					<div class="flex" style="padding: 0 0.2rem;">
						<div v-if="d.promotionPrice>0 && d.promotionBasePrice>0" class="popred">{{'￥'+(d.promotionPrice*100*d.quantity/100 -0).toFixed(2)}}</div>
						<div v-else class="popred">{{'￥'+(d.price*100*d.quantity/100-0).toFixed(2)}}</div>
						<div class="flex flex-y-center">
							<template v-if="d.quantity>0 || d.quantity===''">
								<div @click="jian(d)">
									<img src="../../assets/imgs/caigou_icon_jian.png" style="display: block;width: 0.44rem;height: 0.44rem;">
								</div>
								<yd-input @change.native="quantityInput(d)" v-model="d.quantity" max="6" type="number" :show-success-icon="false" :show-clear-icon="false" class="quantity-input"></yd-input>
							</template>
							<div @click="add(d)">
								<img src="../../assets/imgs/caigou_icon_add.png" style="display: block;width: 0.44rem;height: 0.44rem;">
							</div>
						</div>
					</div>
				</div>
			</yd-checklist>
			<div class="yd-tabbar" style="position: absolute;bottom: 0;z-index: 1000;">
				<div class="tabbar flex">
					<div class="flex flex-y-center">
						<div class="status-icon flex flex-y-center flex-x-center" :style="carSettlementGoods.length == 0 ? 'background:#C2C2C2' : 'background:#6FB138'">
							<img src="../../assets/imgs/icon_caigou.png" style="width: 0.5rem;height:0.5rem;">
							<yd-badge class="badge" v-show="carSettlementGoods.length != 0" bgcolor="#FF3D15">{{carSettlementGoods.length}}</yd-badge>
						</div>
						<span class="tips" v-if="carSettlementGoods.length == 0">暂未选择任何商品</span>
						<span v-else class="price-tips">
              <strong>￥{{orderTotalUp}}</strong>
            </span>
					</div>
					<div>
					</div>
					<div>
						<div :class="carSettlementGoods.length == 0 ? 'tabbar-btn' : 'tabbar-btn tabbarbtn-active' " @click="toOrderSettlement2">去结算</div>
					</div>
				</div>
			</div>
		</yd-popup>
		<!-- 底部 -->
		<yd-tabbar slot="tabbar">
			<div class="yd-tabbar">
				<div class="tabbar flex">
					<div class="flex flex-y-center">
						<!-- @click="getShopCar" -->
						<div @click="getShopCar" class="status-icon flex flex-y-center flex-x-center" :style="alreadyChosenGoods.length == 0 ? 'background:#C2C2C2' : 'background:#6FB138'">
							<img src="../../assets/imgs/icon_caigou.png" style="width: 0.5rem;height:0.5rem;">
							<yd-badge class="badge" v-show="alreadyChosenGoods.length != 0" bgcolor="#FF3D15">{{alreadyChosenGoods.length}}</yd-badge>
						</div>
						<span class="tips" v-if="alreadyChosenGoods.length == 0">暂未选择任何商品</span>
						<span v-else class="price-tips">
              <strong>￥{{orderTotal}}</strong>
            </span>
					</div>
					<div>
					</div>
					<div>
						<div style="right:1.5rem;border-right: 1px solid;background: #fff;" class="tabbar-btn">
							<yd-icon @click.native="addShopCar" name="shopcart-outline" color="#FE971D"></yd-icon>
						</div>
						<div :class="alreadyChosenGoods.length == 0 ? 'tabbar-btn' : 'tabbar-btn tabbarbtn-active' " @click="toOrderSettlement">去结算</div>
					</div>
				</div>
			</div>
		</yd-tabbar>
	</yd-layout>
</template>
<script>
	import menuTab from '../component/menu.vue'
	import mixin from '../../utils/mixin.js'
	import mixin_category from '../../utils/mixin_category.js'
	import mixin_shop from '../../utils/mixin_shop.js'
	import mixin_store from '../../utils/mixin_store.js'

	export default {
		components: {
			menuTab
		},
		mixins: [mixin, mixin_shop, mixin_category, mixin_store],
		data() {
			return {
				meunIndex: 0,
				searchValue: '',
				showSearch: false,
				isLoad: false,
				// 上拉购物车
				carSettlementGoods: [],
				isCheckAll: false,
				showShopCar: false,
				// 选择的供应商
				sellerId: '',
				// 商品列表
				productList: [],
				// 已选商品总价
				orderTotal: 0,
				orderTotalUp: 0,
				settlementGoods: [],
				pageNum: 1,
				pageSize: 10,
				newUrl:'',
				isHave:false,
				localObj:{},
			}
		},
		watch: {
			searchValue: 'searchProduct',
			showSearch: function(val) {
				this.productList = []
				this.getProductList()
				
			},
			showShopCar: 'getProductList',
			// 上拉购物车选择商品
			carSettlementGoods: {
				handler(newValue) {　　
					var aaaaa = []
					for(var i in this.alreadyChosenGoods) {
						for(var j in newValue) {
							if(newValue[j] == this.alreadyChosenGoods[i].id) {
								aaaaa.push(this.alreadyChosenGoods[i])
							}
						}
					}　　　
					this.orderTotalUp = this.getOrderTotal(aaaaa).priceTotal
				},
				deep: true
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '选购商品')
			this.getSellers()
			this.localObj=JSON.parse(localStorage.getItem('quickUserInfo'))
			// 获取购物车数据
			this.getShippingcarList()

			// 判断是否为个人中心进入
			if(this.$route.query.isUserEnter) {
				this.isUserEnter = this.$route.query.isUserEnter
				this.gbgoodsId = ''
				this.isOftenBuy = true
			}
		},
		mounted() {},
		methods: {
			/**
			 * 取消初始化查询条件
			 */
			initSearch() {
				this.showSearch = false
				this.searchValue = ''
				this.pageNum = 1
			},
			/**
			 * showSearch
			 */
			showSearchFNC() {
				this.showSearch = true
			},
			/**
			 * 搜索商品
			 */
			searchProduct(value) {
				this.pageNum = 1
				this.getProductList(value)
			},
			/**
			 * 获取登录用户的供应商列表
			 */
			getSellers() {
				this.postRequest('suppliercollection/querySellerByCustomerId', {
					customerId: this.userInfo.typeCode
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						if(resp.data.aaData.length>0){
							this.sellerList = resp.data.aaData
							if(resp.data.aaData[0]) {
								this.sellerId = resp.data.aaData[0].sellerId
								// 获取商品分类规格信息
								this.getCategoryList()
							}
							// 获取登录用户供应商店铺
							this.getCustomerById(this.isHave,true)
							this.getCustomerById()
						}else{
							// 获取登录用户供应商店铺
							this.isHave=true
							this.getCustomerById(this.isHave,true)
							this.getCustomerById()
						}
					} else {
						this.$dialog.alert({
							mes: resp.data.msg,
							callback: () => {
								this.$router.push({
									name: 'Login'
								})
							}
						})
					}
				})
			},
			/**
			 * 获取登录用户供应商 true表示没有关联的供应商
			 */
			getCustomerById(isHave,flg) {
				console.log(this.sellerId)
				var id=''
				if(flg){
					id=this.localObj.typeCode
				}else{
					id=this.sellerId
				}
				this.newUrl='';
				this.postRequest('customer/queryById', {
					id: id
				}).then(resp => {
					console.log(3)
					if(resp.data && resp.data.state == 0) {
						if( resp.data.aaData.isChoiceSupplier==1){
							if(isHave){
								//跳转新页面 搜索所有物品
								console.log('跳转新页面 搜索所有物品')
							}else{
								//有供应商且
								console.log('有，1')
								// 获取店铺信息isChoiceSupplier为1，搜索所有物品
								
								if(flg){
									this.newUrl='productsku/getSkuByOftenBuyOverChannel'
									console.log(this.newUrl)
								}else{
									this.getStore(this.sellerId, store => {
									this.isLoad = true
									this.storeInfo = store
									})
									this.countVisits();
									// 获取供应商信息
									if(resp.data.aaData) {
										this.sellerInfo = resp.data.aaData
									}
									this.getReputation(this.sellerId)
								}
								
							}
							
						}else{
							//isChoiceSupplier=0，且并未关联供应商
							if(isHave){ 
								console.log('啥子都没有')
								this.$dialog.alert({
									mes: '未关联任何供应商， 请先关联在浏览',
									callback: () => {
										this.$router.push({
											name: 'Home'
										})
									}
								})
							}else{
								console.log('有，0')
								//isChoiceSupplier=0，关联了供应商
								// 获取店铺信息
								this.getStore(this.sellerId, store => {
									this.isLoad = true
									this.storeInfo = store
								})
								this.countVisits();
								// 获取供应商信息
								if(resp.data.aaData) {
									this.sellerInfo = resp.data.aaData
								}
								this.getReputation(this.sellerId)
							}
						}
						
					}
				})
			},
			/**
			 * 获取商品列表
			 */
			getProductList(keyWord) {
				this.$dialog.loading.open('商品加载中');
				var param = {
					code: this.gbgoodsId,
					purchaserId: this.userInfo.typeCode,
					supplierId: this.sellerId,
					keyWord: '',
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				if(keyWord || this.showSearch) {
					param.code = ''
					param.keyWord = keyWord
				}

				// 是否为常买商品
				var purl;
				if(this.isOftenBuy) {
					purl = 'productsku/getSkuByOftenBuy'
				} else {
					purl = 'productsku/getSkuByQuotation'
					console.log(this.newUrl)
					if(this.newUrl){
						purl=this.newUrl
						param.purchaserId=this.localObj.purchaserId
					}
				}
				
				this.postRequest(purl, param).then(resp => {
					if(resp.data && resp.data.state == 0) {
						this.$dialog.loading.close();

						if(resp.data.aaData.length > 0) {
							for(var i in resp.data.aaData) {
								// 初始化商品数量
								resp.data.aaData[i].quantity = 0
								// 获取购物车数已经选择了的商品的数量
								if(this.alreadyChosenGoods.length > 0) {
									for(var j in this.alreadyChosenGoods) {
										if(this.alreadyChosenGoods[j].skuId == resp.data.aaData[i].id) {
											resp.data.aaData[i].quantity = this.alreadyChosenGoods[j].quantity
										}
									}
								}
							}

							if(this.pageNum == 1) {
								this.productList = resp.data.aaData
							} else {
								this.productList = [...this.productList, ...resp.data.aaData];
							}

							if(this.productList.length >= resp.data.dataCount) {
								if(this.$refs.productList) {
									/* 所有数据加载完毕 */
									if(this.showSearch) {
										this.$refs.productListsearch.$emit('ydui.infinitescroll.loadedDone');
									}
									this.$refs.productList.$emit('ydui.infinitescroll.loadedDone');
								}
								return;
							}
							/* 单次请求数据完毕 */
							if(this.$refs.productList) {
								if(this.showSearch) {
									this.$refs.productListsearch.$emit('ydui.infinitescroll.finishLoad');
								}
								this.$refs.productList.$emit('ydui.infinitescroll.finishLoad');
							}
							this.pageNum++;
						} else {
							this.productList = []
						}
					}
				})
			},
			/**
			 * 结算
			 */
			toOrderSettlement() {
				if(this.alreadyChosenGoods.length == 0) {
					this.$dialog.alert({
						mes: '暂未选择任何商品'
					});
				} else {
					for(var i in this.alreadyChosenGoods) {
						this.alreadyChosenGoods[i].btnText = '备注'
						this.alreadyChosenGoods[i].showRemarks = false
					}
					var settlementParam = {
						settlementGoods: this.alreadyChosenGoods,
					}
					var priceTotal = this.getOrderTotal(this.alreadyChosenGoods).priceTotal;
					var quantityTotal = this.getOrderTotal(this.alreadyChosenGoods).quantityTotal;
					this.$dialog.confirm({
						title: this.storeInfo.storeName,
						mes: `共${this.alreadyChosenGoods.length}件商品,总数量${quantityTotal},总价:￥${priceTotal}`,
						opts: () => {
							localStorage.setItem('settlementParam', JSON.stringify(settlementParam))
							this.$router.push({
								name: 'OrderSettlement',
								query: {
									sellerId: this.sellerInfo.id,
									sellerName: this.storeInfo.storeName,
									distributionType: this.storeInfo.distributionToday
								}
							})
						}
					});
				}
			},
			/**
			 * 上拉购物车结算
			 */
			toOrderSettlement2() {
				if(this.carSettlementGoods.length == 0) {
					this.$dialog.alert({
						mes: '请选择需要结算的商品~~'
					})
				} else {
					var a = [];
					for(var i in this.carSettlementGoods) {
						for(var j in this.alreadyChosenGoods) {
							if(this.carSettlementGoods[i] == this.alreadyChosenGoods[j].id) {
								a.push(this.alreadyChosenGoods[j])
							}
						}
					}

					for(var i in a) {
						a[i].btnText = '备注'
						a[i].showRemarks = false
					}
					var settlementParam = {
						settlementGoods: a,
					}
					var priceTotal = this.getOrderTotal(this.alreadyChosenGoods).priceTotal;
					var quantityTotal = this.getOrderTotal(this.alreadyChosenGoods).quantityTotal;
					this.$dialog.confirm({
						title: this.storeInfo.storeName,
						mes: `共${this.alreadyChosenGoods.length}件商品,总数量${quantityTotal},总价:￥${priceTotal}`,
						opts: () => {
							localStorage.setItem('settlementParam', JSON.stringify(settlementParam))
							this.$router.push({
								name: 'OrderSettlement',
								query: {
									sellerId: this.sellerInfo.id,
									sellerName: this.storeInfo.storeName,
									distributionType: this.storeInfo.distributionToday
								}
							})
						}
					});
				}
			},
			/**
			 * 二级分类获取商品
			 */
			secondCategoryListClick(d, gbgoodsId) {
				this.pageNum = 1
				this.gbgoodsId = gbgoodsId
				this.getProductList()

				for(var i in this.secondCategoryList) {
					if(this.secondCategoryList[i].isActive) {
						this.secondCategoryList[i].isActive = false
					}
				}
				d.isActive = true
			},
			/**
			 * 显示购物车
			 */
			getShopCar() {
				if(this.alreadyChosenGoods.length > 0) {
					this.showShopCar = true
				} else {
					this.$dialog.alert({
						mes: '暂未选择任何商品'
					});
				}
			},
			/**
			 * 加入购物车
			 */
			addShopCar() {
				this.$router.push({
					name: 'UserShoppingCart'
				})
			},
			/**
			 * 输入商品
			 */
			quantityInput(d) {
				console.log(1)
				if(d.quantity == '') {
					d.quantity = 1
				} else {
					d.quantity = (d.quantity - 0).toFixed(2)
				}
				this.createShippingcar(d)
			},
			/**
			 * 加商品
			 */
			add(d) {
				d.quantity = (d.quantity - 0 + 1).toFixed(2);
				this.createShippingcar(d, 'add')
			},
			/**
			 * 减商品
			 */
			jian(d) {
				d.quantity = (d.quantity - 0 - 1).toFixed(2);
				if(d.quantity >= 0) {
					this.createShippingcar(d)
				}
			},
			/**
			 * 改变供应商
			 */
			changeSeller() {
				this.alreadyChosenGoods = []
				this.getCustomerById()
				// 获取购物车数据
				this.getShippingcarList()

				for(var i of this.categoryList) {
					if(i.isActive) {
						if(i.childList) {
							this.secondCategoryList = i.childList
							this.gbgoodsId = this.secondCategoryList[0].gbgoodsId
							this.getProductList()
						} else {
							this.secondCategoryList = []
							this.gbgoodsId = i.gbgoodsId
							this.getProductList()
						}
					}
				}
			},
			/**
			 * 全选
			 * @param {Object} value
			 * @param {Object} isCheckAll
			 */
			change: function(value, isCheckAll) {
				this.isCheckAll = isCheckAll;
			},
			/**
			 * 全选添加
			 */
			checkAll: function() {
				this.isCheckAll = !this.isCheckAll;
				this.$refs.checklistDemo.$emit('ydui.checklist.checkall', this.isCheckAll);
			},
			/**
			 * 收藏商品
			 */
			createProductcollection(d) {
				if(d.isCollection == 0) {
					var param = {
						customerId: this.userInfo.typeCode - 0,
						sellerId: this.sellerId,
						sellerName: this.sellerInfo.name,
						productId: d.productId,
						productName: d.productName,
						skuId: d.id,
						skuName: d.name,
					}
					this.postRequest('Productcollection/create', param).then(d => {
						if(d.data && d.data.state == 0) {
							this.$dialog.toast({
								mes: '收藏成功',
								timeout: 1200,
								icon: 'success',
								callback: () => {
									this.getProductList(this.searchValue)
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
						skuId: d.id
					}).then(d => {
						if(d.data && d.data.state == 0) {
							this.$dialog.toast({
								mes: '取消收藏',
								timeout: 1200,
								icon: 'success',
								callback: () => {
									this.getProductList(this.searchValue)
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
			/**
			 * 删除购物车
			 */
			del() {
				this.postRequest('shippingcar/queryGrouplist', {
					buyerId: this.userInfo.typeCode,
					sellerId: this.sellerId
				}).then(d => {
					if(d.data && d.data.state == 0) {
						for(var i in d.data.aaData) {
							if(this.sellerId == i) { //如果卖家id等于购物车中的卖家id就删除
								if(this.carSettlementGoods.length > 0) {
									for(var k in this.carSettlementGoods) {
										this.deleteShopCarById(this.carSettlementGoods[k])
									}
								} else {
									this.$dialog.alert({
										mes: '请选择需要移除的商品~~'
									});
								}
							}
						}
					}
				})
			},
			/**
			 * 删除购物车byId
			 */
			deleteShopCarById(id) {
				this.postRequest('shippingcar/delete', {
					id: id
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.getShippingcarList()
						this.carSettlementGoods = []
						this.isCheckAll = false
					}
				})
			},
			/**
			 * 查看店铺详情
			 */
			toShopEvaluate() {
				this.$router.push({
					name: 'ShopEvaluateList',
					query: {
						storeId: this.storeInfo.id
					}
				})
			},
			/**
			 * 返回主页
			 */
			backHome() {
				this.$router.push({
					name: 'Home'
				})
			}
		}
	};
</script>
<style lang="scss">
	.quantity-input {
		background: #EEEEEE;
		width: 0.8rem;
		height: 0.44rem;
		margin: 0 2px;
		input {
			text-align: center;
		}
	}
	#ShopList {
		.yd-search-input>.cancel-text {
			display: none !important;
		}
		select {
			font-family: 'Avenir', Helvetica, Arial, sans-serif;
			option {
				background: #8CD362;
				border: none;
			}
		}
		.yd-spinner {
			border: none;
			a:nth-child(1) {
				background: #fff;
				border: 1px solid #6FB138;
			}
			a:nth-child(1):after {
				color: #6FB138;
			}
		}
		.yd-spinner>a {
			background: #6FB138;
			border-radius: 100px;
			width: 30%;
		}
		.yd-spinner>a:after {
			color: #fff;
			top: 53%;
		}
		.yd-spinner>input {
			width: 40%;
		}
		/**重写scrolltab*/
		.yd-scrolltab-content {
			padding: 0 0 0 0;
		}
		.yd-scrolltab {
			top: 3.5rem;
			bottom: 0;
		}
		.yd-tabbar {
			padding: 0 !important;
		}
		.quxbtn {
			white-space: nowrap;
			padding-left: 10px;
			height: 30px;
			line-height: 32px;
			color: #0bb20c;
			font-size: 14px;
			padding-right: 10px;
			margin-left: -10px;
			padding: 10px;
		}
		/***/
		height: 100%;
		.header {
			padding: 0.25rem 0.25rem 0.2rem;
			.search {
				margin-bottom: 0.15rem;
				.select-pfs {
					color: #fff;
					font-size: 0.3rem;
					img {
						margin-left: 0.1rem;
					}
				}
				.close-icon {
					width: 0.3rem;
					height: 0.3rem;
					margin-left: 0.1rem;
				}
			}
			.header-content {
				color: #fff;
				position: relative;
				.headimg {
					background: url(../../assets/imgs/img_dianpu.png);
					background-size: 100% 100%;
					position: absolute;
					height: 1.68rem;
					width: 1.68rem;
					border-radius: 5px;
					bottom: -0.4rem;
					overflow: hidden;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.info {
					padding-left: 1.93rem;
					p.name {
						font-size: 0.3rem;
						img {
							margin-left: 0.1rem;
						}
					}
					p.time {
						padding: 0.12rem 0;
					}
				}
				.scbtn {
					background: #FE971D;
					width: 1rem;
					height: 0.44rem;
					line-height: 0.44rem;
					text-align: center;
					border-radius: 0.22rem 0 0 0.22rem;
					position: absolute;
					right: -0.23rem;
				}
			}
		}
		/**信用评分*/
		.credit-score {
			background: #fff;
			padding: 0.45rem 0.25rem 0.2rem;
			color: #989E92;
			font-size: 0.24rem;
			.left {
				img {
					margin-right: 0.1rem;
					width: 0.26rem;
					height: 0.26rem;
				}
				.score {
					color: #FE971D;
				}
			}
			.right {
				img {
					margin-left: 0.1rem;
					width: 0.14rem;
					height: 0.08rem;
				}
			}
		}
		/**分类*/
		.searchbox {
			.search-pro {
				height: 100%;
				overflow-y: auto;
			}
			.search-pro::-webkit-scrollbar {
				display: none;
			}
			ul.product-list {
				padding-top: 0;
				li {
					padding-left: 0.2rem;
				}
			}
		}
		ul.product-list {
			padding-top: 0rem;
			li {
				padding: 0.2rem 0;
				border-bottom: 1px solid #ddd;
				position: relative;
				.imgwarp {
					width: 1.6rem;
					height: 1.6rem;
					border-radius: 2px;
					overflow: hidden;
					position: relative;
					img.goodpic {
						width: 100%;
						height: 100%;
					}
					img.scpic {
						position: absolute;
						top: 0;
						width: 0.32rem;
						height: 0.36rem;
					}
					.quehuo-s {
						width: 100%;
						height: 100%;
						position: absolute;
						background: rgba(0, 0, 0, 0.5);
						top: 0;
						left: 0;
						color: #fff;
					}
				}
				.caigou_icon {
					position: absolute;
					right: 0.25rem;
					top: 50%;
					margin-top: -0.22rem;
					img {
						display: block;
						width: 0.44rem;
						height: 0.44rem;
					}
					.quantity-input {
						background: #EEEEEE;
						width: 0.8rem;
						height: 0.44rem;
						margin: 0 2px;
						input {
							text-align: center;
						}
					}
				}
				.info {
					padding-left: 0.25rem;
					h1 {
						font-size: 0.3rem;
					}
					p {
						color: #797D77;
						padding: 0.1rem 0;
					}
					h3 {
						font-size: 0.3rem;
						color: #FF3D15;
					}
				}
				.addicon {
					position: absolute;
					right: 0.25rem;
				}
			}
		}
		.classify {
			height: 100%;
			.left::-webkit-scrollbar {
				display: none;
			}
			.left {
				height: 100%;
				overflow-y: auto;
				width: 1.6rem;
				background: #F8F8F8;
				.item {
					text-align: center;
					padding: 0 0.25rem;
					color: #797D77;
					.iteminner {
						padding: 0.4rem 0;
						border-bottom: 1px solid #ddd;
					}
				}
				.item.active {
					background: #fff;
					font-weight: 700;
					color: #000 !important;
					.iteminner {
						border-bottom: none;
					}
				}
			}
			.right::-webkit-scrollbar {
				display: none;
			}
			.right {
				height: 100%;
				overflow-y: auto;
				background: #fff;
				padding-left: 0.25rem;
				.top {
					position: fixed;
					width: 100%;
					z-index: 100;
					background: #fff;
					padding: 0.15rem 0;
					border-bottom: 1px solid #ddd;
					strong {
						font-size: 0.2rem;
						padding-right: 0.25rem;
					}
					span {
						font-size: 12px;
						color: #797D77;
					}
				}
			}
		}
		/**底部*/
		.tabbar {
			height: 0.98rem;
			.status-icon {
				.badge {
					position: absolute;
					top: -3px;
					right: -0.1rem;
				}
				height: 1.12rem;
				width: 1.12rem;
				border: 3px solid #fff;
				background: #C2C2C2;
				border-radius: 1rem;
				position: absolute;
				top: -0.3rem;
				left: 0.25rem;
				z-index: 100;
			}
			.tips {
				font-size: 0.3rem;
				color: #989E92;
				padding-left: 1.62rem;
			}
			.price-tips {
				font-size: 0.3rem;
				color: #FF3D15;
				padding-left: 1.62rem;
			}
			.tabbar-btn {
				height: 100%;
				line-height: 0.98rem;
				width: 1.5rem;
				text-align: center;
				background: #989E92;
				color: #fff;
				font-size: 0.3rem;
				position: absolute;
				right: 0;
			}
			.tabbarbtn-active {
				background: #FE971D;
			}
		}
		.popred {
			font-size: 14px;
			color: red;
			font-weight: 600;
			margin-right: 0.3rem;
			padding: 10px 0;
		}
	}
</style>