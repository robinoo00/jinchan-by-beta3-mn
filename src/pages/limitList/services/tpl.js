import request from '../../../utils/request'
import config from '../../../utils/config'

export function getList(values){
    return request(config.server + 'appapi/gdlist',{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body:values
    })
}

export function cancel(values) {
    return request(config.server + 'appapi/chedan',{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body:values
    })
}
