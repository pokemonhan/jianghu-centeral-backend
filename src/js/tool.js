const Tool = {//工具汇总

    // TODO 本地存储类工具************************************************************************* //

    setSession: (key, val) => sessionStorage.setItem(key, JSON.stringify(val)),//保存本地信息
    getSession: key => JSON.parse(sessionStorage.getItem(key)),//获取本地信息
    removeSession: key => sessionStorage.removeItem(key),  // 清除session

    setCookie: (key, val) => document.cookie = key + '=' + val,//保存本地cookie信息
    getCookie: key => { //获取本地cookie信息
        let val = false;
        document.cookie.split("; ").map(item => {
            if (item.split("=")[0] === key)
                val = item.split("=")[1]
        });
        return val
    },
    removeCookie: key => {//删除本地cookie信息
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        if (all.tool.getCookie(key) !== null) {
            all.tool.setCookie(key, all.tool.getCookie(key) + ";expires=" + exp.toGMTString())
        }
    },
    setLocal: (key, val) => localStorage.setItem(key, JSON.stringify(val)), // 设置localStorage
    getLocal: key => JSON.parse(localStorage.getItem(key)),  // 获取localStorage
    // 工具类别分割线--------------------------------------------------------------------------------------------- //

    // TODO 通用工具类************************************************************************* //
    isType: type => Object.prototype.toString.call(type).slice(8, Object.prototype.toString.call(type).length - 1), // 数据类型判断工具
    // 时间格式化
    formatDate(time, withTime=false) {
        let arr1 = [],
            arr2 = [],
            date = new Date(time);
        arr1.push(date.getFullYear())
        arr1.push(`0${date.getMonth() + 1}`.slice(-2))
        arr1.push(`0${date.getDate()}`.slice(-2))

        if(!withTime) return arr1.join('-')

        arr2.push(`0${date.getHours()}`.slice(-2))
        arr2.push(`0${date.getMinutes()}`.slice(-2))
        arr2.push(`0${date.getSeconds()}`.slice(-2))
        return `${arr1.join('-')} ${arr2.join(':')}`
    },
    // 节流
    throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : getnow();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = getnow();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    },
    // 防抖
    debounce(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
    
        var later = function() {
            var last = getnow() - timestamp;
    
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };
    
        return function() {
            context = this;
            args = arguments;
            timestamp = getnow();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
    
            return result;
        };
    },
    // 去除为param空的 属性 (不支持空对象。。)
    rmEmpty(obj) {
        let params = {}
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                if (obj.length > 0) {
                    params[key] = obj[key]
                }
            } else if (obj[key] !== '') {
                params[key] = obj[key]
            }
        }
        return params
    },


};
export default Tool;