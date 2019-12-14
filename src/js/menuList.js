const menuList = [
    {
        label: '首页',
        path: '/home',
    },

    /*----------------------------------------- 厅主管理 ------------------------------*/
    // 厅主列表
    {
        label: '厅主管理',
        // path: 'hall',
        child: [
            {
                label: '厅主列表',
                path: '/hall/halllist'
            },
            {
                label: '登录记录',
                path: '/hall/loginrecord'
            }
        ]
    },

    /*----------------------------------------- 游戏管理 ------------------------------*/
    {
        label: '游戏管理',
        // path: 'game',
        child: [
            {
                label: '厂商管理',
                path: '/game/vendormanage'
            },
            {
                label: '分类设置',
                path: '/game/sortset'
            },
            {
                label: '游戏管理',
                path: '/game/gamemanege'
            }
        ]
    },

    /*----------------------------------------- 活动管理 ------------------------------*/
    {
        label: '活动管理',
        // path: 'active',
        child: [
            {
                label: '活动列表',
                path: '/active/activelist'
            }
        ]
    },

    /*----------------------------------------- 邮件系统 ------------------------------*/
    {
        label: '邮件系统',
        // path: 'email',
        child: [
            {
                label: '发邮件',
                path: '/email/sendemail'
            },
            {
                label: '收件箱',
                path: '/email/receiveemail'
            }
        ]
    },

    /*----------------------------------------- 报表管理 ------------------------------*/
    {
        label: '报表管理',
        // path: 'report',
        child: [
            {
                label: '厅主注单报表',
                path: '/report/hallregist'
            },
            {
                label: '第三方游戏报表',
                path: '/report/thirdgame'
            },
            {
                label: '厅主游戏报表',
                path: '/report/hallgame'
            },
            {
                label: '厅主充提报表',
                path: '/report/halldeposit'
            }
        ]
    },

    /*----------------------------------------- 金流配置 ------------------------------*/
    {
        label: '金流配置',
        // path: 'cashflow',
        child: [
            {
                label: '厂商管理',
                path: '/cashflow/cashflowvendor'
            },
            {
                label: '分类管理',
                path: '/cashflow/cashflowsort'
            },
            {
                label: '通道管理',
                path: '/cashflow/channelmanage'
            }
        ]
    },

    /*----------------------------------------- 设置管理 ------------------------------*/
    {
        label: '设置管理',
        // path: 'set',
        child: [
            {
                label: '管理员分组',
                path: '/set/adminsort'
            },
            {
                label: '操作日志',
                path: '/set/operatlog'
            },
            {
                label: '短信配置',
                path: '/set/smsconfig'
            }
        ]
    },

    /*----------------------------------------- 开发管理 ------------------------------*/
    {
        label: '开发管理',
        // path: 'dev',
        child: [
            {
                label: '总控菜单管理',
                path: '/dev/adminsort'
            },
            {
                label: '厅主菜单管理',
                path: '/dev/hallmenu'
            },
            {
                label: '游戏厂商配置',
                path: '/dev/gamevendor'
            },
            {
                label: '游戏分类配置',
                path: '/dev/gamesort'
            },
            {
                label: '游戏管理配置',
                path: '/dev/gamemanaconfig'
            },
            {
                label: '金流厂商配置',
                path: '/dev/cashvendorconfig'
            },
            {
                label: '金流分类管理',
                path: '/dev/cashsort'
            },
            {
                label: '金流通道配置',
                path: '/dev/cashchannel'
            },
            {
                label: '金流银行卡配置',
                path: '/dev/cashbankcard'
            }
        ]
    },
]
export default menuList