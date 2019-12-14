export default {
    /* 用户 ****************/
    //登录
    login: { url: '/headquarters-api/login', method: 'post' },
    // 登出
    logout: { url: '/headquarters-api/logout', method: 'get' },

/*    公共分类 ************/

    // 全部菜单
    all_menu: {
        url: '/headquarters-api/menu/get-all-menu', method: 'get'
    },

    // 管理个人菜单
    current_admin_menu: {
        url: '/headquarters-api/menu/current-admin-menu', method: 'get'
    },

  

    /* 游戏 ***********/
    /* 游戏种类-添加 */
    game_type_add: {
        url: '/headquarters-api/game-type/add-do', method: 'post'
    },
    /* 游戏种类-编辑 */
    game_type_edit: {
        url: '/headquarters-api/game-type/edit-do', method: 'post'
    },
    /* 游戏种类-列表-查看 */
    game_type_list: {
        url: '/headquarters-api/game-type/index-do', method: 'get'
    },
    /* 游戏种类-删除 */
    game_type_delete: {
        url: '/headquarters-api/game-type/del-do', method: 'post'
    },


    /* 游戏厂商-添加 */
    game_vendor_add: {
        url: '/headquarters-api/game-vendor/add-do', method: 'post'
    },
    /* 游戏厂商-编辑 */
    game_vendor_edit: {
        url: '/headquarters-api/game-vendor/edit-do', method: 'post'
    },
    /* 游戏厂商-列表-查看 */
    game_vendor_list: {
        url: '/headquarters-api/game-vendor/index-do', method: 'get'
    },
    /* 游戏厂商-删除 */
    game_vendor_delete: {
        url: '/headquarters-api/game-vendor/del-do', method: 'post'
    },

      /* 游戏 */

    /* 已开发管理 **********************/
    /* 开发管理菜单操作相关需要的数据 */
      // 管理个人菜单
    menu_list: {
        url: '/headquarters-api/menu', method: 'post'
    },
   /*  菜单添加 */
    menu_add: {
        url: '/headquarters-api/menu/addu', method: 'post'
    },
    /* 菜单删除 */
    menu_delete: {
        url: '/headquarters-api/menu/delete', method: 'post'
    },  
    /* 编辑菜单 */
    menu_edit: {
        url: '/headquarters-api/menu/edit', method: 'post'
    },
    /* 菜单拖拽分组 */
    menu_change: {
        url: '/headquarters-api/menu/change-parent', method: 'post'
    },

    /* 角色管理 ***********************/
    /* 管理员角色列表 -查看 */
    admin_role_list: {
        url: '/headquarters-api/partner-admin-group/detail', method: 'get'
    },
    /* 管理员角色列表 - 添加 */
    admin_role_add: {
        url: '/headquarters-api/partner-admin-group/create', method: 'post'
    },
    /* 管理员角色列表 - 编辑 */
    admin_role_edit: {
        url: '/headquarters-api/partner-admin-group/edit', method: 'post'
    },
    /* 管理员角色列表 - 删除 */
    admin_role_delete: {
        url: '/headquarters-api/partner-admin-group/delete-access-group', method: 'post'
    },
}