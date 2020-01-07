import axios from 'axios'
import router from '../router'

const ERROR_MAP = {
    //MenuController
    '300000': '编辑保存有误',
    '300001': '修改失败',
    '300002': '删除失败',
    //BackendAdminGroupController
    '300100': '角色组不存在',
    '300101': '超级管理员组不可修改',
    '300102': '角色组已存在',
    //BackendGameController
    '300200': '游戏,添加失败',
    '300201': '游戏,编辑失败',
    '300202': '游戏,删除失败',
    '300203': '游戏,状态改变失败',
    //BackendGameVendorController
    '300300': '删除失败,请先删除所属该厂商的游戏!',
    '300301': '游戏厂商,删除失败',
    '300302': '游戏厂商,添加失败',
    '300303': '游戏厂商,编辑失败',
    '300304': '游戏厂商,状态改变失败',
    //BackendGameTypeController
    '300400': '删除失败,请先删除所属该分类的游戏!',
    '300401': '游戏分类,删除失败',
    '300402': '游戏分类,添加失败',
    '300403': '游戏分类,编辑失败',
    '300404': '游戏分类,状态改变失败',
    //BackendFinanceTypeController
    '300500': '金流分类,添加失败',
    '300501': '金流分类,修改失败',
    '300502': '金流分类,删除失败',
    '300503': '删除失败,请先删除所属该分类的金流!',
    '300504': '金流分类,状态改变失败',
    //BackendFinanceVendorController
    '300600': '金流厂商,添加失败',
    '300601': '金流厂商,修改失败',
    '300602': '金流厂商,删除失败',
    '300603': '删除失败,请先删除所属该厂商的金流!',
    '300604': '金流厂商,状态改变失败',
    //MerchantAdminUserController
    '300700': '管理员角色组不存在',
    '300701': '管理员不存在',
    '300702': '超级管理员不可修改',
    '300703': '您没有权限操作此管理员',
    '300704': '超级管理员不可删除',
    '300705': '添加厅主失败',
    '300706': '该平台不存在',
    //BackendFinanceChannelController
    '300800': '金流通道,添加失败',
    '300801': '金流通道,修改失败',
    '300803': '金流通道,删除失败',
    '300804': '金流通道,状态改变失败',
    //BackendSystemBankController
    '300900': '系统银行,添加失败',
    '300901': '系统银行,修改失败',
    '300902': '系统银行,删除失败',
    '300903': '删除失败,该银行正在使用!',
    '300904': '系统银行,状态改变失败',
    //BackendSystemDynActivityController
    '301000': '活动,状态改变失败',
    //BackendAdminUserController
    '301100': '管理员不存在',
    '301101': '管理组不存在',
    '301102': '原密码不正确',
    //PlatformController
    '302000': '分配游戏失败!',
    '302001': '游戏移除失败!',
    '302002': '域名格式不正确',
    '302003': '该平台不存在',
    '302004': '站点配置失败，请重新尝试',
    '302005': '尝试修改权限时出现错误',
    //BackendSystemEmailController
    '303000': '邮件保存失败!',
}


const BASE_PATH = location.protocol + '//api.jianghu.local'
// const BASE_PATH = location.protocol + '//api.397017.com'
// const BASE_PATH = '/api'

let http = axios.create({
    baseURL: BASE_PATH,
    timeout: 10000,
    // retry: 2,
    // retryDelay: 1000,
    header: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
    },
    // 设置 状态码范围
    validateStatus: function (status) {
        return status >= 100 && status <= 600;
    },
})

// 请求预设 ---
http.interceptors.request.use(req => {
    let Authorization = window.all.tool.getLocal('Authorization')
    // let expires = new Date(window.all.tool.getLocal('expires_at')).getTime()
    // let now = new Date().getTime()
    let not_login = req.url.indexOf('/headquarters-api/login') === -1        // 并非 /login页面
    if (Authorization && not_login) {
        req.headers.Authorization = Authorization   // 这是token+token_type
        // if (expires && now > expires) {
        //     // alert('token已经超时,请重新登陆..')
        //     // window._Vue_.$router.push('/login')
        // }
    }
    return req
})

// 后台返回数据 全局预设 ---
http.interceptors.response.use(res => {
    // console.log('resabc: ', res);
    // let data = res.data
    if (res && res.data) {
        if (res.data.code !== '200') {

            if (res.status !== 200) {
                // 401 跳转到login 登录
                if (res.status === 401) {
                    res.data.message && window.__vm__.$toast.error(res.data.message)
                    router.push('/login')
                    return res.data
                }

                let message = res.message || res.data.message
                if (message) {
                    window.__vm__.$toast.error(message)
                } else {
                    window.__vm__.$toast.error('出现服务问题或被禁止')
                }
                // console.log(res)
            }
        }
    } else {

        let message = res.message || res.data.message
        if (message) {
            window.__vm__.$toast.error(message)
        } else {
            window.__vm__.$toast.error('出现服务问题或被禁止')
        }
        if (res) {
            console.log('错误信息未知?', res)
        }
    }

    return res.data
}, (error) => {
    error&&window._Vue_.$toast(error.response)
    return Promise.resolve(err)
})

export default http