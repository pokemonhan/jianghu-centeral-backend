<template>
    <div class="container">
        
        <!--------------------   发邮件   ----------------->
        <div class="body">
            <div class="left">
                <div class="hd-btn">
                    <button class="btn-plain">立即发送</button>
                    <button class="btn-plain ml20" @click="dia_show=true" >定时发送</button>
                </div>
                <ul class="form">
                    <li v-show="recipient_show">
                        <span>收件人：</span>
                        <Input
                            class="w500"
                            placeholder="例子:  联系人1, 联系人2, 联系人3"
                            v-model="recipients"
                            @input="recipientUpd"
                        />
                    </li>
                    <li>
                        <span>标题:</span>
                        <Input class="w500" v-model="title" />
                    </li>
                    <li>
                        <Upload
                            style="width:90px;"
                            title="选择图片"
                            @change="upPicChange"
                        />
                        <span v-show="pic_data">
                            <img class="img-show" :src="pic_data" alt="没有图片">
                            <button class="btns-red" @click="clearPic">清除</button>
                        </span>
                    </li>
                    <li>
                        <span>内容:</span>
                        <textarea class="textarea" v-model="content"></textarea>
                    </li>
                    <li>
                        <span>发件人：</span>
                        <span class="blue">{{'app-id'}}</span>
                    </li>
                    <li>
                        <button class="btn-plain">立即发送</button>
                        <button class="btn-plain ml20" @click="dia_show=true">定时发送</button>
                    </li>
                </ul>
            </div>
            <div class="right">
                <div class="recent-contact">
                    <div class="head">
                        <span>最近联系人</span>
                        <span>清空</span>
                    </div>
                    <ul class="cont">
                        <li>
                            <span>我在吃火锅55</span>
                            <span>5252452</span>
                        </li>
                        <li>
                            <span>我在吃火锅</span>
                            <span>5252452</span>
                        </li>
                        <li class="flex">
                            <!-- <Checkbox label="文字文字" /> -->
                            <span>我在吃火锅</span>
                            <span>5252452</span>
                        </li>
                    </ul>
                </div>
                <div class="contact">
                    <div class="head">
                        <span>联系人</span>
                    </div>
                    <div v-show="contact_show" class="cont">
                        <Tree style="width:120px;" :list="tree_list" @change="treeUpd"/>
                    </div>
                </div>
            </div>
        </div>
        <Dialog :show.sync="dia_show" title="定时发送">
            <div class="dia-inner">
                <div>
                    <div>选择定时发送的时间:</div>
                    <div class="date-pick">
                        <Select v-model="dates[0]" :options="year_opt"></Select>
                        <span>年</span>
                        <Select v-model="dates[1]" :options="month_opt"></Select>
                        <span>月</span>
                        <Select v-model="dates[2]" :options="date_opt"></Select>
                        <span>日</span>
                        <Select v-model="dates[3]" :options="hour_opt"></Select>
                        <span>时</span>
                        <Select v-model="dates[4]" :options="minute_opt"></Select>
                        <span>分</span>
                    </div>
                    <div style="margin-top:10px;">
                        <span>该邮件将在</span>
                        <span class="green">{{date_show}}</span>    
                        <span>发送到对方</span>
                    </div>
                </div>
                <div class="mt100">
                    <button class="btn-plain-large" @click="dia_show=false">取消</button>
                    <button class="btn-blue-large ml20">发送</button>
                </div>
            </div>
        </Dialog>
    </div>
</template>


