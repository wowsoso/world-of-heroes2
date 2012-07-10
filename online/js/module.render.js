/**
 * 背包
 * @author
 */
(function(_win){

	var cache = {};
	_win.tmpl =  function (str, data){
	var fn = !/\W/.test(str) ?
	  cache[str] = cache[str] ||
		tmpl(document.getElementById(str).innerHTML) :

	  new Function("obj",
		"var p=[],print=function(){p.push.apply(p,arguments);};" +
		"with(obj){p.push('" +

		str
		  .replace(/[\r\t\n]/g, " ")
		  .split("<%").join("\t")
		  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
		  .replace(/\t=(.*?)%>/g, "',$1,'")
		  .split("\t").join("');")
		  .split("%>").join("p.push('")
		  .split("\r").join("\\'")
	  + "');}return p.join('');");

	return data ? fn( data ) : fn;
	};

	var _doc = _win.document;


    //开始界面
    Intro = {
        tpl:function(id){
            return '<div class="button" id="'+id+'"></div>'
        },
        tpl_pop:function(id){return '<div id="'+id+'" class="sub-win">'+
            '<div class="content">内容</div>'+
            '<button class="close" data-toggle='+id+'></button>'
        '</div>'},//弹出窗
        total:4,
        init:function(){
            var items = [];
            for(var i = 1; i <= this.total; i++){  
                items.push(this.tpl("btn-"+i));
            }
           _doc.getElementById('intro').innerHTML = items.join('');
           _doc.getElementById('intro').addEventListener('mousedown',this.callbackFunc,false);
           _doc.getElementById('intro').addEventListener('touchstart',this.callbackFunc,false);
           //添加三个子窗体
           for(var i=0;i<3;i++){
              var sub=document.createElement();
              _doc.getElementById('intro').appendChild(sub);
              sub.outerHTML=this.tpl_pop('Intro-'+i);
              document.getElementById('Intro-'+i).querySelector('.close').addEventListener(
                 'click',function(){document.getElementById(this.getAttribute('data-toggle')).style.display='none';},false
              );
            }
            //设置三个子窗体中的内容
        },
        unInit:function(){

        },
        callbackFunc:function(e){
            if(e.target.id.substring(0,4)=='btn-'){
                //e.target.style.background="url(../online/resources/images/index/index-btn-press.png) no-repeat";
                switch(e.target.id){
                    case 'btn-1':setTimeout('woh.gameScript.continueExec()',300);break;
                    case 'btn-2':document.getElementById('Intro-0').style.display='block';break;
                    case 'btn-3':document.getElementById('Intro-1').style.display='block';break;
                    case 'btn-4':document.getElementById('Intro-2').style.display='block';break;
                    default:break;
                }
            }
        },
    };
    //CG界面
    CG={
        tpl:'<button class="skip"></button>',
        init:function(){
            this.render();
            this.bind();
        },
        callbackFunc:function(e){
            woh.gameScript.continueExec();
        },
        render:function(){
            _doc.getElementById('cg').innerHTML = this.tpl;
        },
        bind:function(){
            _doc.querySelector('#cg button.skip').addEventListener('mousedown',this.callbackFunc,false);
        }
    }
    //对话界面
    Dialogue = _win.Dialogue = {
        tpl:function(data){
        var str = '<div  class="chat-wrap" style="background:url(<%=globalBg%>) no-repeat 0 0"><div class="chat">'+
            '<%if( typeof position !=="undefined" && position == "right"){%>'+
                '<%if(avatar){%>'+
                    '<div class="avatar right scaleX"><img src="<%=avatar%>" alt="" /></div>'+
                '<%}%>'+
                '<div class="bg scaleX"></div>'+
            '<%}else{%>'+
                '<%if(avatar){%>'+
                    '<div class="avatar left"><img src="<%=avatar%>" alt="" /></div>'+
                '<%}%>'+
                '<div class="bg"></div>'+
            '<%}%>'+
            '<div class="content">'+
                '<%if(name){%>'+
                '<h1><span>【</span><span class="name"><%=name%></span><span>】</span></h1>'+
                '<%}%>'+
                '<p class="words"><%=content%></p>'+
            '</div>'+
        '</div></div>';
        return str;
        },
        init:function(data){
            this.data = data;
            this.index = 0;
            _doc.querySelector('#dialogue').innerHTML = '<div class="content-wrap"></div><button class="skip" id="skip-dialogue"></button>';
            this.render();
            this.bind();
        },
        render:function(){
            if(this.index >= this.data.length){
                woh.gameScript.continueExec();
            }else{
                _doc.querySelector('#dialogue div.content-wrap').innerHTML= tmpl(this.tpl(), this.data[this.index]);
            }
        },
        bind:function(){
            var self = this;
             _doc.querySelector('#dialogue .content-wrap').addEventListener('click', function(){
                self.index++;
                self.render();
            }, false);
            _doc.getElementById('skip-dialogue').addEventListener('click', function(){
                woh.gameScript.continueExec();
            },false);
        }
    }
    //战斗界面
    Battle={
        tpl:'<div class="skill-icons"></div>',
        init:function(){},
        render:function(){},
        bind:function(){}
    }

    //地图界面
    Map={
        tpl:function(){
            return '<div class="button" id="map-leave"></div>' +
                '<div class="button" id="map-skill"></div>' +
                '<div class="button" id="map-person"></div>'+
                '<div id="role-manage" class="sub-win"></div>'+
                '<div id="skill-manage" class="sub-win"></div>'
        },
        init:function(){
            this.render();
            this.bind();
        },
        render:function(){
            _doc.getElementById('map').innerHTML=this.tpl();
        },
        bind:function(){
            _doc.getElementById('map-person').addEventListener('click', function(){
                roleManager.init();
            });
            _doc.getElementById('map-leave').addEventListener('click', function(){
                woh.gameScript.continueExec();
            })
        }
    }

    //物品管理界面
    var roleManager = _win.roleManager = {
        currentActiveRole:0,
        tpl:function(){
          return "<button class='close'>"+
                 "</button>"+
                 "<div class='left-block'>"+
                    "<ul class='ava-bar'>"+
                    "</ul>"+
                    "<div class='role-info'>"+
                        "<h1 id='name'></h1>"+
                        "<div id='weapon'>"+
                        "</div>"+
                        "<div id='preview'>"+
                        "</div>"+
                        "<div id='clothes'>"+
                        "</div>"+
                        "<ul class='role-attributes'>"+
                            "<li><label>生命：</label><span id='health'></span></li>"+
                            "<li><label>攻击：</label><span id='attack'></span></li>"+
                            "<li><label>防御：</label><span id='defend'></span></li>"+
                            "<li><label>暴击：</label><span id='crit'></span></li>"+
                        "</ul>"+
                        "<div class='exp-bar'>"+
                            "<div class='exp-bar-inner'>"+
                                "<div class='exp-value'>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                     "</div>"+
                 "</div>"+
                 "<div class='right-block'>"+
                    "<ul class='items'>"+
                    "</ul>"+
                    "<div class='description'>"+
                        "<h3 class='name'>"+
                        "</h3>"+
                        "<p class='content'></p>"
                    "</div>"+
                 "</div>"
        },
        initData:function(id){
            this.currentActiveRole=id;                          
            var data=woh.runtime.activeRole[id];//显示相应人物的数据
            _doc.querySelector('#role-manage .role-info h1#name').innerHTML=data['name']+'<small> Lv:'+data['lv']+'</small>';
            //载入相关数据
            console.log(woh.skill_rate);
            var rate_info=woh.skill_rate[data['type']],
                level_info=woh.base_level_data[data['lv']];
            //根据偏移百分比计算出基础数值
            var health=rate_info['health']*level_info['health'],
                attack=rate_info['attack']*level_info['attack'],
                defend=rate_info['defend']*level_info['defend'],
                crit=rate_info['crit']*level_info['crit'];
            //加上装备的加成值
            //武器的加成值
            if(data['weapon']!='none'){
                var weapon=woh.item_data['weapon'][data['weapon']];
                    health+=weapon['health'];
                    attack+=weapon['attack'];
                    defend+=weapon['defend'];
                    crit+=weapon['crit'];
            }
            //衣服的加成值
            if(data['clothes']!='none'){
                var clothes=woh.item_data['clothes'][data['clothes']];
                    health+=clothes['health'];
                    attack+=clothes['attack'];
                    defend+=clothes['defend'];
                    crit+=clothes['crit'];
            }
            //读取当前经验值
            var exp_length=220*data['exp']/woh.base_level_data[data['lv']+1]['exp']+'px';
            //console.log(exp_length);
            //界面渲染的相关部分，应当提出来
            //将数据渲染到界面上
            _doc.querySelector('#role-manage .role-info .role-attributes #health').innerHTML=health;
            _doc.querySelector('#role-manage .role-info .role-attributes #attack').innerHTML=attack;
            _doc.querySelector('#role-manage .role-info .role-attributes #defend').innerHTML=defend;
            _doc.querySelector('#role-manage .role-info .role-attributes #crit').innerHTML=crit*100;
            _doc.querySelector('#role-manage .role-info .exp-value').style.width=exp_length;
            //高亮当前人物头像
            
            //重置物品栏的可用物品
        },
        renderItemlattic:function(){
            var items=[];
            for(var i=0;i<15;i++){
                items.push("<li></li>");
            }
            items=items.join('');
            _doc.querySelector('#role-manage ul.items').innerHTML=items;

        },
        renderItems:function(){
            var that=this;
            //渲染物品图标
            var itemlattics=_doc.querySelectorAll('#role-manage ul.items li'),
                itemdatas=woh.runtime.packageItems;
            for(var i in itemdatas){
                itemlattics[i].innerHTML="<img width='77' height='77' src='"+woh.item_data[itemdatas[i][0]][itemdatas[i][1]]['icon']+"' draggable='true'"
                +"datatype='"+woh.runtime.packageItems[i][0]+"' datatag='"+woh.runtime.packageItems[i][1]+"'/>";
            }
            //处理换装流程
            var draggingType,
                draggingId;
            _doc.querySelector('#role-manage .items').addEventListener('dragstart',function(e){
                draggingType=e.target.attributes['datatype'].nodeValue;
                draggingId=e.target.attributes['datatag'].nodeValue;
            },false);
            _doc.getElementById('weapon').ondragover=function(e){
                if (e.preventDefault) 
                    e.preventDefault();                                          
            };
            _doc.getElementById('weapon').addEventListener('drop',function(e){
                console.log(e.target);
                if(draggingType=='weapon'){
                    if(e.target.id=='weapon'){
                        e.target.innerHTML="<img width='77' height='77' src='"+woh.item_data['weapon'][draggingId]['icon']+"'/>";
                    }
                    else{
                        e.target.src=woh.item_data['weapon'][draggingId]['icon'];
                    }
                }
                //更新相关数据
                woh.runtime.activeRole[that.currentActiveRole]['weapon']=draggingId;
                that.initData(that.currentActiveRole);
            },false);
        },
        setEquipment:function(type,id){

        },
        init : function(data){
            var roleinfo = _doc.getElementById('role-manage');
            roleinfo.innerHTML = this.tpl();
            roleinfo.style.display = 'block';
           
            this.renderItemlattic()
            this.bind();
            this.initAvatarBar();
            this.initData(0);
            _doc.querySelector('#role-manage .ava-bar .avar:first-child').className+=' active';
            this.renderItems();
        },
        unInit : function(){

        },
        bind : function(){
            var that=this;
            _doc.querySelector('#role-manage .close').addEventListener('click', function(){
                _doc.getElementById('role-manage').style.display = 'none';
            });
            _doc.querySelector('#role-manage .ava-bar').addEventListener('click',function(e){
                if(e.target.id){
                   that.initData(e.target.getAttribute('data-toggle'));
                   _doc.querySelector('#role-manage .ava-bar .active').className='avar standard-stroke';
                   e.target.parentNode.className+=" active";
                }
            },false);
        },
        initAvatarBar:function(){ //载入活动人物的头像
            for(var i in woh.runtime.activeRole){
                console.log(woh.runtime.activeRole[i]);
                _doc.querySelector('#role-manage .ava-bar').innerHTML+='<li class="avar standard-stroke"><img width="105" height="105" id="role'+i+'" src="'+woh.runtime.activeRole[i]['avatar']+'" data-toggle="'+i+'"></li>';
            }
        }
    }
    //点技能界面
    //需求：类似dota的点技能，当技能处于可点状态，点击相应图标升级技能，每升级一次消耗一个技能点
    var skillManager = _win.roleManager = {
        tpl:function(){
          return "<div>"+
                    
                "</div>"
        },
        init : function(){
            var skillinfo = _doc.getElementById('skill-manage');
            skillinfo.innerHTML = this.tpl();
            skillinfo.style.display = 'block';
            this.bind();
        },
        unInit : function(){

        },
        bind : function(){
             _doc.querySelector('#skill-manage .close').addEventListener('click', function(){
                _doc.getElementById('skill-manage').style.display = 'none';
            })
        }
    };
    Map.init();
    Intro.init();
    CG.init();
})(window);

