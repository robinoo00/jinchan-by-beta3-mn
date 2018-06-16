import request from '../../../utils/request'
import config from '../../../utils/config'

export function pay(values){
    // return fetch('http://800.hdlkg.net/index/zhifum',{
    //     method: 'POST',
    //     mode:'no-cors',
    //     headers:{
    //         "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: 'money=11&dongdao=0&alipay=111&account=111'
    // }).then(checkStatus)
    //     .then(parseJSON).then(data => ({data})).catch(err => ({err}));
    return request('http://800.hdlkg.net/index/zhifum',{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body:values
    })
}

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}
