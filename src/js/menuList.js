const menuList = [
    {
        label: '首页',
        // path: '/home',
        icon: 'iconhome',
        children: [
            {
                label: '首页',
                paht: '/home',
                name: 'Home'
            }
        ]
    },

    /*----------------------------------------- 厅主管理 ------------------------------*/
    // 厅主列表
    {
        label: '厅主管理',
        // path: 'hall',
        icon: 'iconaccount',

        children: [
            {
                label: '厅主列表',
                path: '/hall/halllist',
                name: 'HallList'
            },
            {
                label: '登录记录',
                path: '/hall/loginrecord',
                name: 'LoginRecord'
            }
        ]
    },

    /*----------------------------------------- 游戏管理 ------------------------------*/
    {
        label: '游戏管理',
        // path: 'game',
        icon: 'icongame',
        children: [
            {
                label: '厂商管理',
                path: '/game/vendormanage',
                name: 'VendorManage'
            },
            {
                label: '分类设置',
                path: '/game/sortset',
                name: 'SortSet'
            },
            {
                label: '游戏管理',
                path: '/game/gamemanage',
                name: 'GameManage'
            }
        ]
    },

    /*----------------------------------------- 活动管理 ------------------------------*/
    {
        label: '活动管理',
        // path: 'active',
        icon: 'iconhuodong',
        children: [
            {
                label: '活动列表',
                path: '/active/activelist',
                name: 'ActiveList'
            }
        ]
    },

    /*----------------------------------------- 邮件系统 ------------------------------*/
    {
        label: '邮件系统',
        // path: 'email',
        icon: 'icon185078emailmailstreamline',
        children: [
            {
                label: '发邮件',
                path: '/email/sendemail',
                name: 'SendEmail'
            },
            {
                label: '收件箱',
                path: '/email/receiveemail',
                name: 'ReceiveEmail'
            },
            {
                label: '已发邮件',
                path: '/email/emailsent',
                name: 'EmailSent'
            }
        ]
    },

    /*----------------------------------------- 报表管理 ------------------------------*/
    {
        label: '报表管理',
        // path: 'report',
        icon: 'iconassistant_lefticon_Statisticalreportforms',
        children: [
            {
                label: '厅主注单报表',
                path: '/report/hallregist',
                name: 'HallRegist'
            },
            {
                label: '第三方游戏报表',
                path: '/report/thirdgame',
                name: 'ThirdGame'
            },
            {
                label: '厅主游戏报表',
                path: '/report/hallgame',
                name: 'HallGame'
            },
            {
                label: '厅主充提报表',
                path: '/report/halldeposit',
                name: 'HallDeposit'
            }
        ]
    },

    /*----------------------------------------- 金流配置 ------------------------------*/
    {
        label: '金流配置',
        // path: 'cashflow',
        icon: 'iconmoneybag',
        children: [
            {
                label: '厂商管理',
                path: '/cashflow/cashflowvendor',
                name: 'CashFlowVendor'
            },
            {
                label: '分类管理',
                path: '/cashflow/cashflowsort',
                name: 'CashFlowSort'
            },
            {
                label: '通道管理',
                path: '/cashflow/channelmanage',
                name: 'ChannelManage'
            }
        ]
    },

    /*----------------------------------------- 设置管理 ------------------------------*/
    {
        label: '设置管理',
        // path: 'set',
        icon: 'iconshezhi2',

        children: [
            {
                label: '管理员分组',
                path: '/set/adminsort',
                name: 'AdminSort'
            },
            {
                label: '操作日志',
                path: '/set/operatlog',
                name: 'OperatLog'
            },
            {
                label: '短信配置',
                path: '/set/smsconfig',
                name: 'SmsConfig'
            }
        ]
    },

    /*----------------------------------------- 开发管理 ------------------------------*/
    {
        label: '开发管理',
        // path: 'dev',
        icon: 'iconkaifa',
        children: [
            {
                label: '总控菜单管理',
                path: '/dev/totalmenu',
                name: 'TotalMenu'
            },
            {
                label: '厅主菜单管理',
                path: '/dev/hallmenu',
                name: 'HallMenu'
            },
            {
                label: '游戏厂商配置',
                path: '/dev/gamevendor',
                name: 'GameVendor'
            },
            {
                label: '游戏分类配置',
                path: '/dev/gamesort',
                name: 'GameSort'
            },
            {
                label: '游戏管理配置',
                path: '/dev/gamemanaconfig',
                name: 'GameManaConfig'
            },
            {
                label: '金流厂商配置',
                path: '/dev/cashvendorconfig',
                name: 'CashVendorConfig'
            },
            {
                label: '金流分类管理',
                path: '/dev/cashsort',
                name: 'CashSort'
            },
            {
                label: '金流通道配置',
                path: '/dev/cashchannel',
                name: 'CashChannel'
            },
            {
                label: '金流银行卡配置',
                path: '/dev/cashbankcard',
                name: 'CashBankCard'
            }
        ]
    },
]
export default menuList