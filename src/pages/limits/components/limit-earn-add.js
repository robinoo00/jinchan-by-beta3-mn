import React from 'react'
import {Modal, List, Button,InputItem,Toast, Tag, Flex} from 'antd-mobile'
import {connect} from 'dva'
import {createForm} from 'rc-form'

let id = 0;

class LimitEarn extends React.Component{
    render(){
        const {code,visible,inputs,hide,form,submit,list} = this.props;
        return(
            <Modal
                popup
                visible={visible}
                onClose={hide}
                animationType="slide-up"
            >
                <List
                    renderHeader={() => <div>
                    止损止盈({code})
                </div>} className="popup-list">
                    {/*<List.Item>*/}
                        {/*<Flex>*/}
                            {/*<Flex.Item style={{textAlign:'center'}}>*/}
                                {/*<Tag selected onClose={() => {*/}
                                    {/*return*/}
                                {/*}}>买入</Tag>*/}
                            {/*</Flex.Item>*/}
                            {/*<Flex.Item style={{textAlign:'center'}}>*/}
                                {/*<Tag readonly>卖出</Tag>*/}
                            {/*</Flex.Item>*/}
                        {/*</Flex>*/}
                    {/*</List.Item>*/}
                    {inputs.map((i, index) => (
                            <InputItem
                                {...form.getFieldProps(i.name,{
                                    // rules: [{
                                    //     required: true, message: i.placeholder,
                                    // }],
                                })}
                                key={index}
                                clear
                                placeholder={i.placeholder}
                            >{i.text}</InputItem>
                    ))}
                    <List.Item>
                        <Button inline style={{width:'47%',height:'40px',lineHeight:'40px'}} onClick={hide}>取消</Button>
                        <Button inline type="primary"style={{width:'47%',float:'right',height:'40px',lineHeight:'40px'}} onClick={submit}>设置</Button>
                    </List.Item>
                </List>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    code:state.limits.code,
    visible:state.limits.limit_earn.visibleAdd,
    inputs:state.limits.limit_earn.inputs,
    list:state.limits.list
})

const mapDispatchToProps = (dispatch,props) => ({
    submit: () => {
        props.form.validateFields({force: true}, (error) => {
            if (!error) {
                let value = props.form.getFieldsValue();
                dispatch({
                    ...value,
                    type:'limits/add',
                })
            } else {
                const errors = Object.values(error);
                Toast.info(errors[0]['errors'][0]['message'], 1);
            }
        });
    },
    hide: () => {
        dispatch({
            type:'limits/hideLimitEarn'
        })
    }
})

export default createForm()(connect(mapStateToProps,mapDispatchToProps)(LimitEarn))

