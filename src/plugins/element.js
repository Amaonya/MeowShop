import Vue from 'vue'
import {
  Button,
  Input,
  Form,
  FormItem,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  Submenu,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Link,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Select,
  Option,
  MessageBox
}
from 'element-ui'

import '../assets/theme/index.css'
import 'element-ui/lib/theme-chalk/display.css';

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
Vue.use(Image)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Link)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
