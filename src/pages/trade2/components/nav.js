import React from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/trade.css'
import {connect} from 'dva'
import 'lodash'

class Nav extends React.Component{
    componentDidMount(){
        const code = sessionStorage.getItem('trade_code');
        const index  = sessionStorage.getItem('trade_index') ? sessionStorage.getItem('trade_index') : 0;
        window.initK(code);
        window.showK(0);
        this.setState({
            index:index
        })
    }
    componentWillUnmount(){
        // window.hideK();
    }
    state = {
        k_nav:['分时','1分钟','5分钟','15分钟','30分钟','60分钟'],
        choose:'分时',
        index:0,
    }

    choose = (value,index) => () =>{
        window.showK(index);
        this.setState({
            choose:value,
            index:index
        })
        sessionStorage.setItem('trade_index',index);
    }
    render(){
        const _this = this;
        return(
            <div>
                <nav styleName="k-nav">
                    {this.state.k_nav.map((item,index) => (
                        <div style={index == _this.state.index ? {borderBottom:'1px solid #fff'} : {}} key={'k_nav_'+index}
                             styleName="k-nav-item"
                             onClick={this.choose(item,index)}>
                            {item}
                        </div>
                    ))}
                </nav>
            </div>
        )
    }
}

export default CSSModules(Nav, styles)

