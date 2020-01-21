const Tool = {
    //工具汇总

    //  本地存储类工具************************************************************************* //

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

    // 通用工具类************************************************************************* //
    isType: type => Object.prototype.toString.call(type).slice(8, Object.prototype.toString.call(type).length - 1), // 数据类型判断工具
    // 时间格式化
    formatDate(time, withTime = false) {
        let arr1 = [],
            arr2 = [],
            date = new Date(time);
        arr1.push(date.getFullYear())
        arr1.push(`0${date.getMonth() + 1}`.slice(-2))
        arr1.push(`0${date.getDate()}`.slice(-2))

        if (!withTime) return arr1.join('-')

        arr2.push(`0${date.getHours()}`.slice(-2))
        arr2.push(`0${date.getMinutes()}`.slice(-2))
        arr2.push(`0${date.getSeconds()}`.slice(-2))
        return `${arr1.join('-')} ${arr2.join(':')}`
    },
    // 节流
    throttle(fn, interval = 300) {
        let canRun = true;
        return function () {
            if (!canRun) return;
            canRun = false;
            setTimeout(() => {
                fn.apply(this, arguments);
                canRun = true;
            }, interval);
        };
    },

    // 防抖
    debounce(fun, delay) {
        return function (args) {
            let that = this
            let _args = args
            clearTimeout(fun.id)
            fun.id = setTimeout(function () {
                fun.call(that, _args)
            }, delay)
        }
    },
    // 去除为param空的 属性 (不支持空对象。。)
    rmEmpty(obj) {
        let params = {}
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                if (obj.length > 0) {
                    params[key] = obj[key]
                }
            } else if (obj[key] !== '' && obj[key] !== null) {
                params[key] = obj[key]
            }
        }
        return params
    },


};
export default Tool;