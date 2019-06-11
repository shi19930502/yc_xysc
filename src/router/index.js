import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
var routerArr = [];
var hrefObj = {}
if(window.location.href.indexOf('?') >= 0) {
	CONFIG.isSearch = true;
	var searchArr = window.location.href.split('?')[1].split('#/')[0].split('&');
	console.log(searchArr)
	for(let a = 0; a < searchArr.length; a++) {
		if(searchArr[a].indexOf('=')) {
			hrefObj[searchArr[a].split('=')[0]] = searchArr[a].split('=')[1]
		}
	}
	Object.assign(CONFIG, hrefObj)
}
if(CONFIG.ssbhbgimg) {
	if(CONFIG.loginname) {
		CONFIG.isTowGYS = true
	} else {
		CONFIG.isTowGYS = false
	}
}
console.log(CONFIG.isTowGYS)
if(CONFIG.state) {
	if(CONFIG.state.indexOf('Y') >= 0) {
		//		CONFIG.goUrl = CONFIG.state.split('=')[1].split('Y')[1]
		CONFIG.goUrl = CONFIG.state.split('Y')[1]
	} else if(CONFIG.state.indexOf('fLogin') >= 0) {
		CONFIG.goUrl = 'fLogin'
	}
}
//微信地址栏拆分
if(CONFIG.goUrl) {
	if(CONFIG.goUrl == 'fLogin') {
		CONFIG.urlStr = 'f_login'
		CONFIG.resolveStr = '../views/f_login.vue'
	} else {
		CONFIG.urlStr = 'qrcodelogin'
		CONFIG.urlName = ''
		CONFIG.resolveStr = '../views/QRcodeLogin.vue'
	}
} else {
	//普通的地址栏拆分
	if(ADDR == 'beihuan' || ADDR == 'all') {
		CONFIG.urlStr = 'f_login'
		CONFIG.urlName = ''
		CONFIG.resolveStr = '../views/f_login.vue';

	} else {
		CONFIG.urlName = 'Index'
		CONFIG.urlStr = '/Login'
		CONFIG.resolveStr = '../views/Index.vue'
	}
}
var beihuanArr = [{
	path: '/',
	name: CONFIG.urlName,
	redirect: CONFIG.urlStr,
	component: resolve => {
		require([CONFIG.resolveStr], resolve)
	},
}, {
	path: '/f_login', //登录
	name: 'f_login',
	component: resolve => require(['../views/f_login.vue'], resolve)
}, {
	path: '/f_ddgl', //订单管理
	name: 'f_ddgl',
	component: resolve => require(['../views/firstGYS/f_ddgl.vue'], resolve)
}, {
	path: '/f_setting', //订单管理
	name: 'f_setting',
	component: resolve => require(['../views/firstGYS/f_setting.vue'], resolve)
}, {
	path: '/f_ddxq', //订单详情
	name: 'f_ddxq',
	component: resolve => require(['../views/firstGYS/f_ddxq.vue'], resolve)
}, {
	path: '/f_index', //一批首页
	name: 'f_index',
	component: resolve => require(['../views/firstGYS/f_index.vue'], resolve)
}, {
	path: '/f_jcgl', //进场管理
	name: 'f_jcgl',
	component: resolve => require(['../views/firstGYS/f_jcgl.vue'], resolve)
}, {
	path: '/f_jcxq', //进场详情
	name: 'f_jcxq',
	component: resolve => require(['../views/firstGYS/f_jcxq.vue'], resolve)
}, {
	path: '/f_plcz', //批量操作
	name: 'f_plcz',
	component: resolve => require(['../views/firstGYS/f_plcz.vue'], resolve)
}, {
	path: '/f_spgl', //商品管理
	name: 'f_spgl',
	component: resolve => require(['../views/firstGYS/f_spgl.vue'], resolve)
}, {
	path: '/f_tjsp_xg', //添加商品修改
	name: 'f_tjsp_xg',
	component: resolve => require(['../views/firstGYS/f_tjsp_xg.vue'], resolve)
}, {
	path: '/f_tjsp_xz', //添加商品选择
	name: 'f_tjsp_xz',
	component: resolve => require(['../views/firstGYS/f_tjsp_xz.vue'], resolve)
}, {
	path: '/f_xzjc_xg', //新增进场修改
	name: 'f_xzjc_xg',
	component: resolve => require(['../views/firstGYS/f_xzjc_xg.vue'], resolve)
}, {
	path: '/f_xzjc_xxlr', //新增进场信息录入
	name: 'f_xzjc_xxlr',
	component: resolve => require(['../views/firstGYS/f_xzjc_xxlr.vue'], resolve)
}, {
	path: '/f_xzjc_xz', //新增进场选择
	name: 'f_xzjc_xz',
	component: resolve => require(['../views/firstGYS/f_xzjc_xz.vue'], resolve)
}, {
	path: '/f_search', //新增进场选择
	name: 'f_search',
	component: resolve => require(['../views/firstGYS/f_search.vue'], resolve)
}, {
	path: '/f_xzjc_car', //新增进场选择
	name: 'f_xzjc_car',
	component: resolve => require(['../views/firstGYS/f_xzjc_car.vue'], resolve)
}, {
	path: '/f_tjfx', //新增进场选择
	name: 'f_tjfx',
	component: resolve => require(['../views/firstGYS/f_tjfx.vue'], resolve)
}, {
	path: '/f_feedback', //反馈信息
	name: 'f_feedback',
	component: resolve => require(['../views/firstGYS/f_feedback.vue'], resolve)
}];
var elseArr = [{
	path: '/',
	name: CONFIG.urlName,
	redirect: CONFIG.urlStr,
	component: resolve => {
		require([CONFIG.resolveStr], resolve)
	},
}, {
	path: '/Login',
	name: 'Login',
	component: resolve => require(['../views/Login.vue'], resolve)
}, {
	path: '/Shop',
	name: 'Shop',
	component: resolve => require(['../views/shop/ShopList.vue'], resolve),
}, {
	path: '/ShopDetails',
	name: 'ShopDetails',
	component: resolve => require(['../views/shop/ShopDetails.vue'], resolve),
}, {
	path: '/ShopEvaluateList',
	name: 'ShopEvaluateList',
	component: resolve => require(['../views/shop/ShopEvaluateList.vue'], resolve)
}, {
	path: '/OrderSettlement',
	name: 'OrderSettlement',
	component: resolve => require(['../views/order/OrderSettlement.vue'], resolve),
}, {
	path: '/OrderTracking',
	name: 'OrderTracking',
	component: resolve => require(['../views/order/OrderTracking.vue'], resolve),
}, {
	path: '/OrderDetails',
	name: 'OrderDetails',
	component: resolve => require(['../views/order/OrderDetails.vue'], resolve),
}, {
	path: '/OrderEvaluate',
	name: 'OrderEvaluate',
	component: resolve => require(['../views/order/OrderEvaluate.vue'], resolve),
}, {
	path: '/OrderEvaluateSuccess',
	name: 'OrderEvaluateSuccess',
	component: resolve => require(['../views/order/OrderEvaluateSuccess.vue'], resolve),
}, {
	path: '/ChoiceOfPayment',
	name: 'ChoiceOfPayment',
	component: resolve => require(['../views/order/ChoiceOfPayment.vue'], resolve),
}, {
	path: '/OrderCheckoutSuccess',
	name: 'OrderCheckoutSuccess',
	component: resolve => require(['../views/order/OrderCheckoutSuccess.vue'], resolve),
}, {
	path: '/UserSetting',
	name: 'UserSetting',
	component: resolve => require(['../views/user/UserSetting.vue'], resolve),
}, {
	path: '/UserShoppingCart',
	name: 'UserShoppingCart',
	component: resolve => require(['../views/user/UserShoppingCart.vue'], resolve),
}, {
	path: '/UserCenter',
	name: 'UserCenter',
	component: resolve => require(['../views/user/UserCenter.vue'], resolve),
}, {
	path: '/UserMessage',
	name: 'UserMessage',
	component: resolve => require(['../views/user/UserMessage.vue'], resolve),
}, {
	path: '/UserCollection',
	name: 'UserCollection',
	component: resolve => require(['../views/user/UserCollection.vue'], resolve),
}, {
	path: '/UserAddress',
	name: 'UserAddress',
	component: resolve => require(['../views/user/UserAddress.vue'], resolve),
}, {
	path: '/UserNewAddress',
	name: 'UserNewAddress',
	component: resolve => require(['../views/user/UserNewAddress.vue'], resolve),
}, {
	path: '/UserReg',
	name: 'UserReg',
	component: resolve => require(['../views/user/UserReg.vue'], resolve),
}, {
	path: '/UserCustomerService',
	name: 'UserCustomerService',
	component: resolve => require(['../views/user/UserCustomerService.vue'], resolve)
}, {
	path: '/Test',
	name: 'Test',
	component: resolve => require(['../views/test/Test.vue'], resolve)
}, {
	path: '/ShoppingCart',
	name: 'ShoppingCart',
	component: resolve => require(['../views/test/ShoppingCart.vue'], resolve)
}, {
	path: '/ProductList',
	name: 'ProductList',
	component: resolve => require(['../views/test/ProductList.vue'], resolve)
}, {
	path: '/Enshrine',
	name: 'Enshrine',
	component: resolve => require(['../views/quickOrder/Enshrine.vue'], resolve)
}, {
	path: '/Merchant',
	name: 'Merchant',
	component: resolve => require(['../views/quickOrder/Merchant.vue'], resolve)
}, {
	path: '/ShopCar',
	name: 'ShopCar',
	component: resolve => require(['../views/quickOrder/ShopCar.vue'], resolve)
}, {
	path: '/settleAccounts',
	name: 'settleAccounts',
	component: resolve => require(['../views/quickOrder/SettleAccounts.vue'], resolve)
}, {
	path: '/quickSuccess',
	name: 'quickSuccess',
	component: resolve => require(['../views/quickOrder/QuickSuccess.vue'], resolve)
}, {
	path: '/QuickLookOrder',
	name: 'QuickLookOrder',
	component: resolve => require(['../views/quickOrder/QuickLookOrder.vue'], resolve)
}, {
	path: '/QuickOrderDetails',
	name: 'QuickOrderDetails',
	component: resolve => require(['../views/quickOrder/QuickOrderDetails.vue'], resolve)
}, {
	path: '/SearchAllGoods',
	name: 'SearchAllGoods',
	component: resolve => require(['../views/quickOrder/SearchAllGoods.vue'], resolve)
}, {
	path: '/SearchShopGoods',
	name: 'SearchShopGoods',
	component: resolve => require(['../views/quickOrder/SearchShopGoods.vue'], resolve)
}, {
	path: '/qrcodelogin',
	name: 'qrcodelogin',
	component: resolve => require(['../views/QRcodeLogin.vue'], resolve)
}, {
	path: '/selectAddr',
	name: 'selectAddr',
	component: resolve => require(['../views/user/SelectAddr.vue'], resolve)
}, ]

if(ADDR == 'beihuan') {
	routerArr = beihuanArr
} else if(ADDR == 'all') {
	routerArr = beihuanArr.concat(elseArr)
} else {
	routerArr = elseArr
}
export default new Router({
	routes: routerArr
})