<template>
	<yd-layout>
		<div id="UserAddress">
			<yd-scrolltab>
				<ul>
					<li v-for="d in AddressList">
						<div class="flex flex-y-center flex-x-between">
							<div @click="getAddressBack(d)">
								<h1>{{d.completeAddress}}</h1>
								<p>
									<span>{{d.contacts}}</span>
									<span>{{d.phoneNumber}}</span>
								</p>
							</div>
							<div>
								<yd-icon name="compose" color="#989E92" @click.native="toEditAddress(d)"></yd-icon>
							</div>
						</div>
					</li>
				</ul>
			</yd-scrolltab>
			<div class="btn flex flex-y-center flex-x-center" @click="toUserNewAddress" v-if="showAddBtn">
				<img src="../../assets/imgs/caigou_icon_add.png" style="width: 0.44rem;">
				<span class="btntext">
        <strong>新增地址</strong>
      </span>
			</div>
		</div>
	</yd-layout>
</template>
<script>
	import mixin from '../../utils/mixin.js'
	export default {
		mixins: [mixin],
		data() {
			return {
				showAddBtn: true,
				AddressList: []
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '收货地址')
			this.getAddress()
		},
		mounted() {

		},
		methods: {
			/**
			 * 获取收货地址列表
			 */
			getAddress() {
				this.postRequest('address/queryByCustomerId', {
					customerId: this.userInfo.typeCode
				}).then(d => {
					if(d.data && d.data.state == 0) {
						if(d.data.aaData) {
							this.showAddBtn = false
							this.AddressList = [d.data.aaData]
						}else{
//							this.$dialog.confirm({
//			                    mes: '亲，你还没有一个地址哟~~去新增一个吧！',
//			                    opts: [
//			                     {
//		                            txt: '取消',
//		                            color: false,
//		                            callback: () => {
//		                            	
//		                            }
//		                        },
//			                        {
//			                            txt: '确定',
//			                            color: true,
//			                            callback: () => {
//			                                this.toUserNewAddress()
//			                            }
//			                        }
//			                    ]
//			                });
						}
					}
				})
			},
			/**
			 * 新增地址
			 */
			toUserNewAddress() {
				this.$router.push({
					name: 'UserNewAddress'
				})
			},
			/**
			 * 修改地址
			 */
			toEditAddress(d) {
				//         this.$router.push({
				//           name: 'UserNewAddress',
				//           params: {
				//             addressInfo: d,
				//             type: 'eidt'
				//           }
				//         })
				this.$router.push({
					name: 'UserNewAddress'
				})
				this.$store.dispatch('setSelectedAddress', d)
			},
			/**
			 * 选择收货地址
			 */
			getAddressBack(d) {
				this.$store.dispatch('setSelectedAddress', d)
				this.$router.push({
					name:'settleAccounts'
				});
			}
		}
	};
</script>
<style lang="scss">
	#UserAddress {
		.yd-scrolltab {
			bottom: 1rem;
		}
		.yd-scrolltab-content {
			padding: 0;
			background: none;
		}
		ul::-webkit-scrollbar {
			display: none;
		}
		ul {
			height: 100%;
			overflow-y: auto;
			li {
				border-bottom: 1px solid #ddd;
				background: #fff;
				h1 {
					font-size: 0.3rem;
					padding-right: 0.2rem;
				}
				p {
					color: #989E92;
				}
				padding :0.25rem;
			}
		}
		.btn {
			width: 100%;
			position: fixed;
			bottom: 0;
			background: #fff;
			height: 1rem;
			.btntext {
				margin-left: 0.1rem;
				color: #6FB138;
				font-size: 0.3rem;
			}
		}
	}
</style>