import CSSModules from 'react-css-modules'
import styles from '../styles/tpl.css'
import {connect} from 'dva'
import {getFormatTime} from "../../../utils/common";

const Example = ({show,choose}) => {
    return (
        <div>
            <div style={{height:'.5rem'}}>
                <div styleName="trade-menu">
                    <ul>
                        <li onClick={choose('buy')}><a styleName={show === 'buy' ? "choose" : ""}>买入</a></li>
                        <li onClick={choose('sell')}><a styleName={show === 'sell' ? "choose" : ""}>卖出</a></li>
                    </ul>
                </div>
            </div>
        </div>

    );
};

const mapStateToProps = state => ({
    show:state.limitLisst.show
})

const mapDispatchToProps = (dispatch,props) => ({
    choose:value => () => {
        if(value === 'buy'){

        }
        if(value === 'sell'){

        }
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(CSSModules(Example, styles))

