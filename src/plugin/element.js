import Vue from "vue";
import {Button, Form, FormItem, Input,Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem,
    Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,Tag,
    MessageBox,Upload,Popover,Select,Option,Radio,Alert,Dropdown,DropdownMenu,DropdownItem,Popconfirm,
    Steps,Step,Tabs,TabPane,OptionGroup,Notification,Drawer,RadioGroup,DatePicker,Backtop,Cascader,
    PageHeader,Image} from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';


export default function () {
    Vue.use(Button)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(Container)
    Vue.use(Header)
    Vue.use(Aside)
    Vue.use(Main)
    Vue.use(Menu)
    Vue.use(MenuItem)
    Vue.use(Submenu)
    Vue.use(Breadcrumb)
    Vue.use(BreadcrumbItem)
    Vue.use(Card)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(TableColumn)
    Vue.use(Table)
    Vue.use(Switch)
    Vue.use(Tooltip)
    Vue.use(Pagination)
    Vue.use(Dialog)
    Vue.use(Tag)
    Vue.use(Upload)
    Vue.use(Popover)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Radio)
    Vue.use(Alert)
    Vue.use(DropdownItem)
    Vue.use(DropdownMenu)
    Vue.use(Dropdown)
    Vue.use(Popconfirm)
    Vue.use(Step)
    Vue.use(Steps)
    Vue.use(TabPane)
    Vue.use(Tabs)
    Vue.use(OptionGroup)
    Vue.use(Drawer)
    Vue.use(RadioGroup)
    Vue.use(DatePicker)
    Vue.use(Backtop)
    Vue.use(Cascader)
    Vue.use(PageHeader)
    Vue.use(Image)
    //挂载弹框组件
    Vue.prototype.$message=Message
    //挂载弹框
    Vue.prototype.$confirm=MessageBox.confirm
    Vue.prototype.$notify=Notification
}
