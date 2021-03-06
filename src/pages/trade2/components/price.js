import CSSModules from 'react-css-modules'
import styles from '../styles/price.less'
import React from 'react'
import {Toast} from 'antd-mobile'
import Btns from './btns'
import config from "../../../utils/config";
import {connect} from 'dva'

let id = 0

class Price extends React.Component{
    constructor(){
        super()
    }
    state = {
        data:{
            买价:0,
            买量:0,
            卖价:0,
            卖量:0,
            最新价:0,
            合约别名:''
        },
        list:[]
    }
    componentWillMount() {
        Toast.loading('加载中...', 0);
        let data = sessionStorage.getItem(config.K_DATA_LIST);
        if (typeof data != 'undefined') {
            Toast.hide();
            this.assignData(data);
            this.assignList(data);
        }
        id = setInterval(() => {
            data = sessionStorage.getItem(config.K_DATA_LIST);
            if (typeof data != 'undefined') {
                Toast.hide();
                this.assignData(data);
                this.assignList(data);
            }
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(id);
    }
    assignData = (resource) => {
        const code =sessionStorage.getItem(config.TRADE_CODE);
        const list = JSON.parse(resource);
        const data = list.filter(item => item.合约 === code)[0];
        const {assignPriceData} = this.props;
        assignPriceData(data);
        // this.setState({
        //     data:data
        // })
    }
    assignList(data){
        this.setState({
            list:JSON.parse(data)
        })
    }
    render(){
        const {data} = this.props;
        return(
            <div>
                <div styleName="price-detail">
                    <div styleName="detail-left">
                        <div styleName="detail-left-top">
                            <div styleName="detail-left-item">买价：{data.买价}</div>
                            <div styleName="detail-left-item">买量：{data.买量}</div>
                        </div>
                        <div styleName="detail-left-top">
                            <div styleName="detail-left-item">卖价：{data.卖价}</div>
                            <div styleName="detail-left-item">卖量：{data.卖量}</div>
                        </div>
                    </div>
                    <div styleName="detail-right">
                        <div style={{textAlign:'center'}}>最新价</div>
                        <div styleName="detail-right-item">{data.最新价}</div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    data:state.trade2.price_data
})

const mapDispatchToProps = dispatch => ({
    assignPriceData: data => {
        dispatch({
            type:'trade2/assignPriceData',
            data:data
        })
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(CSSModules(Price, styles))

