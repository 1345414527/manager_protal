import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,  //long 用户id,不可改变
      username: '', //用户名,不可改变
      status: null,  //boolean 用户身份 false:学生 true: 管理员,不可改变
      created: null, //java.util.Date  账号创建时间,不可改变
      name: '',  //用户自己创建的名称
      sno: '',   //用户的学号
      phone: '',  //用户的电话号码
      email: '',  //用户的email
      image: '',  //用户的头像
      age: null,  //年龄
      areaProvince: '', //省份
      areaCity: '',     //城市
      areaCounty: ''    //县
    }
  },
  mutations: {
    //设置用户信息，一般用来初始化
    setUserInfo(state,userInfo){
         state.user=userInfo
    },
    //修改用户名称
    updateName(state,name){
        state.user.name=name
    },
    //修改用户学号
    updateSno(state,sno){
      state.user.sno=sno
    },
    //修改用户电话
    updatePhone(state,phone){
      state.user.phone=phone;
    },
    //修改用户邮箱
    updateEmail(state,email){
      state.user.email=email
    },
    //修改用户头像
    updateImage(state,image){
      state.user.image=image
    },
    //修改用户的年龄
    updateAge(state,age){
      state.user.age=age
    },
    //修改用户的地区
    updateArea(state,payload){
      state.user.areaProvince=payload.areaProvince
      state.user.areaCity=payload.areaCity
      state.user.areaCounty=payload.areaCounty
    }
  },
  actions: {
    setUserInfo(context,userInfo){
      context.commit('setUserInfo',userInfo)
    }
  },
  getters: {
    getUserInfo(state){
      return state.user
    }
  },
  modules: {

  }
})
