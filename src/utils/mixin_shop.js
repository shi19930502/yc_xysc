export default {
	data() {
		return {
			carIds: [], // 创建购物车返回的id
			ShippingcarList: [], // 购物车数据
			alreadyChosenGoods: [], // 购物车当前供应商已经选择的商品
			orderTotal: 0 // 当前店铺选择商品总价
		}
	},
	methods: {
		/**
		 * 创建购物车
		 */
		createShippingcar(sku, method) {
			var saveUrl;
			var params = {
				buyerId: this.userInfo.typeCode,
				productId: sku.productId,
				productName: sku.productName,
				skuId: sku.id,
				skuName: sku.name,
				quantity: sku.quantity,
				comment: sku.remark,
				sellerId: this.sellerId,
			}

			if(sku.skuId) {
				params.skuId = sku.skuId
			}
			if(sku.skuName) {
				params.skuName = sku.skuName
			}
			// 判断是否新增是否更新
			var skuIdsArr = []
			for(var item of this.carIds) {
				skuIdsArr.push(item.skuId)
			}

			if(!this.isInArray(skuIdsArr, params.skuId)) {
				saveUrl = 'shippingcar/create'
				this.postRequest(saveUrl, params).then(d => {
					if(d.data && d.data.state == 0) {
						var o = {
							skuId: sku.id || sku.skuId,
							carId: d.data.aaData.id
						}
						this.carIds.push(o)
						sku.oldquantity = sku.quantity
						this.getShippingcarList()
					}else{
						this.$dialog.toast({
		                    mes: d.data.msg,
		                    timeout: 1500
		              	});
						sku.quantity = null
					}
				})
			} else {
				if(sku.quantity == 0) {
					saveUrl = 'shippingcar/delete'
				} else {
					saveUrl = 'shippingcar/update'
				}
				for(var i in this.carIds) {
					if(this.carIds[i].skuId == sku.id || this.carIds[i].skuId == sku.skuId) {
						params.id = this.carIds[i].carId
					}
				}
				this.postRequest(saveUrl, params).then(d => {
					if(d.data && d.data.state == 0) {
						sku.oldquantity = sku.quantity
						this.getShippingcarList()
					}else{
						this.$dialog.toast({
		                    mes: d.data.msg,
		                    timeout: 1500
		              	});
		              	sku.quantity = sku.oldquantity
//		              	if(method=='add'){
//		              		sku.quantity = (sku.quantity - 0 - 1).toFixed(2);
//							if(sku.skuMethodType == 2) {
//								sku.quantity = parseInt(parseFloat(sku.quantity))
//							}
//		              	}else{
//		              		if(sku.quantity == 0){
//								sku.quantity = sku.oldquantity
//		              		}else if(method=='shuru'){
//								sku.quantity = sku.oldquantity
//		              		}else{
//		              			sku.quantity = (sku.quantity - 0 + 1).toFixed(2);
//								if(sku.skuMethodType == 2) {
//									sku.quantity = parseInt(parseFloat(sku.quantity))
//								}
//		              		}
//		              	}
						
					}
				})
			}
		},
		/**
		 * 获取购物车
		 */
		getShippingcarList(flg,flg_1) {
			this.postRequest('shippingcar/queryGrouplist', {
				buyerId: this.$root.userInfo.typeCode,
				sellerId: this.$route.query.sellerId
			}).then(d => {
				if(d.data && d.data.state == 0) {
					this.ShippingcarList = d.data.aaData
					var carIds = []
					this.alreadyChosenGoods = []
					for(var i in d.data.aaData) {
						if(this.sellerId == i) {
							this.alreadyChosenGoods = d.data.aaData[i]
						}
						for(var item of d.data.aaData[i]) {
							var o = {
								skuId: item.skuId,
								carId: item.id
							}
							carIds.push(o)
						}
					}
					this.carIds = carIds
					// 计算总价
					var selectGoodsArr=[]
					for(let a=0;a<this.alreadyChosenGoods.length;a++){
						for(let b=0;b<this.carSettlementGoods.length;b++){
							if(this.alreadyChosenGoods[a].id==this.carSettlementGoods[b]){
								selectGoodsArr.push(this.carSettlementGoods[b])
							}
						}
					}
					this.carSettlementGoods=selectGoodsArr
					if(this.showShopCar&&this.carSettlementGoods.length<=0){
						this.isCheckAll=false
						this.$refs.checklistDemo.$emit('ydui.checklist.checkall', this.isCheckAll);
					}
					
					
					this.orderTotal = this.getOrderTotal(this.alreadyChosenGoods).priceTotal
					if(flg){
						if(flg_1){
							this.getProductList()
						}else{
							this.getCategoryList()
						}
					}
					this.shuru=true;
				}
			})
		},
		/**
		 * 计算商品总价
		 */
		getOrderTotal(arr) {
			var priceTotal = 0;
			var quantityTotal = 0;
			for(var i in arr) {
				quantityTotal += arr[i].quantity

				if(arr[i].promotionPrice > 0 && arr[i].promotionBasePrice > 0) {
					priceTotal += arr[i].quantity * (arr[i].promotionPrice * 100)
				} else {
					priceTotal += arr[i].quantity * (arr[i].price * 100)
				}
			}

			return {
				priceTotal: (priceTotal / 100).toFixed(2),
				quantityTotal: (quantityTotal - 0).toFixed(2)
			}
		},
		/**
		 * 判断数组是否存在某个元素
		 */
		isInArray(arr, element) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i] == element) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 统计店铺访问人数
		 */
		countVisits() {
			this.postRequest('store/countVisits', {
				sellerId: this.sellerId
			}).then(d => {
				if(d.data && d.data.state == 0) {}
			})
		}
	}
}