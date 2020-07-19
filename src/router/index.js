import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'views/login/Login'
import Home from 'views/home/Home'
import verify from "network/login/VerifyHttp";

Vue.use(VueRouter)

  const routes = [
      //登录的路由
    {
      path: '',
      component: Login,
      meta: {
        title: '欢迎您'
      },
      children: [
        {
          path: '/login/password',
          component: ()=>import('components/common/login/LoginPassword'),
          meta: {
            title: '登录'
          }
        }
          ,
        {
          path: '/login/message',
          component: () => import('components/common/login/LoginMessage'),
          meta: {
            title: '短信登录'
          }
        },
        {
          path: '/login/email',
          component: () => import('components/common/login/LoginEmail'),
          meta: {
            title: '邮箱登录'
          }
        },
        {
          path: '/register',
          component: ()=>import('components/common/login/Register'),
          meta: {
            title: '注册'
          }
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      redirect: '/home/user/search',
      meta: {
        title: '首页'
      },
      children: [
        {
          path: '/home/user/search',
          component:  ()=>import('components/content/Search/HomeSearch'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/home/search/userInfo',
          component:  ()=>import('components/content/Search/UserInfoShow'),
          meta: {
            title: '用户检索'
          }
        },
        {
          path: '/home/exam/examCenter',
          component:  ()=>import('components/content/Exam/ExamCenter'),
          meta: {
            title: '试卷中心'
          }
        },
        {
          path: '/home/exam/examSubscribe',
          component: ()=>import('components/content/Exam/ExamSubscribe'),
          meta: {
            title: '我的考试'
          }
        },
        {
          path: '/home/subjectManage',
          component: ()=>import('components/content/SubjectManager/SubjectManage'),
          meta: {
            title: '学科管理'
          }
        },
        {
          path: '/home/userManage',
          component: ()=>import('components/content/UserManager/UserManager'),
          meta: {
            title: '用户管理'
          }
        },
        {
          path: '/home/examineeManage',
          component: ()=>import('components/content/UserManager/ExamineeManage'),
          meta: {
            title: '考生管理'
          }
        },
        {
          path: '/home/topicManage',
          component: ()=>import('components/content/TopicManager/TopicManage'),
          meta: {
            title: '试题管理'
          }
        },
        {
          path: '/home/logManage',
          component: ()=>import('components/content/LogInfo/LogInfo'),
          meta: {
            title: '日志管理'
          },
        },
        {
          path: '/home/answerManage',
          component: ()=>import('components/content/TopicManager/TopicAnswerManage'),
          meta: {
            title: '试题情况'
          }
        },
        {
          path: '/home/testManage',
          component: ()=>import('components/content/TestManager/TestManager'),
          meta: {
            title: '试卷管理'
          },
        },
        {
          path: '/home/testManager/create',
          component: ()=>import('components/content/TestManager/CreateTest'),
          meta: {
            title: '新增试卷'
          }
        },
        {
          path: '/home/testManage/edit/:testId',
          component: ()=>import('components/content/TestManager/EditTest'),
          meta: {
            title: '编辑试卷'
          }
        },
        {
          path: '/home/examManage',
          component: ()=>import('components/content/ExamManage/ExamManage'),
          meta: {
            title: '考试管理'
          }
        },
        {
          path: '/home/grade',
          component: ()=>import('components/content/ExamResult/UserScore'),
          meta: {
            title: '分数查询'
          }
        },
        {
          path: '/home/statistics/score/one',
          component: ()=>import('components/content/Statistics/UserScoreStatistic'),
          meta: {
            title: '考试统计'
          }
        },
        {
          path: '/home/statistics/user',
          component: ()=>import('components/content/Statistics/UserStatistic'),
          meta: {
            title: '用户统计'
          }
        },
        {
          path: '/home/infoStatistics/score/more',
          component: ()=>import('components/content/Statistics/AllUserScoreStatistic'),
          meta: {
            title: '考试统计'
          }
        },
      ]
    }
  ]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//前置导航守卫
router.beforeEach((to,from,next)=>{
  //添加标题
  document.title=to.meta.title

  //进行身份验证
  if(!(/^(\/login\/\w*|\/|\/register)$/).test(to.path)) {
    console.log("身份验证path:"+to.path);
    verify().then((res) => {
      //验证成功
      if(res.result_code===200){
        next()
      }else{
        //失败
        next('/')
        Vue.prototype.$message({showClose: true,message: '请先登陆撒',type:'warning'})
      }
    })
  }
  next();
})

//后置钩子
router.afterEach((to, from) => {

});


export default router
