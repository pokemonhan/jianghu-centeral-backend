<template>
    <div class="container">
        <!--------------------- 游戏管理 - 游戏设置------------->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏厂商</span>
                    <Select v-model="filter.vendor_id" :options="vendor_opt" @update="vendorUpd"></Select>
                </li>
                <li>
                    <span>游戏分类</span>
                    <Select v-model="filter.type_id" :options="type_opt" @update="typeUpd"></Select>
                </li>
                <li>
                    <span>游戏名称</span>
                    <Select v-model="filter.name" :options="name_opt"></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                </li>
            </ul>
        </div>

        <div class="mt20">
            <Table :headers="headers" :column="list">
                <template v-slot:item="{row, idx}">
                    <!-- ['编号','ICON','游戏厂商','游戏名称','游戏分类','游戏状态','最后更新人','最后更新时间','操作'] -->
                    <td>{{(pageNo-1)*pageSize+idx+1}}</td>
                    <td>
                        <PicShow>
                            <img class="td-icon" :src="row.icon" alt="图片加载中" />
                            <template v-slot:content>
                                <div>
                                    <img class="td-pic-show" :src="row.icon" alt="图片加载中" />
                                </div>
                            </template>
                        </PicShow>
                    </td>
                    <td>{{row.vendor_name || '--'}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.type+' - '+row.sub_type}}</td>
                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch(row)" />
                    </td>
                    <td>{{row.last_editor ||'---'}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <!-- <button class="btns-blue" @click="edit(row)">编辑</button> -->
                        <!-- <button :class="[row.status?'btns-red':'btns-green']" @click="statusSwitch(row)">{{row.status===1?'禁用':'启用'}}</button> -->
                        <div class="td-btns">
                            <Upload style="width:90px;" title="上传图片" @change="upPicChange($event, row)" />
                            <button class="btn-blue ml5" @click="downLoadImg(row)">下载图片</button>
                            <button class="btn-blue" @click="detail(row)">查看编辑详情</button>
                        </div>
                    </td>
                </template>
            </Table>

            <Page
                class="table-page"
                :total="total"
                :pageNo.sync="pageNo"
                :pageSize.sync="pageSize"
                @updateNo="updateNo"
                @updateSize="updateSize"
            />
        </div>

        <Dialog :show="dia_show!==''" :title="dia_title" @close="dia_show=''">
            <div class="dia-inner">
                <div v-if="dia_show==='detail'" class="dia-detail">
                    <GameManageDetail :id="curr_row.id" />
                </div>
            </div>
        </Dialog>
        <!-- 禁用 modal -->
        <Modal :show.sync="mod_show" :title="mod_title" :content="mod_cont" @confirm="modConf"></Modal>
    </div>
</template>

<script>
import GameManageDetail from './GameManageDetail'
export default {
    name: 'GameManage',
    components: {
        GameManageDetail
    },
    data() {
        return {
            // 所有 select下拉 数据
            select: {},
            filter: {
                vendor_id: '',
                type_id: '',
                name: ''
            },
            vendor_opt: [],
            type_opt: [],
            name_opt: [],

            headers: [
                '编号',
                'ICON',
                '游戏厂商',
                '游戏名称',
                '游戏分类',
                '游戏状态',
                '最后更新人',
                '最后更新时间',
                '操作'
            ],
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 25,
            // dialog
            /* 当前点击的row */
            curr_row: {},
            dia_show: '',
            dia_title: '',
            form: {
                name: '',
                merchant_secret: '',
                private_key: '',
                public_key: '',
                merchant_code: '',
                app_id: '',
                authorization_code: ''
            },
            mod_show: false,
            mod_title: '',
            mod_cont: ''
        }
    },
    methods: {
        getSelectOpt() {
            let { url, method } = this.$api.dev_game_search_condition_get
            this.$http({ url, method }).then(res => {
                // console.log('下拉数据 ', res)
                if (res && res.code === '200') {
                    this.select = res.data
                    this.vendor_opt = this.backToSelOpt(this.select.vendors)
                    this.name_opt = this.backToSelOpt(this.select.games)
                    this.type_opt = this.backToSelOpt(this.select.types)
                }
            })
        },
        // 后台数组转为 select_opt 数组
        backToSelOpt(list) {
            let arr = [{ label: '全部', value: '' }]
            list.forEach(item => {
                let opt = { label: item.name, value: item.id }
                arr.push(opt)
            })
            return arr
        },
        vendorUpd(val) {
            // this.filterNameOpt() // TODO:
        },
        filterNameOpt() {
            // 根据《游戏厂商》和《游戏分类》筛选合格的游戏名称
            let vendor_id = this.filter.vendor_id
            let type_id = this.filter.type_id
            let nameOpt = this.select.games.filter(item => {
                // 条件一：等于该厂商或者厂商id为空时 && 条件二：等于该游戏分类或者该分类筛选为空时
                return (
                    (item.vendor_id === vendor_id || vendor_id === '') &&
                    (item.type_id === type_id || type_id === '')
                )
            })
            // console.log('nameOpt: ', nameOpt);
            this.name_opt = this.backToSelOpt(nameOpt)
        },
        typeUpd(val) {
            this.filterNameOpt()
        },
        // edit(row) {

        //     this.form = {
        //         id: row.id,
        //         name: row.name,
        //         merchant_secret: row.merchant_secret,
        //         private_key: row.private_key,
        //         public_key: row.public_key,
        //         merchant_code: row.merchant_code,
        //         app_id: row.app_id,
        //         authorization_code: row.authorization_code
        //     }
        //     this.curr_row = row
        //     this.dia_show = 'edit'
        //     this.dia_title = '编辑'
        // },
        checkForm() {
            if (this.form.name === '') {
                return false
            }
            return true
        },
        // editConf() {
        //     if(!this.checkForm()) return
        //     let data = window.all.tool.rmEmpty(this.form)
        //     let { url, method } = this.$api.game_set
        //     this.$http({ url, method, data }).then(res => {
        //         if (res && res.code === '200') {
        //             this.$toast.success(res.message)
        //             this.getList()
        //             this.dia_show = ''
        //         } else {
        //             if (res && res.message) {
        //                 this.$toast.error(res.message)
        //             } else {
        //                 this.$toast.error('更新失败')
        //             }
        //         }
        //     })
        // },
        statusSwitch(row) {
            this.curr_row = row
            // this.mod_show = true
            // if (row.status) {
            //     this.mod_title = '启用'
            //     this.mod_cont = '是否确定启用该游戏？'
            // } else {

            //     this.mod_title = '禁用'
            //     this.mod_cont = '是否确定禁用该游戏？'
            // }
            this.modConf()
        },
        modConf() {
            let data = {
                id: this.curr_row.id,
                status: this.curr_row.status ? 1 : 0 // 状态
            }
            let { url, method } = this.$api.game_status_set
            this.$http({ url, method, data }).then(res => {
                if (res && res.code === '200') {
                    res.message && this.$toast.success(res.message)
                    // this.mod_show = false
                }
                this.getList()
            })
        },
        upPicChange(e, row) {
            let pic = e.target.files[0]
            let path = 'central/game/gamemanage'
            let formData = new FormData()
            formData.append('file', pic, pic.name)
            formData.append('path', path)
            let { url, method } = this.$api.pic_update
            let data = formData
            let headers = { 'Content-Type': 'multipart/form-data' }
            this.$http({ method, url, data, headers }).then(res => {
                if (res && res.code == '200') {
                    console.log('🍏 res: ', res);
                    // this.pic_data = res.data.path
                    if(res.data) {
                        this.iconUpdate(row.id, res.data)
                    }
                }
            })
            // let reader = new FileReader()
            // reader.readAsDataURL(file)
            // reader.onerror = function() {
            //     return
            // }
            // reader.onload = function() {
            //     // self.src[index] = this.result
            //     self.pic_data = this.result
            // }
        },
        // icon 更新
        iconUpdate(id ,res) {
            console.log('🥩 id: ', id);
            console.log('🍕 res: ', res);
            let data = {
                id: id,
                icon_id: res.id
            }
            data = window.all.tool.rmEmpty(data)

            let { url, method } = this.$api.game_icon_set
            this.$http({ method, url, data }).then(res => {
                console.log('列表👌👌👌👌: ', res)
                if (res && res.code === '200') {
                    this.$toast.success(res.message)
                    //this.mod_show = false
                    //this.dia_show = false
                    this.getList()
                }
            })
        },
        /** 下载图片 */
        downLoadImg(row) {
            console.log('🍥 row: ', row);
            let name = row.vendor_name + '-'+row.sub_type
            var image = new Image()
            // 解决跨域 Canvas 污染问题
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function() {
                var canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height

                var context = canvas.getContext('2d')
                context.drawImage(image, 0, 0, image.width, image.height)
                var url = canvas.toDataURL('image/png')

                // 生成一个a元素
                var a = document.createElement('a')
                // 创建一个单击事件
                var event = new MouseEvent('click')

                // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                a.download = name || '下载图片'
                // 将生成的URL设置为a.href属性
                a.href = url
                // 触发a的单击事件
                a.dispatchEvent(event)
            }

            image.src = row.icon
            // <img data-v-2862595a="" data-v-76ec3669="" src="http://pic.397017.com/uploads/central/game/gamemanage/2020-05-13/0e55fa1b47c595d0fc80d880d8f23f7a.png" alt="图片加载中" class="td-icon">
        },
        /** 编辑详情 按钮 */
        detail(row) {
            // TODO
            // this.$toast('还未对接后端接口,或者后端没有接口')
            // return
            this.curr_row = row
            this.dia_show = 'detail'
            this.dia_title = '编辑详情'
        },

        updateNo() {
            this.getList()
        },
        updateSize() {
            this.pageNo = 1
            this.getList()
        },
        getList() {
            let par = {
                vendor_id: this.filter.vendor_id,
                type_id: this.filter.type_id,
                game_id: this.filter.name,
                pageSize: this.pageSize,
                page: this.pageNo
            }
            let params = window.all.tool.rmEmpty(par)

            let { url, method } = this.$api.game_list
            this.$http({ url, method, params }).then(res => {
                if (res && res.code === '200') {
                    this.total = res.data.total
                    this.list = res.data.data
                }
            })
        }
    },
    mounted() {
        this.getList()
        // 获取下拉框
        this.getSelectOpt()
    }
}
</script>

<style scoped>
.td-icon {
    max-width: 80px;
    max-width: 44px;
}
.td-pic-show {
    max-width: 600px;
    max-height: 350px;
}
.td-btns {
    display: flex;
    justify-content: center;
}
.edit-form {
    position: relative;
    width: 700px;
    height: 400px;
}
.form {
    width: 350px;
    margin: 0 auto;
}
.form > li {
    display: flex;
    position: relative;
    align-items: baseline;
}
.form > li > span:first-child {
    min-width: 4.1em;
    margin-right: 10px;
    margin-top: 20px;
    text-align: right;
}
.err-tips {
    position: absolute;
    top: 44px;
    left: 7em;
    font-size: 12px;
    color: rgb(255, 38, 0);
}
/* .w250 {
    width: 250px;
} */
.form-btns {
    margin-top: 50px;
    text-align: center;
}
/* .ml50 {
    margin-left: 50px;
} */
.table {
    margin-top: 10px;
}
</style>