<script>
import Tree from '../../commonComponents/Tree.vue'
export default {
    components: {
        Tree: Tree
    },
    data() {
        return {
            recipients: '',
            recipient_show: true,
            title: '',
            pic_data: '',
            content: '',
            contact_show: true,
            tree_list: [
                {
                    label: '厅主群主',
                    child: [
                        { label: '全部厅主' }
                    ]
                },
                {
                    label: '厅主列表',
                    child: [
                        { label: '江湖互娱1' },
                        { label: '江湖互娱2' },
                        { label: '江湖互娱3' },
                        { label: '江湖互娱4' },
                    ]
                },
            ],
            dia_show: false,
            dates: ['2019', '01', '01', '00', '00', '00'],
            year_opt: [],
            // date_opt: [],
            month_opt: [],
            hour_opt: [],
            minute_opt: []
        }
    },
    computed: {
        date_opt(){
            let year = this.dates[0]
            let month = parseInt(this.dates[1])
            let day_mount = this.getMonthDays(year, month-1)
            let date_arr =[]
            for(var i=1; i<=day_mount; i++){
                let item = '0'+i
                date_arr.push(item.slice(-2))
            }
            let opt = this.arrToOpt(date_arr)
            return opt
        },
        date_show(){
            let date = this.dates[0]+'-'+this.dates[1] + '-'+this.dates[2]+' '+this.dates[3]+':'+this.dates[4]+':00'
            let time = new Date(date)
            return time.toLocaleString()
        }
    },
    methods: {
        recipientUpd(val) {
            if(val){
                console.log('val: ', val);
                this.contact_show = false
            }else {
                this.contact_show = true
            }
        },
        upPicChange(e) {
             let self = this
            let file = e.target.files[0]
            let date = new FormData()

            date.append('uploadimg', file)
            console.log('文件的内容', date)
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onerror = function() {
                return
            }
            reader.onload = function() {
                // self.src[index] = this.result
                self.pic_data = this.result
            }

        },
        clearPic(){
            this.pic_data =''
        },
        // 数组变成 select 的 opt
        arrToOpt(arr) {
            let opt = []
            opt = arr.map(year => {
                return { label: year, value: year } 
            })
            return opt
        },
        //  获得某月的天数 
        getMonthDays(year,myMonth) {
            var monthStartDate = new Date(year, myMonth, 1)
            var monthEndDate = new Date(year, myMonth + 1, 1)
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
            return days
        },
        initOpts() {
            // 年
            let year_arr = [ '2019', '2020', '2021', '2022', '2023', '2024', '2024', '2025' ]
            this.year_opt = this.arrToOpt(year_arr)
            // 月
            let month_arr = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ]
            this.month_opt = this.arrToOpt(month_arr)
            // 日 根据月份变化, 在computed中

            // 时
           let hour_arr = []
            for(var i=0; i<24; i++){
                let item = '0'+i
                hour_arr.push(item.slice(-2))
            }
            this.hour_opt = this.arrToOpt(hour_arr)
            // 分
           let minute_arr = []
            for(var i=0; i<60; i++){
                let item = '0'+i
                minute_arr.push(item.slice(-2))
            }
            this.minute_opt = this.arrToOpt(minute_arr)

        },
        treeUpd(bool,idx,list) {
            console.log('list: ', list);
            console.log('bool: ', bool);
            // 获取是否有选中项
            let have_checked=list.some(item=>{
                //遍历子项 查看是否有选中项
                if(item.child){
                    let child_bool = item.child.some(child=>{
                        return child.checked
                    })
                    if(child_bool) return true
                }else {
                    return item.checked
                }
            })
            if(have_checked){
                this.recipient_show = false
            }else {
                this.recipient_show = true
            }
        }
    },
    created() {
        this.initOpts()
    },
    mounted() {
            // let recip = this.recipients && this.recipients.replace(/[\s]+/g,'')
            // recip = this.recipients && this.recip.replace(/[，]/g,',')
    }
}
</script>

<style scoped>
.body {
    display: flex;
    justify-content: space-between;
}
.left {
    width: 560px;
    height: 100%;
}
.hd-btn {
    display: flex;
    background: #f2f2f2;
    padding: 10px;
}
.w500 {
    width: 500px;
}
.p10 {
    padding: 10px;
}
.form > li {
    display: flex;
    align-items: baseline;
    margin-top: 20px;
}
.form > li > span:first-child {
    width: 4.1em;
}
/* 图片 */
.img-show {
    max-width: 400px;
    max-height: 100px;
    margin-left: 20px;
}
.form .textarea {
    width: 500px;
    height: 330px;
}
.ml10 {
    margin-left: 10px;
}

.right {
    width: 300px;
    border-radius: 5px;
    border: 1px solid #f2f2f2;
    user-select: text;
}
/* 最近联系人 */
.right .recent-contact {
    height: 185px;
    overflow: auto;
}
.right .recent-contact .head,
.right .contact .head {
    padding: 12px 10px;
    font-size: 16px;
    color: #4c8bfd;
    background: #f2f2f2;
}

.recent-contact .head span:nth-child(2) {
    font-size: 14px;
    margin-left: 160px;
    text-decoration: underline;
    color: #4c8bfd;
    cursor: pointer;
}
.recent-contact .cont {
    padding-left: 30px;
}
.recent-contact .cont > li {
    margin-top: 10px;
}
.recent-contact .cont > li > span:first-child {
    display: inline-block;
    width: 130px;
}

/* 联系人 */
/* .contact {
    border: 1px solid red;
} */
.contact .cont {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
}
.dia-inner {
    width: 600px;
    height: 320px;
    padding-top: 80px;
}
.mt100 {
    margin-top: 100px;
    text-align: right;
}
.ml20 {
    margin-left: 20px;
}
.dia-inner .date-pick {
    display: flex;
    align-items: center;
}
.dia-inner .date-pick span {
    margin: 0 5px;
}
</style>
