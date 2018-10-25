import Button from '../../../components/button/button'
import styles from '../styles/footer.less'
import {connect} from 'dva'
import React from 'react'

class Footer extends React.Component{
    render(){
        const {data,showLimitEarn,list,tempdata} = this.props;
        const direction = tempdata[3];
        let show_footer = true;
        // console.log(list);
        // console.log(tempdata);
        if(list.length != 0 ){
            for (let item of list){
                if(item['方向'] === direction){
                    show_footer = false
                }
            }
        }
        if(show_footer){
            return(
                <div className={styles["footer-wrap"]}>
                    <Button
                        title={data[3] === 0 ? '添加(买)' : '添加(卖)'}
                        callBack={showLimitEarn}
                    />
                </div>
            )
        }else{
            return(
                <div></div>
            )
        }
    }
}

const mapStateToProps = state => ({
    data:state.limits.tempdata,
    list:state.limits.list,
    tempdata:state.limits.tempdata
})

const mapDispatchToProps = dispatch => ({
    showLimitEarn:() => {
        dispatch({
            type:'limits/showLimitEarnAdd'
        })
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(Footer)
