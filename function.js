
const headerbox = {
  template:'<header class="hd"><router-link to="/">\
  <span class="hd_logo"><img src="/assets/img/common/logo.png"></span>\
  </router-link></header>'
}
const footerbox = {
  template:'<footer class="ft">\
  <span class="ft_copy">copyright &copy; example.com </span>\
  </footer>'
}
const Post = {
  data:function(){
     return {post:[
      {'time':'2019/10/30','post':'test','link':'https://test.jp/top','blank':'on'}
    ],
    view_post:{},
    pages:[],
    page_len:5,
    pager_len:null,
    pager_indexs:[],
    page_index:0,
    view_posts:[],
    page:''
    }
  },
  props:{id:String},
  template:'<div class="Single-post">\
  <div class="news_articleItem">\
    <time class="news_articleTime" v-bind:datetime="post.time">{{view_post.time}}</time>\
    <p class="news_articleText">\
      <span v-html="view_post.post"></span>\
    </p>\
    <div v-else class="news_articleTextArea">\
    <p class="news_articleText">\
      <span v-html="view_post.post"></span>\
    </p>\
    </div>\
  </div>\
    </div>\
    '
  ,
  mounted:function(){
    let _this = this;
    $.ajax({
      beforeSend : function(xhr) {
        xhr.overrideMimeType("text/plain; charset=shift_jis");
      },
      url : '/news.csv',
      dataType : 'text'
    }).done(function(text) {

      let _tmp = text.split("\r");
      let _result = [];
      for(var i=0;i<_tmp.length;++i){
          _result[i] = _tmp[i].split(',');
      }
      let _keys = _result.shift(1);

      _result = _.map(_result,function(item,i){
        let _object = {};
        _.each(item,function(item,k){
            _object[_keys[k]] = item;
        })
        return _object;
      });
      _this.posts = _result;
      _this.view_post　=　_.where(_result,{id:_this.id})[0]

    });
  }
};
const Posts = {
  data:function(){
     return {posts:[
      {'time':'2019/10/30','post':'test','link':'https://test.jp/top','blank':'on','id':1}
    ],
    pages:[],
    page_len:5,
    pager_len:null,
    pager_indexs:[],
    page_index:0,
    view_posts:[],
    page:''
    }
  },
  mounted:function(){
    let _this = this;
    $.ajax({
      beforeSend : function(xhr) {
        xhr.overrideMimeType("text/plain; charset=shift_jis");
      },
      url : '/news.csv',
      dataType : 'text'
    }).done(function(text) {

      let _tmp = text.split("\r");
      let _result = [];
      for(var i=0;i<_tmp.length;++i){
          _result[i] = _tmp[i].split(',');
      }
      let _keys = _result.shift(1);

      _result = _.map(_result,function(item,i){
        let _object = {};

        _.each(item,function(item,k){
            _object[_keys[k]] = item;
        })
        return _object;
      });

      _.map(_result,function(item){
        item.id = '/news/' + item.id
      });

      _result.sort(function(a,b) {
        return (a.time < b.time ? 1 : -1);
      });
      _this.posts = _result;
      _this.pages = _.chunk(_this.posts,_this.page_len);
      _this.pager_len = _this.pages.length;
      let params = (new URL(document.location)).searchParams;
      let _page_num = params.get('page');

      _this.page_index = parseInt((_page_num<_this.pager_len)?_page_num:0) || 0;
      _this.view_posts = _this.pages[_this.page_index];
      _this.set_pager(_this.page_index);

    });
  },
  methods:{
    change:function(){
      console.log('ok');
    },
    select_posts:function(index){
      
      let _this = this;

        //_this.$refs.list.$off('transitionend');
        //_this.$refs.list.$on('transitionend',function(){
        _this.page_index = index;
        _this.view_posts = _this.pages[_this.page_index];
        _this.set_pager(_this.page_index);
        _this.$refs.list.classList.add('is-active');
    //  });
      _this.$refs.list.classList.remove('is-active');

    },
    set_pager:function(index){
      //
      let _this = this;
      if(index==0){
        _this.pager_indexs = _.range(index,(index + 3));
      }else if(index==_this.pager_len-1){
        _this.pager_indexs = _.range((index - 2),_this.pager_len);
      }else{
        _this.pager_indexs = _.range((index - 1),(index + 2));
      }
    }
  },
  template:'<div class="list" id="list" v-on:transitionend="change">\
    <div class="list_in is-active" ref="list">\
    <article v-for="post in view_posts" class="news_articleList">\
    <div class="news_articleItem">\
      <time class="news_articleTime" v-bind:datetime="post.time">{{post.time}}</time>\
      <div v-if="post.id" class="news_articleTextArea">\
      <router-link v-bind:to="post.id">\
      <p class="news_articleText">\
        <span v-html="post.post"></span>\
      </p>\
      </router-link>\
      </div>\
      <div v-else class="news_articleTextArea">\
      <p class="news_articleText">\
        <span v-html="post.post"></span>\
      </p>\
      </div>\
    </div>\
  </article>\
  <div class="news_pager">\
    <span v-if="page_index>=2" class="news_pager_firstbtn">\
      <a v-on:click="select_posts(0)" class="news_pager_btn cmn-ff-mont">1</a>\
    </span>\
    <a v-for="(page,index) in pager_indexs" :key="index" v-on:click="select_posts(page)" v-bind:class="[(page==page_index)?\'is-current\':\'\']" class="news_pager_btn cmn-ff-mont">\
      {{(page+1)}}\
    </a>\
    <span v-if="page_index<=(pager_len-3)"  class="news_pager_lastbtn">\
      <a v-on:click="select_posts(pager_len-1)" class="news_pager_btn cmn-ff-mont">{{pager_len}}</a>\
    </span>\
  </div>\
  </div>\
  </div>\
  '
};

const routes = [
  { path: '/', component: Posts },
  { path: '/news/:id', component: Post,props:true }
];
const router = new VueRouter({
  mode: 'history',
  routes: routes
});
const app = new Vue({
  el:'#app',
  components:{
    headerbox,
    footerbox
  },
  router
});
