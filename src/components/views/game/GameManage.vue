<template>
    <div class="container">
        <!--------------------- 游戏管理 - 游戏设置------------->
        <div class="filter p10">
            <ul class="left">
                <li>
                    <span>游戏分类</span>
                    <Select
                        input
                        v-model="filter.type_id"
                        :options="type_opt"
                        @update="filterTypeUpd"
                    ></Select>
                </li>
                <li>
                    <span>游戏厂商</span>
                    <Select
                        v-model="filter.vendor_id"
                        :options="vendor_opt"
                        @update="filterVendorUpd"
                    ></Select>
                </li>

                <li>
                    <span>游戏名称</span>
                    <Select
                        input
                        v-model="filter.game_id"
                        :options="game_name_opt"
                        @update="filterGameNameUpd"
                    ></Select>
                </li>
                <li>
                    <button class="btn-blue" @click="getList">查询</button>
                </li>
            </ul>
            <div class="right">
                <button class="btn-blue" @click="downloadAllPic">下载本页所有图片</button>
            </div>
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
                                <img class="td-pic-show" :src="row.icon" alt="图片加载中" />
                            </template>
                        </PicShow>
                    </td>
                    <td>{{row.vendor&&row.vendor.name || '--'}}</td>
                    <td>{{row.name}}</td>
                    <td>{{(row.type&&row.type.name)+' - '+(row.sub_type&&row.sub_type.name)}}</td>
                    <td>
                        <Switchbox v-model="row.status" @update="statusSwitch(row)" />
                    </td>
                    <td>{{row.last_editor ||'---'}}</td>
                    <td>{{row.updated_at}}</td>
                    <td>
                        <!-- <button class="btns-blue" @click="edit(row)">编辑</button> -->
                        <!-- <button :class="[row.status?'btns-red':'btns-green']" @click="statusSwitch(row)">{{row.status===1?'禁用':'启用'}}</button> -->
                        <div class="td-btns">
                            <Upload
                                style="width:90px;"
                                title="上传图片"
                                @change="upPicChange($event, row)"
                            />
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
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import GameManageDetail from './GameManageDetail'
import tool from '../../../js/tool'
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
                game_id: ''
            },
            vendor_opt: [],
            type_opt: [],
            // game_name_opt: [],
            vendor_opt: [], // 游戏厂商

            type_opt: [], // 游戏父类
            game_name_opt: [], // 游戏名称
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
        /**
         * 更具value获取 匹配的值children
         * @param {boolean} isAddAll 是否加上全部 {label:'全部',value:''}
         */
        getMatchOpt(val, father_arr = [], isAddAll) {
            let arr = []
            if (isAddAll) {
                arr = [{ label: '全部', value: '' }]
            }
            father_arr.forEach(father => {
                if (father.value === val || !val) {
                    if (father.children && Array.isArray(father.children)) {
                        father.children.forEach(child => {
                            // 设置 游戏子类
                            arr.push(child)
                        })
                    }
                }
            })
            return arr
        },
        /**根据厂商id 找 游戏主类id */
        VendorIdFindType(vendor_id) {
            let type_id
            this.type_opt.forEach(item => {
                if (item.children && item.children.length) {
                    let vendor_obj = item.children[0]
                    if (vendor_obj.value === vendor_id) {
                        type_id = item.value
                    }
                }
            })
            return type_id
        },
        /** 游戏分类 update */
        filterTypeUpd(type_id) {
            this.$set(this.filter, 'vendor_id', '')
            this.$set(this.filter, 'game_id', '')
            let curr_type = this.type_opt.find(item => item.value === type_id)
            if (curr_type && curr_type.children) {
                if (curr_type.children.length === 1) {
                    let vendor = curr_type.children[0] || {}
                    this.$set(this.filter, 'vendor_id', vendor.value)
                }
            }
            // 更新 游戏名称
            this.game_name_opt = this.getMatchOpt( this.filter.vendor_id, this.vendor_opt, true )
        },
        /** 游戏厂商更新 */
        filterVendorUpd(vendor_id) {
            this.$set(this.filter, 'type_id', '')
            this.$set(this.filter, 'game_id', '')
            // 更新 游戏分类(filter)
            this.filter.type_id = this.VendorIdFindType(vendor_id) || ''
            // 更新 游戏名称
            this.game_name_opt = this.getMatchOpt(
                vendor_id,
                this.vendor_opt,
                true
            )
        },
        filterGameNameUpd(val) {
            if (!val) return
            let vendor_arr = this.vendor_opt.find(item => {
                let isHad = (item.children || []).find(child => {
                    return child.value === val
                })
                return isHad
            })
            this.filter.vendor_id = (vendor_arr || {}).value // 设置游戏厂商
            this.filter.type_id = this.VendorIdFindType(this.filter.vendor_id)
        },
        downloadAllPic() {
            // var fileName = '打包图片'
            let fileName =
                window.all.tool.getChainName('/game/gamemanage') +
                ' ' +
                'p' +
                this.pageNo
            var zip = new JSZip()
            var imgs = zip.folder(fileName)
            var baseList = []
            // 要下载图片的url
            var arr = this.list.map(item => item.icon)
            // 下载后图片的文件名，个数应与arr对应
            var imgNameList = this.list.map(item => {
                return (item.vendor && item.vendor.name) + '-' + item.name
            })

            for (var i = 0; i < arr.length; i++) {
                let image = new Image()
                // 解决跨域 Canvas 污染问题
                image.setAttribute('crossOrigin', 'anonymous')

                image.onload = function() {
                    let canvas = document.createElement('canvas')
                    canvas.width = image.width
                    canvas.height = image.height

                    let context = canvas.getContext('2d')
                    context.drawImage(image, 0, 0, image.width, image.height)

                    let url = canvas.toDataURL() // 得到图片的base64编码数据
                    canvas.toDataURL('image/png')

                    baseList.push(url.substring(22)) // 去掉base64编码前的 data:image/png;base64,
                    if (baseList.length === arr.length && baseList.length > 0) {
                        for (let k = 0; k < baseList.length; k++) {
                            imgs.file(imgNameList[k] + '.png', baseList[k], {
                                base64: true
                            })
                        }
                        zip.generateAsync({ type: 'blob' }).then(function(
                            content
                        ) {
                            // see FileSaver.js
                            FileSaver.saveAs(content, fileName + '.zip')
                        })
                    }
                }
                image.src = arr[i]
            }
        },
        checkForm() {
            if (this.form.name === '') {
                return false
            }
            return true
        },

        statusSwitch(row) {
            this.curr_row = row
            this.modConf()
        },
        // 更改状态
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
                    console.log('🍏 res: ', res)
                    // this.pic_data = res.data.path
                    if (res.data) {
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
        iconUpdate(id, res) {
            console.log('🥩 id: ', id)
            console.log('🍕 res: ', res)
            let data = {
                id: id,
                icon_id: res.id
            }
            data = window.all.tool.rmEmpty(data)

            let { url, method } = this.$api.game_icon_set
            this.$http({ method, url, data }).then(res => {
                // console.log('列表👌👌👌👌: ', res)
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
            let name = (row.vendor && row.vendor.name) + '-' + row.name
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
        /** 获取下拉框内容 */
        getSelectOpt() {
            tool.getJsonOpt('game_vendors__games').then(res => {
                if (res && Array.isArray(res)) {
                    this.vendor_opt = [{ label: '全部', value: '' }]
                    res.forEach(item => {
                        let children = []
                        if (item.games_under_vendor) {
                            children = item.games_under_vendor.map(child => {
                                return { label: child.name, value: child.id }
                            })
                        }
                        this.vendor_opt.push({
                            label: item.name,
                            value: item.id,
                            children: children
                        })
                    })
                    this.game_name_opt = this.getMatchOpt(
                        '',
                        this.vendor_opt,
                        true
                    )
                }
            })
            // 游戏分类, 游戏父类 设置
            tool.getJsonOpt('game_type_vendors').then(res => {
                if (res && Array.isArray(res)) {
                    // self.type_opt = []
                    this.type_opt = [{ label: '全部', value: '' }]
                    // this.vendor_obj = {}

                    res.forEach(item => {
                        let children = []
                        if (item.vendors) {
                            children = item.vendors.map(child => {
                                return { label: child.name, value: child.id }
                            })
                        }
                        this.type_opt.push({
                            label: item.name,
                            value: item.id,
                            children: children
                        })
                    })
                }
            })
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
                game_id: this.filter.game_id,
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
    created() {
        this.getSelectOpt()
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
    display: block;
    padding-top: 3px;
}
.td-pic-show {
    max-width: 600px;
    max-height: 350px;
    display: block;
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
.block {
    display: block;
}
</style>