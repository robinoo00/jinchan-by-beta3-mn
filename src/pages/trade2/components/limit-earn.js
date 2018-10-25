import React from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/limit-earn.less'
import {Flex} from 'antd-mobile'

class LimitEarn extends React.Component {
    componentDidMount() {

    }

    render() {
        return (
            <Flex>
                <Flex.Item>
                    止损:<input type="text" value={0}/>
                </Flex.Item>
                <Flex.Item>止盈:<input type="text" value={0}/></Flex.Item>
                <Flex.Item>
                </Flex.Item>
            </Flex>
        )
    }
}

export default CSSModules(LimitEarn, styles)
