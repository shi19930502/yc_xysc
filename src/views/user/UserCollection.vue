<template>
	<yd-layout>
		<div id="UserCollection">
			<!-- 菜单导航 -->
			<!-- <menuTab></menuTab> -->
			<menuTab :item-click="menuclick" :dataList="menu"></menuTab>
			<ul class="list" v-show="showSellerList" v-if="sellerList.length>0">
				<li v-for="d in sellerList">
					<div class="flex flex-x-between flex-y-center">
						<div class="list-img">
							<img v-if="d.headPicUrl" :src="imgURL+d.headPicUrl" />
							<img v-else src="../../assets/imgs/img_dianpu.png">
						</div>
						<div class="flex-item-5">
							<p class="name"><strong>{{d.storeName}}</strong></p>
							<yd-badge shape="square" bgcolor="#FE971D" style="padding: 0 6px;">{{d.distributionToday==1?'支持当天配送':'次日配送'}}</yd-badge>
							<p style="color:#989E92">配送时间：{{d.distributionStart}}:00~{{d.distributionEnd}}:00</p>
						</div>
						<div class="flex-item-2 tar">
							<div class="flex flex-y-center">
								<img src="../../assets/imgs/mine_icon_phone.png" style="width: 0.34rem;height: 0.34rem;">
								<span style="color:#4D7BFE;margin-left: 0.1rem;">
            		<a :href="'tel:'+d.phoneNumber">联系商家</a>
            	</span>
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div v-else class="empty" v-show="showSellerList">还没有收藏店铺~~ </div>
			<!-- 收藏商品 -->
			<ul class="list" v-show="showProductcollection" v-if="productcollection.length>0">
				<li v-for="d in productcollection">
					<div class="flex flex-x-between flex-y-center">
						<div class="list-img">
							<img v-if="d.proPic" :src="imgURL + d.proPic ">
							<img v-else src="../../assets/imgs/img_moren@2x.png">
						</div>
						<div class="flex-item-5">
							<p class="name"><strong>{{d.productName}}</strong></p>
							<p style="color:#989E92">{{d.sellerName}}</p>
						</div>
					</div>
				</li>
			</ul>
			<div v-else class="empty" v-show="showProductcollection">还没有收藏商品~~ </div>
		</div>
	</yd-layout>
</template>
<script>
	import menuTab from '../component/menu.vue'
	import list from '../component/list.vue'
	import mixin from '../../utils/mixin.js'
	import mixin_store from '../../utils/mixin_store.js'

	export default {
		mixins: [mixin, mixin_store],
		components: {
			menuTab,
			list
		},
		data() {
			return {
				menu: ['收藏商家', '收藏商品'],
				showSellerList: true,
				sellerList: [],
				showProductcollection: false,
				productcollection: [],
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '我的收藏')
			this.getSellerList()
		},
		methods: {
			/**
			 * 点击商品分类
			 */
			menuclick(index) {
				if(index == 0) {
					this.showSellerList = true
					this.showProductcollection = false
					this.getSellerList()
				} else {
					this.showProductcollection = true
					this.showSellerList = false
					this.getProductcollection()
				}
			},
			/**
			 * 获取收藏的供应商
			 */
			getSellerList() {
				this.postRequest('suppliercollection/querySellerByCustomerId', {
					customerId: this.userInfo.typeCode,
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						if(resp.data.aaData) {
							var a = []
							for(var i in resp.data.aaData) {
								this.getStore(resp.data.aaData[i].sellerId, function(store) {
									var o = Object.assign(store, resp.data.aaData[i])
									a.push(o)
								})
							}
							this.sellerList = a
						}
					}
				})
			},
			/**
			 * 获取收藏品
			 */
			getProductcollection() {
				this.postRequest('Productcollection/list', {
					customerId: this.userInfo.typeCode,
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						this.productcollection = resp.data.aaData
					}
				})
			},
		}
	};
</script>
<style lang="scss">
	#UserCollection {
		ul.list {
			li {
				padding: 0.25rem;
				border-bottom: 1px solid #ddd;
				.list-img {
					margin-right: 0.25rem;
					width: 1rem;
					height: 1rem;
					img {
						width: 100%;
						height: 100%;
					}
				}
				p.name {
					font-size: 0.27rem;
					padding-bottom: 0.06rem;
				}
			}
			background: #fff;
		}
	}
</style>