import * as LimitServices from '../services/tpl'
import {Toast} from 'antd-mobile'

export default {
    namespace: 'limitList',
    state: {
        show: 'buy',
        list:[],
    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/') {

                }
            })
        },
    },

    effects: {
        * getList({}, {put, call}) {
            const {data} = yield call(LimitServices.getList, {});
            if(data){
                yield put({
                    type: 'assignList',
                    list: data
                })
            }
        },
        *cancel({item},{call,put}){
            const {data} = yield call(LimitServices.cancel,{orderid:item.交易所报单编号,exchangeid:item.交易所ID});
            if(data){
                if(data.状态){
                    yield put({
                        type:'getList'
                    })
                    Toast.info("撤单成功");
                }else{
                    Toast.info("撤单失败");
                }
            }
        }
    },

    reducers: {
        assignList(state, {list}) {
            return {
                ...state,
                list: list
            }
        }
    },

};
