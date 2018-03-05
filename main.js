import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './app.vue'
import Routers from './routers.js'
import product_data from './product.js'
import './style.css'

Vue.use(VueRouter);
Vue.use(Vuex);

const RouterConfig={
	mode:'history',
	routes:Routers
};

const router=new VueRouter(RouterConfig);

router.beforeEach((to,from,next)=>{
	window.document.title=to.meta.title;
	next();
});

router.afterEach((to,from,next)=>{
	window.scrollTo(0,0);
});

const store=new Vuex.Store({
	state:{
		productList:[],
		cartList:[]
	},
	getters:{
		brands:state=>{
			const brands=state.productList.map(item=>item.brand);
			return getFilterArray(brands);
		},
		colors:state=>{
			const colors=state.productList.map(item=>item.color);
			return getFilterArray(colors);
		}
	},
	mutations:{
		emptyCart(state){
			state.cartList=[];
		},
		setProductList(state,data){
			state.productList=data;
		},
		addCart(state,id){
			const isAdded=state.cartList.find(item=>item.id===id);
			if(isAdded){
				isAdded.count++;
			}else{
				state.cartList.push({
					id:id,
					count:1
				})
			}
		},
		editCartCount(state,payload){
			const product=state.cartList.find(item=>item.id===payload.id);
			product.count+=payload.count;
		},
		deleteCart(state,id){
			const index=state.cartList.findIndex(item=>item.id===id);
			state.cartList.splice(index,1);
		}
	},
	actions:{
		getProductList(context){
			setTimeout(()=>{
				context.commit('setProductList',product_data);
			},500)
		},
		buy(context){
			return new Promise(resolve=>{
				setTimeout(()=>{
					context.commit('emptyCart');
					resolve();
				},500)
			});
		}
	}
});

function getFilterArray(array) {
	// body...
	const res=[];
	const json={};
	for(let i=0;i<array.length;i++){
		const _self=array[i];
		if(!json[_self]){
			res.push(_self);
			json[_self]=1;
		}
	}
	return res;
}

new Vue({
	el:'#app',
	router:router,
	store:store,
	render:h=>h(App)
});