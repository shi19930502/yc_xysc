import configs from '../configs'
export default {
	data() {
		return {
			city: CITY,
			imgURL: configs.imgURL,
			userInfo: '',
			isFirstGYS: false,
			config: CONFIG,
		}
	},
	watch:{
		userInfo:function(val){
			if(val&&SYSTEMID==8){
				if(val.userId||val.userId==0){
					if(localStorage.getItem('userId')){
						if(localStorage.getItem('userId')!=val.userId){
							localStorage.setItem('TJSP_add','')
						}
					}
					localStorage.setItem('userId',val.userId)
				}
			}
			
		},
	},
	created() {
		if(ADDR == 'all' || ADDR == 'beihuan') {
			this.isFirstGYS = true
		}
		console.log(this.config.isTowGYS)
	},
	mounted() {
		this.userInfo=JSON.parse(localStorage.getItem('quickUserInfo'))
		if(this.config.typeId){
			if(this.config.systemid == 7 && (this.config.typeId == 'merchant'||this.config.typeId == 'buyer'||this.config.typeId == 'merchant_buyer')) {
				this.$dialog.confirm({
					title: '提示：',
					mes: '登录账号与系统不符,请重新登录！',
					opts: [{
						txt: '确定',
						color: true,
						callback: () => {
							this.$router.push({
								name: 'f_login'
							})
						}
					}]
				});
			}
		}
	},
	methods: {
		getDate() {
			var date = new Date();
			var year = date.getFullYear()
			var month = date.getMonth()
			var day = date.getDate()
			var h = date.getHours();
			var min = date.getMinutes();
			var s = date.getSeconds()
			//			+ ":" + (s < 10 ? '0' + s : s)
			var d = date.getFullYear() + '-' + (month < 9 ? '0' + (month + 1) : (month + 1)) + '-' + (day < 10 ? '0' + day : day) +
				' ' + (h < 10 ? '0' + h : h) + ":" + (min < 10 ? '0' + min : min)
			return d
		},
		yugi(n) {
			var now = new Date;
			now.setDate(now.getDate() - n);
			var nowY = now.getFullYear();
			var nowM = now.getMonth() + 1;
			var nowD = now.getDate();
			var enddate = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
			console.log(enddate)
			return enddate;
		},
		//获取是否PC端
		isPcOS() {
			var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
			if(isWin) return true; //'Win'
			var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
			if(isMac) return true; //'Mac'
			var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
			if(isUnix) return true; //'Unix'
			var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
			if(isLinux) return true; //'Linux'
		},
		carReg(str){
			if(this.config.carReg){
				return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str)
			}else{
				return true
			}
		}

	}
}