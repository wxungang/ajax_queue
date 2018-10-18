/**
 * Created by xiaogang on 2018/10/18.
 *
 */
"use strict";

window.personal = window.personal || {};
personal.ajax = personal.ajax || {};

let ajaxQueue = [];
let flag = false;

(function () {
    let _this = this;

    this.ajax = function (params) {
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

}).call(personal.ajax);

_timer(function () {
    if (ajaxQueue.length) {
        console.log('flag=>' + flag)
        personal.ajax.ajax(ajaxQueue.shift());
    }
}, 100);

setTimeout(function () {
    flag = true;
    console.log('------flag-----')
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