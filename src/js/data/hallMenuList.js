const menu = [
    {
        label: "首页",
        icon: "iconhome",
        path: "/homeout",
        name: "home",

        children: [
            {
                label: "首页",
                path: "/home",
                name: 'HomePage'
            }
        ],
    },
    {
        label: "会员管理",
        icon: "iconaccount",
        path: "user",
        name: "user",
        children: [
            {
                label: "会员列表",
                path: "/user/userlist",
                name: "UserList"
            },
            {
                label: "登录记录",
                path: "/user/loginlog",
                name: "LoginLog",
            },
            {
                label: "标签管理",
                path: "/user/tabmanage",
                name: "TabManage",
            },
            {
                label: "黑名单管理",
                path: "/user/blacklistmanage",
                name: "BlackListManage"
            },
            {
                label: "等级设置",
                path: "/user/levelsetting",
                name: "LevelSetting"
            },
            {
                label: "洗码设置",
                path: "/user/washsetting",
                name: "WashSetting"
            }
        ]
    },
    {
        label: "财务管理",
        icon: "iconmoneybag",
        path: "funds",
        name: "funds",
        children: [
            {
                label: "入款订单",
                path: "/funds/incomeorder",
                name: "IncomeOrder"
            },
            {
                label: "人工存取",
                path: "/funds/manualaccess",
                name: "ManualAccess"
            },
            {
                label: "出款审核",
                path: "/funds/paymentreview",
                name: "paymentreview"
            },
            {
                label: "出款订单",
                path: "/funds/paymentorder",
                name: "PaymentOrder",
            },
            {
                label: "资金账变",
                path: "/funds/fundchange",
                name: "FundChange",
            }
        ]
    },
    {
        label: "公告管理",
        icon: "iconspeaker-5",
        path: "announce",
        name: "announce",
        children: [
            {
                label: "跑马灯消息",
                path: "/announce/marquee",
                name: "Marquee",
            },
            {
                label: "系统公告",
                path: "/announce/systemannounce",
                name: "SystemAnnounce"
            },
            {
                label: "登录弹窗公告 ",
                path: "/announce/loginpopup",
                name: "LoginPopup"
            },
            {
                label: "轮播公告 ",
                path: "/announce/carousel",
                name: "Carousel"
            }
        ]
    },
    {
        label: "邮件系统",
        icon: "icon185078emailmailstreamline",
        name: "email",
        path: "email",
        children: [
            {
                label: "发邮件",
                path: "/email/sendemail",
                name: "SendeMail"
            },
            {
                label: "收件箱",
                path: "/email/receiveemail",
                name: "ReceiveEmail"
            },
            {
                label: "已发邮件",
                path: "/email/emailsent",
                name: "EmailSent"
            },
            {
                label: "短信推送",
                path: "/email/smspush",
                name: "SmsPush"
            }
        ]
    },
    {
        label: "报表管理",
        icon: "iconassistant_lefticon_Statisticalreportforms",
        name: "report",
        path: "report",
        children: [
            {
                label: "个人报表",
                path: "/report/personalreport",
                name: "PersonalReport"
            },
            {
                label: "游戏报表",
                path: "/report/gamereport",
                name: "GameReport"
            },
            {
                label: "公司报表",
                path: "/report/companyreport",
                name: "CompanyReport"
            },
            {
                label: "会员稽核",
                path: "/report/memberaudit",
                name: "MemberAudit"
            },
            {
                label: "平台注单",
                path: "/report/platformbet",
                name: "PlatformBet"
            },
            {
                label: "活动报表",
                path: "/report/activereport",
                name: "ActiveReport"
            },
            {
                label: "会员洗码",
                path: "/report/userwash",
                name: "UserWash"
            }
        ]
    },
    {
        label: "游戏管理",
        icon: "iconicon4",
        path: "game",
        name: "game",
        children: [
            {
                label: "H5游戏管理",
                path: "/game/gameh5",
                name: "GameH5"
            },
            {
                label: "PC游戏管理",
                path: "/game/gamepc",
                name: "GamePC",
            },
            {
                label: "APP游戏管理",
                path: "/game/gameapp",
                name: "GameApp"
            },
            {
                label: "平台管理",
                path: "/game/plantform",
                name: "PlantForm"
            },
            {
                label: "分类管理",
                path: "/game/gamesort",
                name: "GameSort"
            }
        ]
    },
    {
        label: "活动管理",
        icon: "iconhuodong",
        path: "active",
        name: "active",
        children: [
            {
                label: "静态活动",
                path: "/active/static",
                name: "Static"
            },
            {
                label: "动态活动",
                path: "/active/dynamic",
                name: "Dynamic"
            }
        ]
    },
    {
        label: "金流管理",
        icon: "icondingdangdaizijinliushui",
        path: "pay",
        name: "pay",
        children: [
            {
                label: "线下金流配置",
                path: "/pay/offlinepay",
                name: "OfflinePay",
            },
            {
                label: "线上金流配置",
                path: "/pay/onlinepay",
                name: "OnlinePay"
            },
            {
                label: "出款银行管理",
                path: "/pay/exportbank",
                name: "ExportBank"
            }
        ]
    },
    {
        label: "推广配置",
        icon: "iconconnections",
        path: "promote",
        name: "promote",
        children: [
            {
                label: "推广配置",
                path: "/promote/promoteconfig",
                name: "PromoteConfig"
            },
            {
                label: "推广图片配置",
                path: "/promote/picconfig",
                name: "PicConfig"
            }
        ]
    },
    {
        label: "设置管理",
        icon: "iconshezhi2",
        path: "set",
        name: "set",
        children: [
            {
                label: "管理员分组",
                path: "/set/adminsort",
                name: "AdminSort"
            },
            {
                label: "全域设置",
                path: "/set/allareaset",
                name: "AllAreaSet",
            },
            {
                label: "客服设置",
                path: "/set/serviceset",
                name: "ServiceSet"
            },
            {
                label: "帮助设置",
                path: "/set/helpset",
                name: "HelpSet"
            },
            {
                label: "操作记录",
                path: "/set/operatrecord",
                name: "OperatRecord"
            },
            {
                label: "银行卡反查中心",
                path: "/set/bankcenter",
                name: "BankCenter"
            }
        ]
    }
]

export default menu