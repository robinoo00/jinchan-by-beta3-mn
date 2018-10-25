import * as LimitServices from '../services/limits'
import {Toast} from 'antd-mobile'
let loading = false;

export default {
    namespace: 'limits',
    state: {
        code:'',
        nav_show:false,
        nav_choose:'充值',
        nav_list:[
            {title:'充值',choose:true},
            {title:'提现',choose:false},
            {title:'收入',choose:false},
            {title:'支出',choose:false},
        ],
        list:[],
        page:0,
        nomore:false,
        tempdata:{},
        limit_earn: {
          inputs:[
            {
              text:'止损点数',placeholder:'请输入止损点数',name:'tickLoss'
            },
            {
              text:'止赢点数',placeholder:'请输入止赢点数',name:'tickProfit'
            },
          ],
          data:{},
          visible:false,
          visibleAdd:false,
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({pathname,query}) => {
                if(pathname === '/limits'){
                    if(query.code){
                        dispatch({
                            type:'assignCode',
                            code:query.code
                        })
                    }
                }
            })
        },
    },

    effects: {
        *getList({page =1},{call,put,select}){
            const code = yield select(state => state.limits.code);
            const {data} = yield call(LimitServices.getList,{page:page,instrument:code})
            loading = false;
            if(data){
                const position_list = yield select(state => state.tradeList.position_list);
                for(let item of data){
                    for(let item2 of position_list){
                        if(item.方向 === item2[3] && item.品种 === item2[2]){
                            item['均价'] = item2[5]
                        }
                    }
                }
                if(typeof data.状态 !='undefined' && !data.状态){
                    if(!data.状态){
                        Toast.info(data.信息,1);
                        return;
                    }
                }
                yield put({
                    type:'assignList',
                    data:data,
                    page:page
                })
            }
        },
        *loadMore({},{put,select}){
            if(!loading){
                const page = yield select(state => state.limits.page);
                const nomore = yield select(state => state.limits.nomore);
                if(!nomore){
                    yield put({
                        type:'getList',
                        page:page + 1
                    })
                }
                loading = true;
            }
        },
        *add({tickProfit = 0,tickLoss = 0},{call,select,put}){
            const item = yield select(state => state.limits.tempdata)
            const post_data = {
                instrument:item[2],
                direction:item[3],
                profit:tickProfit,
                loss:tickLoss,
                type:1
            }
            const {data} = yield call(LimitServices.modify,post_data)
            if(data){
                if(data.id == 0){
                    Toast.info('设置成功',1)
                }else{
                    Toast.info('设置失败',1)
                }
                yield put({
                    type:'hideLimitEarn'
                })
            }
        },
        *modify({tickProfit = 0,tickLoss = 0},{call,select,put}){
            const item = yield select(state => state.limits.limit_earn.data)
            const post_data = {
              instrument:item['品种'],
              direction:item['方向'],
              profit:tickProfit,
              loss:tickLoss,
              type:1
            }
            const {data} = yield call(LimitServices.modify,post_data)
            if(data){
              if(data.id == 0){
                Toast.info('设置成功',1)
              }else{
                Toast.info('设置失败',1)
              }
                yield put({
                    type:'hideLimitEarn'
                })
            }
        }
    },

    reducers: {
        assignTempData(state,{data}){
            return {
                ...state,
                tempdata:data,
            }
        },
        assignLimitEarnData(state,{data}){
            return{
                ...state,
                limit_earn:{
                    ...state.limit_earn,
                    data:data
                }
            }
        },
        showLimitEarnAdd(state, {}){
            return {
                ...state,
                limit_earn:{
                    ...state.limit_earn,
                    visibleAdd:true
                }
            }
        },
        showLimitEarn(state, {}){
            return {
                ...state,
                limit_earn:{
                    ...state.limit_earn,
                    visible:true
                }
            }
        },
        hideLimitEarn(state,{}){
            return {
                ...state,
                limit_earn:{
                    ...state.limit_earn,
                    visible:false,
                    visibleAdd:false
                }
            }
        },
        cancelLimit(state,{id}){
            const list = state.list;
            for(let index in list){
                if(list[index]['id'] === id){
                    list.splice(index,1);
                }
            }
            return {
                ...state,
                list:[...list]
            }
        },
        assignCode(state,{code}){
            return {
                ...state,
                code:code
            }
        },
        assignList(state,{data,page}){
            let nomore = false;
            if(data.length === 0 || data.length < 30){
                nomore = true;
            }
            if(page === 1){
                return {
                    ...state,
                    list:data,
                    page:1,
                    nomore:nomore
                }
            }else{
                return {
                    ...state,
                    list:[...state.list,...data],
                    page:page,
                    nomore:nomore
                }
            }
        },
        toggleShow(state){
            return{
                ...state,
                nav_show:!state.nav_show
            }
        },
        assignChoose(state,{index}){
            let temp = [
                {title:'充值',choose:false},
                {title:'提现',choose:false},
                {title:'收入',choose:false},
                {title:'支出',choose:false},
            ];
            temp[index]['choose'] = true;
            return {
                ...state,
                nav_choose:temp[index]['title'],
                nav_list:[...temp]
            }
        }
    },

};
