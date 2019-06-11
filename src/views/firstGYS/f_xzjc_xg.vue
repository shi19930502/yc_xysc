<template>
	<yd-layout id='fXzjcXg'>
		<div slot='top' class="header">
			<div>
				<a class="header_left" @click='goBack' href="javascript:;">上一步</a>
			</div>
			<div class="name">修改价格{{isEdit?'(编辑)':'(新增)'}}</div>
			<div>
				<a @click='goNext' href="javascript:;">下一步</a>
			</div>
		</div>
		<div class="content">
			<div class="goods_list" v-for='item in dataList'>
				<img v-if='item.f_sku_pic_url&&item.f_sku_pic_url!=null' class="list_img" :src="$root.imgURL+item.f_sku_pic_url" alt="" />
				<img v-else src="../../assets/imgs/img_moren@2x.png" class="list_img" alt="" />
				<div class="list">
					<div class="list_name">{{item.productName}}<span v-if='item.f_name&&item.f_name!=null'> - {{item.f_name}}</span></div>
					<div class="list_content">
						<div class="top">
							<p>单价</p>
							<input @input='changeInput(item,"f_price")' @blur='blurInput(item,"f_price")' type="text" v-model='item.f_price' />&nbsp;/&nbsp;{{item.measureName}}
							<strong>￥</strong>
						</div>
						<div class="bottom">
							<p>进场量</p>
							<input type="text" @input='changeInput(item,"f_sku_weight")' @blur='blurInput(item,"f_sku_weight")' v-model='item.f_sku_weight' />&nbsp;{{item.measureName}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	import mixin_storage from '../../utils/mixin_storage.js'
	export default {
		mixins: [mixin_storage],
		data() {
			return {
				dataList: [],
				localObj: {
					checkGoods:[],
					step:null,
					checklist:[],
				}
			}
		},
		created() {
			if(this.isEdit) {
				this.$store.dispatch('changeNavBarTitle', '编辑进场')
			} else {
				this.$store.dispatch('changeNavBarTitle', '新增进场')
			}
			if(this.isEdit) {
				this.getMainAndDetail();
				//老的
				//				if(sessionStorage.getItem('XZJC_edit')) {
				//					this.localObj=	JSON.parse(sessionStorage.getItem('XZJC_edit'))
				//					this.dataList = JSON.parse(sessionStorage.getItem('XZJC_edit')).checkGoods
				//					this.localObj.step=2
				//				} else {
				//					this.$router.push({ name: 'f_jcgl' })
				//				}
			} else {
				if(localStorage.getItem('XZJC_add')) {
					this.localObj = JSON.parse(localStorage.getItem('XZJC_add'))
					this.dataList = JSON.parse(localStorage.getItem('XZJC_add')).checkGoods
					this.localObj.step = 2
					localStorage.setItem('XZJC_add', JSON.stringify(this.localObj))
				} else {
					this.$router.push({ name: 'f_jcgl' })
				}
			}

			console.log(this.dataList)
		},
		watch: {

		},
		computed: {

		},
		mounted() {

		},
		methods: {
			getMainAndDetail() {
				this.postRequest('inmarketdetail/mainAndDetail', {
					mainId: this.$route.query.mainId
				}).then(resp => {
					if(resp.data.state == 0 && resp.data.aaData.detail) {
						//由于寇昊和俊的字段不一样，所有在此处做成俊那种字段，后面就不用修改了
						var arr = resp.data.aaData.detail;
						var newArr=[]
						var arrId=[]
						for(let a = 0; a < arr.length; a++) {
							var o={}
							o.f_name=arr[a].skuName
							o.f_id=arr[a].skuId
							o.f_product_id=arr[a].productId
							o.productName=arr[a].productName
							o.f_price=arr[a].price
							o.f_sku_weight=arr[a].weight
							o.measureName=arr[a].measureMethodName
							arrId.push(arr[a].skuId)
							newArr.push(o)
						}
						this.localObj={
							checkGoods:newArr,
							checklist:arrId,
							step:2
						}
						sessionStorage.setItem('XZJC_edit',JSON.stringify(this.localObj))
						this.dataList = newArr
						console.log(this.dataList)
					}

				})
			},
			goBack() {
				if(this.isEdit) {
					if(this.$route.query.mainId){
						if(this.$route.query.url=='jcxq'){
							this.$router.push({
								name:'f_jcxq', //f_xzjc_xz 老的
								query: {
									mainId: this.$route.query.mainId,
								}
							})
						}else{
							this.$router.push({
								name: 'f_jcgl',
							})
						}
						
					}else{
						this.$router.push({
							name: 'f_xzjc_xz',
							query: {
								url: 'xzjcedit'
							}
						})
					}
					
				} else {
					this.$router.push({
						name: 'f_xzjc_xz',
					})
				}
			},
			goNext() {
				console.log(this.localObj)
				this.localObj.checkGoods = this.dataList
				this.localObj.step = 3
				if(this.isEdit) {
					sessionStorage.setItem('XZJC_edit', JSON.stringify(this.localObj))
				} else {
					localStorage.setItem('XZJC_add', JSON.stringify(this.localObj))
				}
				this.$router.push({
					name: 'f_xzjc_xxlr'
				})
			},
			changeInput(item, str) {
				if(item[str]) {
					if(item[str].length > 9) {
						item[str] = item[str].slice(0, 9)
					}
					var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
						reg_2 = /^[0-9]{1,}$/;
					if(reg_1.test(item[str]) || reg_2.test(item[str])) {
						if(item[str] > 9999.99) {
							item[str] = '9999.99'
						}
					} else {
						if(item[str]) {
							item[str] = item[str].slice(0, item[str].length - 1)
							if(item[str] > 0) {

							} else {
								item[str] = ''
							}
						}
					}
				}
			},
			blurInput(item, str) {
				if(item[str] > 0) {
					item[str] = parseFloat(item[str]).toFixed(2)
				} else {
					item[str] = '1.00'
				}
			},
		}
	}
</script>
<style lang='scss'>
	#fXzjcXg {
		line-height: .4rem;
		background: white;
		.content {
			padding: 0 0 0 .26rem;
		}
		.goods_list {
			align-items: center;
			font-size: .24rem;
			color: #848484;
			border-bottom: 1px solid #E1E1E1;
			padding: .31rem 0.26rem .31rem .0rem;
			display: flex;
			.list_img {
				margin-right: .3rem;
				width: 1.48rem;
				height: 1.48rem;
				flex-grow: 0;
			}
			.list {
				width: 5rem;
				flex-grow: 1;
				.list_name {
					font-size: .32rem;
					color: #211E1D;
					font-weight: bold;
					margin-bottom: .15rem;
				}
				.list_content {
					display: flex;
					justify-content: space-between;
					.top {
						width: 50%;
						position: relative;
						strong {
							display: inline-block;
							width: .28rem;
							height: .3rem;
							line-height: .4rem;
							content: '';
							font-size: .3rem;
							position: absolute;
							left: 0.1rem;
							bottom: .16rem;
							font-weight: bold;
							color: #FF5000;
						}
					}
					input {
						width: 1.6rem;
						height: .56rem;
						background: rgba(239, 239, 239, 1);
						border: 1px solid rgba(4, 0, 0, 0.23);
						color: #FF5000;
						font-weight: bold;
						font-size: .28rem;
						padding: 0 0rem 0 .4rem;
						font-family: 'PingFang-SC-Bold';
					}
					.bottom {
						width: 50%;
						input {
							padding: 0 .15rem 0 .3rem;
						}
					}
				}
			}
		}
		.goods_list:last-child {
			/*border-bottom: none;*/
		}
	}
</style>