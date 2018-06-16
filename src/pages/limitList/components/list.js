import React from 'react'
import {connect} from 'dva'
import CSSModules from 'react-css-modules'
import styles from '../styles/tpl.css'
import {Modal} from 'antd-mobile'

class BuyList extends React.Component {
    componentDidMount() {
        const {getList, list} = this.props;
        console.log(list);
        getList();
    }

    render() {
        const {list, reBuildDate, cancel} = this.props;
        return (
            <div>
                {list.length === 0 ? <p style={{textAlign:'center',lineHeight:'25px'}}>暂无挂单信息</p> : ''}
                {list.map((item, index) => (
                    <div key={"position_item_" + index} styleName="trade-wrap">
                        <div styleName="row-2">
                            <ul styleName="clearfix">
                                <li styleName="fl">
                                    <p styleName="title"
                                       style={item.买卖方向 === 0 ? {color: '#01B28E'} : {color: '#E34C4D'}}>{item.买卖方向 === 0 ? '挂单买入' : '挂单卖出'}{item.报单数量}手</p>
                                    <p>{reBuildDate(item.报单日期)}&nbsp;{item.报单时间}</p>
                                </li>
                                <li styleName="fr" style={{marginLeft: '.1rem'}}>
                                    <div styleName="state-blue" onClick={cancel(item)}>撤单</div>
                                </li>
                                <li styleName="fr">
                                    <p styleName="title">￥{item.报单价格}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToPorps = state => ({
    list: state.limitList.list
})

const mapDispatchToProps = dispatch => ({
    cancel: item => () => {
        Modal.alert('确认撤单?', '', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确认', onPress: () => {
                    dispatch({
                        type:'limitList/cancel',
                        item:item
                    })
                }
            }
        ])
    },
    getList: () => {
        dispatch({
            type: 'limitList/getList'
        })
    },
    reBuildDate: (date) => {
        const year = date.slice(0, 4);
        const month = date.slice(4, 6);
        const day = date.slice(6);
        return `${year}-${month}-${day}`
    }
})

export default connect(mapStateToPorps, mapDispatchToProps)(CSSModules(BuyList, styles))
