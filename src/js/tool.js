/**css样式修改 
 * @param {object} el 元素
 * @param {string} prop 属性 例如'height'
 * @param {string} val 值 可以是数字
*/
function css(el, prop, val) {
    var style = el && el.style;

    if (style) {
        if (val === void 0) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                val = document.defaultView.getComputedStyle(el, '');
            } else if (el.currentStyle) {
                val = el.currentStyle;
            }

            return prop === void 0 ? val : val[prop];
        } else {
            if (!(prop in style)) {
                prop = '-webkit-' + prop;
            }
            style[prop] = val + (typeof val === 'string' ? '' : 'px');
        }
    }
}
// 简单的下拉slide
function slideDown(ele, time=200) {
    // let ele = this.$refs.ul
    if (!ele) return
    if (!(ele instanceof Element)) {
        ele = ele[0]
    }
    // 初始值
    
    let prevStyle = ele.currentStyle || getComputedStyle(ele, null)
    // console.log('🥖 prevRect: ', prevStyle);
    let overflow = prevStyle.overflow
    css(ele, 'transition', 'max-height ' + time + 'ms');
    ele.style.display = 'block'
    ele.style.overflow = 'hidden'
    let offsetHeight = ele.offsetHeight
    // console.log('🌯 offsetHeight: ', offsetHeight);
    ele.style.maxHeight = '0'
    setTimeout(() => {
        ele.style.maxHeight = offsetHeight + 'px'
        // ele.style.overflow = 'hidden'
    }, 20)
    setTimeout(() => {
        ele.style.maxHeight = 'none'
        // ele.style.display = 'block'
        ele.style.overflow = overflow
        
    }, time)
}
function slideUp(ele,time=200) {
    // let ele = this.$refs.ul
    if (!ele) return
    if (!(ele instanceof Element)) {
        ele = ele[0]
        // if(!(ele instanceof Element)) {
        //     return
        // }
    }
    ele.style.maxHeight = ele.offsetHeight + 'px'
    let overflow =ele.style.overflow // 预先存储overflow初始状态, 后面动画完, 还原
    // ele.style.transition = 'maxHeight .2s'
    css(ele, 'transition', 'max-height ' + time + 'ms');
    ele.style.overflow = 'hidden'
    setTimeout(() => {
        ele.style.maxHeight = '0'
    }, 20)
    setTimeout(() => {
        ele.style.maxHeight = 'none'
        ele.style.display = 'none'
        ele.style.overflow = overflow // 原来是啥就是啥
    }, time)
}
function slideToggle(ele,time=200) {
    if (!ele) return
    if (!(ele instanceof Element)) {
        ele = ele[0]
    }

    // 如果有就slideUp 上滑
    if ( ele.clientHeight) {
        slideUp(ele,time)
        // 没有就 slideDown 下拉
    } else {
        slideDown(ele, time)
    }
}



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

    now() {
        return new Date().valueOf()
    },
    // 节流
    throttle(fn, delay) {
        var lastTime;
        var timer;
        var delay = delay || 200;
        return function () {
            var args = arguments;
            // 记录当前函数触发的时间
            var nowTime = Date.now();
            var self = this;

            if (lastTime && nowTime - lastTime < delay) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    // 记录上一次函数触发的时间
                    lastTime = nowTime;
                    // 修正this指向问题
                    fn.apply(self, args);
                }, delay);
            } else {
                lastTime = nowTime;
                fn.apply(self, args);
            }
        }
    },

    // 防抖
    debounce(fn, delay) {
        // 记录上一次的延时器
        var timer = null;
        var delay = delay || 200;
        return function () {
            var args = arguments;
            var that = this;
            // 清除上一次延时器
            clearTimeout(timer)
            timer = setTimeout(function () {
                fn.apply(that, args)
            }, delay);
        }
    },

    // 去除为param空的 属性
    rmEmpty(obj) {
        let params = {}
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                if (obj[key].length > 0) {
                    params[key] = obj[key]
                }
            } else if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
                params[key] = obj[key]
            }
        }
        return params
    },
    slideDown: slideDown,
    slideUp:slideUp,
    slideToggle: slideToggle,
    /**
     * 修改 元素样式 
     * @param {Object} el 元素Dom
     * @param {String} prop 修改的属性
     * @param {String, Number} val 值
     */
    css: css,


};
export default Tool;