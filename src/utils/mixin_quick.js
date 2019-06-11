export default{
	data(){
		return {
			userInfo: JSON.parse(localStorage.getItem('quickUserInfo')),
		}
	},
	created(){
		
	},
	mounted(){
		
	},
	methods:{
		quickQueryGrouplist(){
			return new Promise((resolve,reject)=>{
				this.postRequest('shippingcar/queryGrouplist', {
					buyerId: this.userInfo.typeCode,
				}).then(resp => {
					if(resp.data && resp.data.state == 0) {
						resolve(resp.data)
					}else{
						resolve(resp)
					}
				})
			})
		},
		ceshi(){
			console.log(3)
		}
	}
}
