export default {
    /*=========================== 用户 ===========================--*/
    /**
     * 
     * 增  add
     * 删  del
     * 改  set
     * 查  list
     * 
    */

    // 登录
    login: { url: '/headquarters-api/login', method: 'post' },
    // 登出
    logout: { url: '/headquarters-api/logout', method: 'get' },
    // 管理个人菜单
    current_admin_menu: {
        url: '/headquarters-api/menu/current-admin-menu',
        method: 'get'
    },
    // 自己修改密码
    self_update_pwd: {
        url: '/headquarters-api/headquarters-admin-user/self-update-password',
        method: 'post'
    },

    /*=========================== 2.厅主列表 ===========================--*/

    // 厅主列表 - 列表
    platform_list: {
        url: '/headquarters-api/platform/detail',
        method: 'post'
    },
    // 厅主列表-站点管理
    platform_set: {
        url: '/headquarters-api/platform/edit',
        method: 'post'
    },
    // 厅主列表 - 添加厅主
    platform_add: {
        url: '/headquarters-api/platform/do-add',
        method: 'post'
    },
    // 厅主列表 -禁用启用
    platform_switch_set: {
        url: '/headquarters-api/platform/switch',
        method: 'post'
    },
    // 厅主列表 -域名管理-列表
    platform_domain_list: {
        url: '/headquarters-api/platform/domain-detail',
        method: 'post'
    },
    // 厅主列表 -域名管理-添加
    platform_domain_add: {
        url: '/headquarters-api/platform/domain-add',
        method: 'post'
    },
    // 厅主列表 - 站点维护
    platform_maintain_set: {
        url: '/headquarters-api/platform/maintain',
        method: 'post'
    },
    // 厅主列表 - 站点管理
    site_manage_set: {
        url: '/headquarters-api/platform/edit',
        method: 'post'
    },

    // 登录记录
    login_record_list:{
        url: '/headquarters-api/login-log/index',
        method: 'post',
    },
    //

    /*=========================== 3.游戏管理 ===========================--*/
    /* 3.1 厂商管理   */
    //----- 厂商管理 - 列表
    game_vendor_list: {
        url: '/headquarters-api/game-vendor/opt-index-do',
        method: 'get'
    },
    // 厂商管理 - 改变状态
    game_vendor_status_set: {
        url: '/headquarters-api/game-vendor/opt-status-do',
        method: 'post'
    },
    /* 3.2 分类设置 --------- */
    // 分类设置 - 列表
    game_sort_list: {
        url: '/headquarters-api/game-type/opt-index-do',
        method: 'get'
    },
    // 分类设置 - 改变状态
    game_sort_status_set: {
        url: '/headquarters-api/game-type/opt-status-do',
        method: 'post'
    },

    // 3.3 游戏管理 - 列表
    game_list: {
        url: '/headquarters-api/game/opt-index-do',
        method: 'get'
    },
    // 游戏管理 - 改变状态
    game_status_set: {
        url: '/headquarters-api/game/opt-status-do',
        method: 'post'
    },
    // 游戏管理 - 编辑
    game_set: {
        url: '/headquarters-api/game/opt-edit-do',
        method: 'post'
    },

    /*=========================== 活动管理 ===========================--*/




    /*=========================== 邮件系统 ===========================--*/



    /*=========================== 报表管理 ===========================--*/




    /*=========================== 金流配置 ===========================--*/

    // 厂商管理 - 列表
    finance_vendor_list: {
        url: '/headquarters-api/finance-vendor/opt-index-do',
        method: 'get'
    },
    // 厂商管理 - 改变状态
    finance_vendor_status_set: {
        url: '/headquarters-api/finance-vendor/opt-status-do',
        method: 'post'
    },
    // 分类管理 - 列表
    finance_sort_list: {
        url: '/headquarters-api/finance-type/opt-index-do',
        method: 'get'
    },
    // 分类管理 - 改变状态
    finance_sort_set: {
        url: '/headquarters-api/finance-type/opt-status-do',
        method: 'post'
    },
    //  通道管理 - 列表
    finance_channel_list: {
        url: '/headquarters-api/finance-channel/opt-index-do',
        method: 'get'
    },
    //  通道管理 - 改变状态
    finance_channel_status_set: {
        url: '/headquarters-api/finance-channel/opt-status-do',
        method: 'post'
    },

    //  通道管理 - 编辑
    finance_channel_set: {
        url: '/headquarters-api/finance-channel/opt-edit-do',
        method: 'post'
    },
    //  系统银行列表
    sys_bank_list: {
        url: '/headquarters-api/bank/opt-index-do',
        method: 'get'
    },
    //  系统银行更改状态
    sys_bank_status_set: {
        url: '/headquarters-api/bank/opt-status-do',
        method: 'post'
    },


    /*=========================== 设置管理 ===========================--*/

    //  管理员分组-获取管理员组列表
    admin_class_list: {
        url: '/headquarters-api/backend-admin-group/detail',
        method: 'get'
    },
    // 管理员分组-创建管理员组
    admin_class_add: {
        url: '/headquarters-api/backend-admin-group/create',
        method: 'post'
    },
    // 管理员分组-编辑管理员组
    admin_class_set: {
        url: '/headquarters-api/backend-admin-group/edit',
        method: 'post'
    },
    // 管理员分组-删除管理员组
    admin_class_del: {
        url: '/headquarters-api/backend-admin-group/delete-access-group',
        method: 'post'
    },

    // -----成员 ---
    // 管理员分组-创建管理员用户 (添加成员)
    admin_user_add: {
        url: '/headquarters-api/headquarters-admin-user/create',
        method: 'post'
    },
    // 管理员分组 - 管理员更换组
    admin_user_group_set: {
        url: '/headquarters-api/headquarters-admin-user/update-admin-group',
        method: 'post'
    },
    // 管理员分组 - 修改其他管理员密码 (成员修改密码)
    admin_user_other_pwd_set: {
        url: '/headquarters-api/headquarters-admin-user/update-password',
        method: 'post'
    },
    // 管理员分组 - 删除管理员 (删除成员)
    admin_user_del: {
        url: '/headquarters-api/headquarters-admin-user/delete-admin',
        method: 'post'
    },
    // 管理员分组 - 查找管理员 
    admin_user_list: {
        url: '/headquarters-api/headquarters-admin-user/search-admin',
        method: 'post'
    },
    //  获取组管理员角色 (管理员分组 - 获取各组成员table)
    admin_group_user_list: {
        url: '/headquarters-api/backend-admin-group/specific-group-users',
        method: 'post'
    },
    //  修改管理员状态 (成员 - 状态改变)
    admin_user_status_set: {
        url: '/headquarters-api/headquarters-admin-user/switch-admin',
        method: 'post'
    },


    /*=========================== 开发管理 ===========================--*/
    /* --------总控菜单管理 -----------------*/

    //  总控菜单管理-开发管理菜单操作相关需要的数据 (所有select 路由)
    menu_date_list: {
        url: '/headquarters-api/menu',
        method: 'post'
    },
    //  总控菜单管理 - 菜单添加
    menu_add: {
        url: '/headquarters-api/menu/add',
        method: 'post'
    },
    //  总控菜单管理 - 菜单删除
    menu_del: {
        url: '/headquarters-api/menu/delete',
        method: 'post'
    },
    //  总控菜单管理 - 编辑菜单
    menu_set: {
        url: '/headquarters-api/menu/edit',
        method: 'post'
    },
    //  总控菜单管理 - 菜单拖拽分父组
    menu_change_parent_set: {
        url: '/headquarters-api/menu/change-parent',
        method: 'post'
    },
    //  总控菜单管理 - 所有菜单列表
    menu_all_list: {
        url: '/headquarters-api/menu/get-all-menu',
        method: 'get'
    },

    // -------- 路由 -------

    //  总控菜单管理-路由-列表
    route_all_list: {
        url: '/headquarters-api/headquarters-route/index',
        method: 'get'
    },
    //  总控菜单管理-路由-添加
    route_add: {
        url: '/headquarters-api/headquarters-route/do-add',
        method: 'post'
    },
    //  总控菜单管理-路由-删除
    route_del: {
        url: '/headquarters-api/headquarters-route/delete',
        method: 'post'
    },
    //  总控菜单管理-路由-编辑
    route_set: {
        url: '/headquarters-api/headquarters-route/edit',
        method: 'post'
    },


    /* --------游戏厂商 -----------------*/
    //  游戏厂商 - 添加
    dev_game_vendor_add: {
        url: '/headquarters-api/game-vendor/add-do',
        method: 'post'
    },
    //  游戏厂商配置 - 编辑
    dev_game_vendor_set: {
        url: '/headquarters-api/game-vendor/edit-do',
        method: 'post'
    },
    //  游戏厂商配置 - 列表
    dev_game_vendor_list: {
        url: '/headquarters-api/game-vendor/index-do',
        method: 'get'
    },
    //  游戏厂商配置 - 删除
    dev_game_vendor_del: {
        url: '/headquarters-api/game-vendor/del-do',
        method: 'post'
    },
    //  游戏厂商配置 - 改变状态
    dev_game_vendor_status_set: {
        url: '/headquarters-api/game-vendor/status-do',
        method: 'post'
    },
    //  游戏分类配置-添加  (注意前面有个 游戏分类,不要混淆 )
    dev_game_type_add: {
        url: '/headquarters-api/game-type/add-do',
        method: 'post'
    },
    //  游戏分类配置 - 编辑
    dev_game_type_set: {
        url: '/headquarters-api/game-type/edit-do',
        method: 'post'
    },
    //  游戏分类配置 - 列表
    dev_game_type_list: {
        url: '/headquarters-api/game-type/index-do',
        method: 'get'
    },
    //  游戏种类配置 - 删除
    dev_game_type_del: {
        url: '/headquarters-api/game-type/del-do',
        method: 'post'
    },
    //  游戏分类配置 -改变状态
    dev_game_sort_status_set: {
        url: '/headquarters-api/game-type/status-do',
        method: 'post'
    },

    /* --------游戏管理配置 -----------------*/
    //  游戏管理配置 - 添加游戏
    dev_game_add: {
        url: '/headquarters-api/game/add-do',
        method: 'post'
    },
    //  编辑游戏
    dev_game_set: {
        url: '/headquarters-api/game/edit-do',
        method: 'post'
    },
    //  游戏管理配置 - 列表
    dev_game_list: {
        url: '/headquarters-api/game/index-do',
        method: 'get'
    },
    //  删除游戏
    dev_game_del: {
        url: '/headquarters-api/game/del-do',
        method: 'post'
    },
    //  游戏管理配置 - 获取游戏列表的查询条件
    dev_game_search_condition_get: {
        url: '/headquarters-api/game/get-search-condition',
        method: 'get'
    },
    //  游戏改变状态
    dev_game_status_set: {
        url: '/headquarters-api/game/status-do',
        method: 'post'
    },





    /* --------金流厂商配置 -----------------*/

    //  金流厂商配置 - 添加
    dev_finance_vendor_add: {
        url: '/headquarters-api/finance-vendor/add-do',
        method: 'post'
    },
    //  金流厂商列表
    dev_finance_vendor_list: {
        url: '/headquarters-api/finance-vendor/index-do',
        method: 'get'
    },
    //  金流厂商配置 - 编辑
    dev_finance_vendor_set: {
        url: '/headquarters-api/finance-vendor/edit-do',
        method: 'post'
    },
    //  金流厂商配置 - 删除
    dev_finance_vendor_del: {
        url: '/headquarters-api/finance-vendor/del-do',
        method: 'post'
    },
    //  金流厂商改变状态
    dev_finance_vendor_status_set: {
        url: '/headquarters-api/finance-vendor/status-do',
        method: 'post'
    },
    /* --------金流分类管理 -----------------*/
    //  金流分类管理 - 添加
    dev_finance_sort_add: {
        url: '/headquarters-api/finance-type/add-do',
        method: 'post'
    },
    //  金流分类管理 - 列表
    dev_finance_sort_list: {
        url: '/headquarters-api/finance-type/index-do',
        method: 'get'
    },
    //  金流分类管理 - 编辑
    dev_finance_sort_set: {
        url: '/headquarters-api/finance-type/edit-do',
        method: 'post'
    },
    //  金流分类管理 - 删除
    dev_finance_sort_del: {
        url: '/headquarters-api/finance-type/del-do',
        method: 'post'
    },
    //  金流分类管理 - 改变状态
    dev_finance_sort_status_set: {
        url: '/headquarters-api/finance-type/status-do',
        method: 'post'
    },


    /* --------金流通道配置 -----------------*/

    //  金流通道添加
    dev_finance_channel_add: {
        url: '/headquarters-api/finance-channel/add-do',
        method: 'post'
    },
    //  金流通道配置 - 编辑
    dev_finance_channel_set: {
        url: '/headquarters-api/finance-channel/edit-do',
        method: 'post'
    },
    //  金流通道配置 - 列表
    dev_finance_channel_list: {
        url: '/headquarters-api/finance-channel/index-do',
        method: 'get'
    },
    //  金流通道配置 - 删除
    dev_finance_channel_del: {
        url: '/headquarters-api/finance-channel/del-do',
        method: 'post'
    },
    //  获取金流通道列表的查询条件 (select内容)
    dev_finance_channel_search_condition: {
        url: '/headquarters-api/finance-channel/get-search-condition',
        method: 'get'
    },
    //  金流通道配置 - 改变状态
    dev_finance_channel_status_set: {
        url: '/headquarters-api/finance-channel/status-do',
        method: 'post'
    },


    /* --------金流通道配置 -----------------*/

    //  金流银行卡配置 - 添加
    dev_sys_bank_add: {
        url: '/headquarters-api/bank/add-do',
        method: 'post'
    },
    //  金流银行卡 - 配置
    dev_sys_bank_list: {
        url: '/headquarters-api/bank/index-do',
        method: 'get'
    },
    //  金流银行卡 - 编辑
    dev_sys_bank_set: {
        url: '/headquarters-api/bank/edit-do',
        method: 'post'
    },
    //  金流银行卡 - 删除
    dev_sys_bank_del: {
        url: '/headquarters-api/bank/del-do',
        method: 'post'
    },
    //  金流银行卡配置 - 更改状态
    dev_sys_bank_status_set: {
        url: '/headquarters-api/bank/status-do',
        method: 'post'
    },



    /*=========================== 代理后台菜单管理 ===========================--*/
    //  获取代理后台所有菜单
    merchant_menu_all_list: {
        url: '/headquarters-api/merchant-menu/get-all-menu',
        method: 'get'
    },
    //  添加代理后台菜单
    merchant_menu_add: {
        url: '/headquarters-api/merchant-menu/add',
        method: 'post'
    },
    //  编辑代理后台菜单
    merchant_menu_set: {
        url: '/headquarters-api/merchant-menu/edit',
        method: 'post'
    },
    //  删除代理后台菜单
    merchant_menu_del: {
        url: '/headquarters-api/merchant-menu/delete',
        method: 'post'
    },
    //  菜单拖拽分父组
    merchant_menu_parent_sort: {
        url: '/headquarters-api/merchant-menu/change-parent',
        method: 'post'
    },
}