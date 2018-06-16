import CSSModules from 'react-css-modules'
import styles from '../styles/trade.css'
import Header from '../../../components/header/header'
import {Picker} from 'antd-mobile'
import router from 'umi/router'
import {connect} from 'dva'

const TradeHeader = ({code_name,list,code}) => {
    return (
        <div>
            <Header
                title={<Picker data={list} cols={1}>
                    <div>{code_name}</div>
                </Picker>}
                callBack={() => {router.push({pathname:'/trade2',query:{code:code}})}}
                rightText={'规则'}
                rightCallBack={() => {router.push({pathname:'/tradeRule'})}}
                leftCallBack={() =>{router.push({pathname:'/home'})}}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    code_name:state.trade2.code_name,
    code:state.trade2.code,
    list:state.trade2.list
})

export default connect(mapStateToProps)(CSSModules(TradeHeader, styles))

