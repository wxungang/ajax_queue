/**
 * Created by xiaogang on 2018/10/18.
 *
 */
"use strict";

window.personal = window.personal || {};
personal.ajax = personal.ajax || {};

let promiseAjaxQueue = [];
let flag = false;

(function () {
    let _this = this;


    this.ajax = function (params) {
        if (!flag) {

            return new Promise((resolve, reject) => {
                let _params = Object.assign({resolve, reject}, params)
                promiseAjaxQueue.push(_params);
            })

        } else {
            return axiosAjax(params)
        }

    }

}).call(personal.ajax);


/**
 *
 * @param params
 * @param isPromise
 * @returns {Promise<T>}
 */
function axiosAjax(params, isPromise = true) {
    params.type = params.type || 'get';
    // get/post 字段不一样！
    const _data = params.type === 'get' ? {
        params: params.data
    } : {
        data: params.data
    };

    const _config = Object.assign({
        method: params.type,
        url: params.url
    }, _data);

    return axios(_config).then((res = {}) => {
        // return isPromise ? res.data : void params.callback(res.data, 100, 'ok');
        return params.resolve(res.data);
    }).catch((err = {}) => {
        // return isPromise ? err : void params.callback(err, 0, 'err');
        return params.reject(err);
    })
}

/**
 *
 */
let timerClose = _timer(function () {
    console.log('------timer-----')
    if (promiseAjaxQueue.length) {
        console.log('flag=>' + flag);

        personal.ajax.ajax(promiseAjaxQueue.shift());
    }
}, 100);


setTimeout(function () {
    flag = true;
    console.log('------flag-----')
    timerClose();
}, 1500);


/**
 *
 * @param callback
 * @param timeout
 */
function _timer(callback, timeout = 1000) {
    let _flag = true;

    (function _inner() {
        //先执行
        // callback();
        let _timer = _flag && setInterval(() => {
            _timer && clearInterval(_timer);
            //or 后执行
            callback();
            _inner(callback, timeout);
        }, timeout);
    })();

    return function close() {
        _flag = false;
    }
}