/**
 * Created by xiaogang on 2018/10/18.
 *
 */
"use strict";

window.personal = window.personal || {};
personal.ajax = personal.ajax || {};

let ajaxQueue = [];
let promiseQueue = [];
let flag = false;

(function () {
    let _this = this;
    //传统的 callback 模式 队列实现很简单
    this._ajax = function (params) {
        if (!flag) {
            ajaxQueue.push(params);
            return;
        }

        $.ajax({
            type: params.type || 'get',
            url: params.url,
            data: params.data || {},
            success: function (data, status, xhr) {
                params.callback(data, status, xhr);
            },
            error: function (xhr, errorType, error) {
                params.callback(xhr, errorType, error);
            }
        })
    }


    this.axiosCallback = function (params) {
        if (!flag) {
            promiseQueue.push(params);

        } else {
            return axiosAjax(params, false)
        }


    }

}).call(personal.ajax);


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
        return isPromise ? res.data : void params.callback(res.data, 100, 'ok');
    }).catch((err = {}) => {
        return isPromise ? Promise.reject(err) : void params.callback(err, 0, 'err');
    })
}

let timerClose = _timer(function () {
    console.log('------timer-----')
    if (ajaxQueue.length) {
        console.log('flag=>' + flag)
        personal.ajax._ajax(ajaxQueue.shift());

        personal.ajax.axiosCallback(promiseQueue.shift());
    }
}, 100);


setTimeout(function () {
    flag = true;
    console.log('------flag-----');
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