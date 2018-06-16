import React from 'react'
import {connect} from 'dva'


class BuyList extends React.Component{
    componentDidMount(){
        const {getList} = this.props;
        getList();
    }
    render(){
        return(
            <div></div>
        )
    }
}

const mapStateToPorps = state => ({

})

const mapDispatchToProps = dispatch => ({
    getList:() => {
        dispatch({
            type:'limitList/getList'
        })
    }
})

export default connect(mapStateToPorps,mapDispatchToProps)(BuyList)
