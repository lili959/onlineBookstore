/* 
    加载模块
*/
let path = require('path');  //加载路径处理模块
require('colors');  //加载字体颜色模块
let querystring = require('querystring');  //提供字符串解析功能
let hbs = require('hbs');  //加载模板模块
let express = require('express');
let app = express();  //接收实例化的对象
let mysql = require('./moudel/mysql.js');
let md5 = require('md5-node');

let session = require('express-session');
let cookieParser = require('cookie-parser');

//将pageapi封装成文件进行处理
let pageApi = require('./moudel/pageApi');

//设置端口号
app.set('port',process.env.PORT || 8080);

//设置静态文件目录，所有不是HTML请求，都会指向当前的目录public
app.use(express.static(path.join(__dirname,'public')));
app.use('/index',express(path.join(__dirname,'public')));
app.use('/product-details',express(path.join(__dirname,'public')));
app.use('/search',express(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/afterend')));
app.use('/user_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/orders_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/book_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/category_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/provinces_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/city_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/area_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/street_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/detail_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/cgn_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/gwc_list',express.static(path.join(__dirname,'public/afterend')));
app.use('/update_book',express.static(path.join(__dirname,'public/afterend')));

//设置views变量，用于存放视图目录
app.set('views',path.join(__dirname,'view'));

// 设置使用模板后缀名
app.set('view engine','html');
//运行模板的方法
app.engine('html',hbs.__express);


/* 前端页面 */
app.use(cookieParser());
//使用中间件session
app.use(session({
    secret:'keyboard cat',
    name:'wssd',
    cookie:{maxAge:60 * 1000 * 60 * 24},
    resave:true,
    saveUninitialized:true
}));


/* 首页 */

// 重定向至首页
app.get('/',function(req,res){
    res.redirect('/index')
})
//首页路由
app.get('/index',function(req,res){
    // res.sendFile(path.join(app.get('views'),'index.html'));
    //新书推荐 //猜你喜欢 //热门产品  //书  //有声读物 //少儿童书
    mysql.getdata(function(list,list2,list3,list4,list5,list6){
        // console.log(list4);
        // res.render('admin/user_list',{data:list,page_html:page_html});
        var arr = [list,list2,list3,list4,list5,list6];
        for(var i=0;i<arr.length;i++){
           for(var j= 0;j<arr[i].length;j++){
               arr[i][j].picname = arr[i][j].picname.split(',')[0];
           }
        }
        var arr1 = list.slice(0,2);
        var arr2 = list.slice(2,4);
        var arr3 = list.slice(4,6);
        var arr4 = list.slice(6,8);
        var arr5 = list.slice(8,10);
        // console.log(arr1);
        res.render('index',{
            arr1:arr1,
            arr2:arr2,
            arr3:arr3,
            arr4:arr4,
            arr5:arr5,
            list2:list2,
            list3:list3,
            list4:list4,
            list5:list5,
            list6:list6});
    });
});
/* end */

/* 登录 */

// 登录路由
app.get('/login',function(req,res){
    res.sendFile(path.join(app.get('views'),'login.html'));
    // console.log(req.query);
});

app.get('/checkLogin',function(req,res){
    let username = req.query.username;
    let pass = req.query.pass;
    // console.log(username);
    // console.log(pass);
    mysql.getUserlogin(username,function(result){
        // console.log(result);
        if(result.length == 0){
            res.send('0');
        }else{
            let pass1 = md5(result[0].pass);
            // console.log(result);
            if(pass1 == pass){
                req.session.login = 1,
                req.session.username = result[0].name;
                req.session.user = result[0].username;
                req.session.code = result[0].id;
                res.send(result[0].name);
                
            }else{
                res.send('-1');
            }
        }
    })
})

app.get('/checksLogin',function(req,res){
    if(req.session.login){
        res.send(req.session.username);
    }else{
        res.send('0');  //未登录
    }
})
app.get('/loginout',function(req,res){
    req.session.login = '',
    req.session.username = '';
    req.session.user = '';
    req.session.code = '';
    res.end('0');
})
/* end */

/* 注册 */

//注册路由
app.get('/register',function(req,res){
    res.sendFile(path.join(app.get('views'),'register.html'));
});

app.get('/checkuser',function(req,res){
    let username = req.query.username;
    // console.log(username);
    mysql.getUserlogin(username,function(list){
        // console.log(list);
        if(list.length ==0){
            res.send('0');
        }else{
            res.send('-1');
        }
    })

})
app.post('/register_user',function(req,res){
    let post = '';
    req.on('data',function(data){
        post += data;
    })
    req.on('end',function(){
        post = querystring.parse(post);
        // console.log(post);
        post.state = 1;
        let times = new Date().toLocaleDateString();
        post.addtime = times;
        // console.log(post);
        mysql.getAdduser(post,function(result){
            if(result.length !=0){
                // console.log(result);
                res.redirect('/login');
            }
        })
    });
})
// app.post('/register_user',function(req,res){
//     console.log(req);
// })
/* end */

/* 搜索页 */

// 搜索路由
var input;
app.get('/searchs',function(req,res){
    input = req.query.input;
//     // console.log(input);
    res.end('0');
})
app.get('/search',function(req,res){
// app.post('/search',function(req,res){
    mysql.getbookdata(input,function(list,list1,list2,count){
        // console.log(count);
        var arr = [list,list1,list2];
        for(var j=0;j<arr.length;j++){
            for(var i=0;i<arr[j].length;i++){
                arr[j][i].picname = arr[j][i].picname.split(',')[0];
            }
        }
        res.render('search',{list:list,list1:list1,list2:list2,count:count,input:input})
    })
    // let post = '';
    // req.on('data',function(data){
    //     post += data;
    // })
    // req.on('end',function(){
    //     post = querystring.parse(post);
    //     mysql.getbookdata(post.input,function(list,list1,list2,count){
    //         // console.log(count);
    //         var arr = [list,list1,list2];
    //         for(var j=0;j<arr.length;j++){
    //             for(var i=0;i<arr[j].length;i++){
    //                 arr[j][i].picname = arr[j][i].picname.split(',')[0];
    //             }
    //         }
    //         res.render('search',{list:list,list1:list1,list2:list2,count:count,input:post.input})
    //     })
    // })
});
/* end */


/* 详情页 */
var id;
//书籍详情路由 
app.get('/product-details/:id',function(req,res){
    id = req.params.id;    
    res.redirect('/product-details');
});
app.get('/product-details',function(req,res){
    // console.log(id);
    mysql.Bookdetail(id,function(list,list2,list3){
        // console.log(list);
        // var img = list[0].picname.split(',');
        // console.log(img);
        // id = false;
        list[0].picname = list[0].picname.split(',');
        var arr = [list2,list3];
        for(var i=0;i<arr.length;i++){
            for(var j=0;j<arr[i].length;j++){
                arr[i][j].picname = arr[i][j].picname.split(',')[0];
            }
        }
        res.render('product-details',{data:list[0],list2:list2,list3:list3});
    })
});

app.get('/province',function(req,res){
    mysql.getPro(function(list){
        // console.log(list);
        // res.writeHead(200,{'Content-type':'application/json'});
        res.writeHead(200,{"Content-Type":'application/json','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});     // res.end(JSON.stringify(list));
        res.end(JSON.stringify(list));
    })
})
app.get('/city',function(req,res){
    var code = req.query.code;
    mysql.getcitys(code,function(list){
        // console.log(list);
        res.writeHead(200,{"Content-Type":'application/json','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});     // res.end(JSON.stringify(list));
        res.end(JSON.stringify(list));
    })
})
app.get('/area',function(req,res){
    var code = req.query.code;
    // console.log(code);
    mysql.getareas(code,function(list){
        res.writeHead(200,{"Content-Type":'application/json','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});     // res.end(JSON.stringify(list));
        res.end(JSON.stringify(list));
    })
})
app.get('/street',function(req,res){
    var code = req.query.code;
    mysql.getstreets(code,function(list){
        res.writeHead(200,{"Content-Type":'application/json','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});     // res.end(JSON.stringify(list));
        res.end(JSON.stringify(list));
    })
})
/* end */



/* 购物车页 */
//添加数据到购物车
app.get('/gwc',function(req,res){
    var data = JSON.parse(req.query.data);
    data.user = req.session.user
    mysql.getgwc(data,function(list){
        res.writeHead(200,{"Content-Type":'application/json','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});     // res.end(JSON.stringify(list));
        res.end(JSON.stringify(list));
    })
})

// 购物车路由
app.get('/cart',function(req,res){
    // res.sendFile(path.join(app.get('views'),'cart.html'));
    mysql.getcart(req.session.user,function(list){
        // console.log(list);
        res.render('cart',{data:list});
    })
});

//更改购物车信息
app.get('/updategwc',function(req,res){
    var book = JSON.parse(req.query.book);
    // console.log(book)
    mysql.updategwc(book,function(list){
        res.end('0');
    })

})
//删除购物车信息
app.get('/deletegwc',function(req,res){
    var id = req.query.id;
    mysql.delgwc(id,function(list){
        res.end('0');
    })
})
/* end */
var orders;
//填写订单路由
app.get('/checkoutdata',function(req,res){
    // res.sendFile(path.join(app.get('views'),'checkout.html'));
    orders = JSON.parse(req.query.orders);
    // console.log(orders);
    // res.redirect('/checkouts');
    res.end('1');
});

app.get('/checkout',function(req,res){
    mysql.getorderDate(orders,function(list1){
        // console.log(list1);
        res.render('checkout',{data:list1,total:orders.total});
    })
})

//新增收货地址
app.get('/add_address',function(req,res){
    var address = JSON.parse(req.query.address);
    pca = address.arr;
    address.user_id = req.session.code;
    // console.log(address);
    mysql.addconsignee(address,function(list){
        res.end(JSON.stringify(list));
    })
})

//获取收货地址
app.get('/address_data',function(req,res){
    var user_id = req.session.code;
    // console.log(address);
    mysql.getconsignee(user_id,function(list){
        res.end(JSON.stringify(list));
    })
})

//修改收货地址
app.get('/update_address',function(req,res){
    var cgn_id = req.query.cgn_id;
    // console.log(address);
    mysql.getconsignees(cgn_id,function(list){
        res.end(JSON.stringify(list));
    })
})
app.get('/updates_address',function(req,res){
    var data = JSON.parse(req.query.address)
    mysql.updateconsignee(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//删除收货地址
app.get('/remove_address',function(req,res){
    var cgn_id = req.query.cgn_id;
    // console.log(address);
    mysql.removeconsignee(cgn_id,function(list){
        res.end(JSON.stringify(list));
    })
})



/* 订单页 */
//确认订单
app.get('/confirm_order',function(req,res){
    var data = JSON.parse(req.query.data);
    data.uid = req.session.code;
    mysql.confirmOrder(data,req.session.user,function(list){
        // console.log(list);
        res.end(JSON.stringify(list));
    })
})
//修改订单
app.get('/update_order',function(req,res){
    var order_number = JSON.parse(req.query.order_number);
    mysql.updateordersdata(order_number,function(list){
        if(list){
            res.end('1');
        }
    })
});
// 订单表路由
app.get('/orders',function(req,res){
    if(req.session.code){
        mysql.getordersdata(req.session.code,function(list){
            for(var i=0;i<list.length;i++){
                if(list[i].status == '0'){
                    list[i].status = '交易取消';
                }else if(list[i].status == '1'){
                    list[i].status  = '确认成功';
                }else if(list[i].status == '2'){
                    list[i].status = '待收货';
                }
                list[i].addtime = list[i].addtime.split(' ')[0];
            }
            // console.log(list);
            res.render('orders',{data:list});
        })
    }else{
        res.redirect('/login')
    }
});

//修改订单状态
app.get('/updataorder',function(req,res){
    var order_number = JSON.parse(req.query.order_number);
    mysql.updateordersdatas(order_number,function(list){
        res.end('1')
    })
})
app.get('/cancal_order',function(req,res){
    var order_number = JSON.parse(req.query.order_number);
    mysql.cancalordersdata(order_number,function(list){
        res.end('1')
    })
})
/* end */





/* 后台页面 */
/* 登录 */

//登录页
app.get('/admin_login',function(req,res){
    res.sendFile(path.join(app.get("views"),'admin/admin_login.html'));
})

app.get('/checkadminlogin',function(req,res){
    var data = JSON.parse(req.query.data);
    var name = data.name;
    var pass = data.pass;
    mysql.getadminuser(name,function(result){
        if(result.length == 0){
            res.end('0');
        }else{
            if(pass == result[0].pass){
                // console.log(result);
                req.session.adminlogin = result[0].id;
                req.session.adminuser = result[0].name;
                req.session.adminadname = result[0].adname;
                req.session.time = data.time;
                res.send('1');
            }else{
                res.send('-1');
            }
        }
    })
})

app.get('/checkadminlogins',function(req,res){
    if(req.session.adminlogin){
        var data = {};
        data.user = req.session.user;
        data.adname = req.session.adminadname;
        data.time = req.session.time;
        res.end(JSON.stringify(data));
    }else{
        res.end('0');
    }
})

//后台退出登录
app.get('/adminlayout',function(req,res){
    req.session.adminlogin = '';
    req.session.adminuser = '';
    req.session.adminadname = '';
    req.session.time = '';
    res.redirect('/admin_login');
})
/* 首页 */

//首页
app.get('/admin_index',function(req,res){
    if(req.session.adminlogin){
        res.render('admin/admin_index',{user:req.session.adminuser,adname:req.session.adminadname,time:req.session.time});
    }else{
        res.redirect('/admin_login');
    }
    // res.sendFile(path.join(app.get("views"),'admin/admin_index.html'));
    // if(req.session.adminlogin == 1)
    // console.log(req.session.adminlogin);
    // console.log(req.session.adminuser);
    // console.log(req.session.adminadname);
})
/* end  */


/* end */

/* 用户管理 */

// 用户管理路由
app.get('/user_list',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/user_list.html'));
    res.redirect('/user_list/1');
})
app.get('/user_list/:page',function(req,res){
    let page_num = req.params.page;  //获取页码
    let pro_page = 15;  //初始15条数据
    mysql.getUser(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);  //共有几页
        //调用初始页码HTML方法
        let page_html = pagging(page_num,page_count,'getusers');
        for(var i=0;i<list.length;i++){
            if(list[i].sex == '0'){
                list[i].sex = '男';
            }else{
                list[i].sex = '女';
            }
            if(list[i].state == '0'){
                list[i].state = '禁用'
            }else{
                list[i].state = '启用'
            }
        }
        res.render('admin/user_list',{data:list,page_html:page_html});
    })
})
app.get('/getusers/:page',pageApi.getUsers);

//编辑用户
app.get('/edit_user',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/edit_users.html'));
    var id = req.query.id;
    mysql.getUsers(id,function(list){
        res.end(JSON.stringify(list));
    })
})
app.get('/edit_users',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/edit_users.html'));
    var data = JSON.parse(req.query.data);
    mysql.editUser(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//删除用户
app.get('/remove_users',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/edit_users.html'));
    var id = req.query.id;
    mysql.removeUsers(id,function(list){
        res.end(JSON.stringify(list));
    })
})
/* end */

/* 订单管理 start */

// 订单列表路由
app.get('/orders_list',function(req,res){
    // res.sendFile(path.join(app.get('views'),'admin/orders_list.html'));
    res.redirect('/orders_list/1');
})
app.get('/orders_list/:page',function(req,res){
    let page_num = req.params.page;  //获取页码
    let pro_page = 15;  //初始15条数据
    mysql.getOrder(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);  //共有几页
        //调用初始页码HTML方法
        let page_html = pagging(page_num,page_count,'getorders');
        for(var i=0;i<list.length;i++){
            if(list[i].status == '0'){
                list[i].status = '交易取消'
            }else if(list[i].status == '1'){
                list[i].status = '未付款'
            }else if(list[i].status == '2'){
                list[i].status = '待收货'
            }else{
                list[i].status = '已收货'
            }
        }
        res.render('admin/orders_list',{data:list,page_html:page_html});
    })
})
app.get('/getorders/:page',pageApi.getOrders);

//点击编辑获取订单数据
app.get('/get_orderdata',function(req,res){
    var id = req.query.id;
    mysql.getod(id,function(list){
        res.end(JSON.stringify(list));
    })
})

//管理员修改订单
app.get('/update_orders',function(req,res){
    var data = JSON.parse(req.query.data);
    mysql.editOrder(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//点击编辑删除订单数据
app.get('/remove_orderdata',function(req,res){
    var id = req.query.id;
    mysql.removeod(id,function(list){
        res.end(JSON.stringify(list));
    })
})

//订单详情表
app.get('/detail_list',function(req,res){
    // res.sendFile(path.join(app.get('views'),'admin/orders_list.html'));
    res.redirect('/detail_list/1');
})
app.get('/detail_list/:page',function(req,res){
    let page_num = req.params.page;  //获取页码
    let pro_page = 15;  //初始15条数据
    mysql.getDetail(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);  //共有几页
        //调用初始页码HTML方法
        let page_html = pagging(page_num,page_count,'getdetail');
        res.render('admin/detail_list',{data:list,page_html:page_html});
    })
})
app.get('/getdetail/:page',pageApi.getdetail);

//收货人地址表
app.get('/cgn_list',function(req,res){
    // res.sendFile(path.join(app.get('views'),'admin/orders_list.html'));
    res.redirect('/cgn_list/1');
})
app.get('/cgn_list/:page',function(req,res){
    let page_num = req.params.page;  //获取页码
    let pro_page = 15;  //初始15条数据
    mysql.getConsignee(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);  //共有几页
        //调用初始页码HTML方法
        let page_html = pagging(page_num,page_count,'getcgn');
        res.render('admin/cgn_list',{data:list,page_html:page_html});
    })
})
app.get('/getcgn/:page',pageApi.getcgn);

//购物车存放表
app.get('/gwc_list',function(req,res){
    // res.sendFile(path.join(app.get('views'),'admin/orders_list.html'));
    res.redirect('/gwc_list/1');
})
app.get('/gwc_list/:page',function(req,res){
    let page_num = req.params.page;  //获取页码
    let pro_page = 15;  //初始15条数据
    mysql.getGwc(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);  //共有几页
        //调用初始页码HTML方法
        let page_html = pagging(page_num,page_count,'getgwc');
        res.render('admin/gwc_list',{data:list,page_html:page_html});
    })
})
app.get('/getgwc/:page',pageApi.getgwc);




/* end */

/* 图书管理 start */

// 图书列表路由
app.get('/book_list',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/book_list.html'));
    res.redirect('/book_list/1');
})
app.get('/book_list/:page',function(req,res){
    let page_num = req.params.page;  //获取页码
    let pro_page = 15;  //初始15条数据
    mysql.getBook(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);  //共有几页
        //调用初始页码HTML方法
        for(var i=0;i<list.length;i++){
            if(list[i].state == 1){
                list[i].state = '新添加';
            }else if(list[i].state == 2){
                list[i].state = '在售';
            }else if(list[i].state == 3){
                list[i].state = '下架';
            }
        }
        let page_html = pagging(page_num,page_count,'getbook');
        res.render('admin/book_list',{data:list,page_html:page_html});
    })
})
app.get('/getbook/:page',pageApi.getBooks);

//添加图书
app.get('/add_book',function(req,res){
    mysql.gettypes(function(list){
        res.render('admin/add_book',{types:list});
    })
    // res.sendFile(path.join(app.get("views"),'admin/add_book.html'));
})
app.get('/add_books',function(req,res){
    var data = JSON.parse(req.query.data)
    mysql.addbook(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//编辑图书
app.get('/update_book/:id',function(req,res){
    var book_id = req.params.id;
    mysql.getbookid(book_id,function(list,list2){
        res.render('admin/update_book',{data:list,types:list2});
    })
    // res.sendFile(path.join(app.get("views"),'admin/update_book.html'));
})

//编辑图书
app.get('/add_books',function(req,res){
    var data = JSON.parse(req.query.data)
    mysql.addbook(data,function(list){
        res.end(JSON.stringify(list));
    })
})
app.get('/edit_book',function(req,res){
    var data = JSON.parse(req.query.data)
    mysql.editbook(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//删除图书
app.get('/delete_book',function(req,res){
    var book_id = req.query.id;
    mysql.deletebook(book_id,function(list){
        res.end(JSON.stringify(list));
    })
})


//搜索图书
app.get('/search_book/:keys',function(req,res){
    mysql.booksearch(req.params.keys,function(list){
        res.end(JSON.stringify(list));
    })
})
/* end */


/* 分类管理 start */

// 分类列表路由
app.get('/category_list',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/category_list.html'));
    res.redirect('/category_list/1');
})
app.get('/category_list/:page',function(req,res){
    let page_num = req.params.page;  //获取页码
    let pro_page = 15;  //初始15条数据
    mysql.getCategory(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);  //共有几页
        //调用初始页码HTML方法
        let page_html = pagging(page_num,page_count,'getcategory');
        res.render('admin/category_list',{data:list,page_html:page_html});
    })
})
app.get('/getcategory/:page',pageApi.getCategorys);
//添加分类
app.get('/add_category',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/add_category.html'));
    mysql.gettypes(function(list){
        res.render('admin/add_category',{data:list});
    })
});
app.get('/add_type',function(req,res){
    var data = JSON.parse(req.query.data);
    mysql.addtype(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//获取分类数据
app.get('/get_categorydata',function(req,res){
    var id = req.query.id;
    mysql.gettype(id,function(list){
        res.end(JSON.stringify(list));
    })
})
app.get('/getcg',function(req,res){
    var pid = req.query.pid;
    mysql.getctgy(pid,function(list){
        res.end(JSON.stringify(list));
    })
})
//修改分类
app.get('/edit_category',function(req,res){
    var data = JSON.parse(req.query.data);
    mysql.edittype(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//删除分类
app.get('/remove_category',function(req,res){
    var id = req.query.id;
    mysql.removetype(id,function(list){
        res.end(JSON.stringify(list));
    })
})
// 删除分类

/* end */

/* 地区管理 start */

// 省份列表路由
app.get('/provinces_list',function(req,res){
    // mysql.getProvinces(function(list){
    //     // console.log(JSON.stringify(list));
    //     // res.end(JSON.stringify(list));
    //     res.render('admin/provinces_list',{data:list});
    // })
    res.redirect('/provinces_list/1');
})

// 省份分页
app.get('/getprovince/:page',pageApi.getProvinces);

//省份类表初始显示数据
app.get('/provinces_list/:page',function(req,res){
    let page_num = req.params.page;  //获取页码
    let pro_page = 15;  //初始15条数据
    mysql.getProvinces(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);  //共有几页
        //调用初始页码HTML方法
        let page_html = pagging(page_num,page_count,'getprovince');
        res.render('admin/provinces_list',{data:list,page_html:page_html});
    })
})


// 城市列表路由
app.get('/city_list',function(req,res){
    res.redirect('/city_list/1');
})
app.get('/getcity/:page',pageApi.getCitys);
//城市列表表初始显示数据
app.get('/city_list/:page',function(req,res){
    let page_num = req.params.page;
    let pro_page = 15;
    mysql.getCity(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getcity');
        res.render('admin/city_list',{data:list,page_html:page_html});
    });
})

// 区域列表路由
app.get('/area_list',function(req,res){
    res.redirect('/area_list/1');
})
app.get('/area_list/:page',function(req,res){
    let page_num = req.params.page;
    let pro_page = 15;
    mysql.getArea(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getarea');
        res.render('admin/area_list',{data:list,page_html:page_html});
    });
})
app.get('/getarea/:page',pageApi.getAreas);

// 街道列表路由
app.get('/street_list',function(req,res){
    res.redirect('/street_list/1');
})
app.get('/street_list/:page',function(req,res){
    let page_num = req.params.page;
    let pro_page = 15;
    mysql.getStreet(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getstreet');
        res.render('admin/street_list',{data:list,page_html:page_html});
    });
})
app.get('/getstreet/:page',pageApi.getStreets);

/* end */

//系统用户管理
/* start */
app.get('/adminuser_list',function(req,res){
    mysql.getadminlist(function(list){
        res.render('admin/adminuser_list',{data:list})
    })
})

//添加系统用户
app.get('/add_adminuser',function(req,res){
    res.sendFile(path.join(app.get("views"),'admin/add_adminuser.html'));
})

app.get('/checkadminlogin',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/edit_users.html'));
    var name = req.query.name;
    mysql.getadminlistn(name,function(list){
        if(list.length == 0){
            res.end('1');
        }else{
            res.end('-1');
        }
    })
})

app.get('/add_adminusers',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/edit_users.html'));
    var data = JSON.parse(req.query.data);
    mysql.addAdminlist(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//编辑系统用户
app.get('/get_adminlist',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/edit_users.html'));
    var id = req.query.id;
    mysql.getadminlists(id,function(list){
        res.end(JSON.stringify(list));
    })
})
app.get('/edit_adminlist',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/edit_users.html'));
    var data = JSON.parse(req.query.data);
    mysql.editadminlist(data,function(list){
        res.end(JSON.stringify(list));
    })
})

//删除系统用户
app.get('/remove_adminlist',function(req,res){
    // res.sendFile(path.join(app.get("views"),'admin/edit_users.html'));
    var id = req.query.id;
    mysql.removeadminlist(id,function(list){
        res.end(JSON.stringify(list));
    })
})
/* end */

//404页面
app.get('*',function(req,res){
    res.sendFile(path.join(app.get('views'),'err.html'))
})
//开启监听端口
app.listen(app.get('port'),function(){
    console.log(' 服务器已启动 端口号为：'+app.get('port'));
})


//初始分页函数
function pagging(page_num,page_count,url){
    let page_html = '';
    let css = '';
    if(page_num > 1){
        page_html += '<li class="page-item"><a class="page-link" href="/'+url+'/'+(page_num*1-1)+'">上一页</a></li>'
    }
    page_html += '<li class="page-item"><a class="page-link active" href="/'+url+'/1">1</a></li>'
    if(page_count > 6){
        for(let i=2;i<=5;i++){
            css = css = (page_num == i)?'active' :'';
            page_html += '<li class="page-item"><a class="page-link '+css+'" href="/'+url+'/'+i+'">'+i+'</a></li>';
        }
        page_html += '<li class="page-item"><a class="page-link" href="javascript:void(0)">...</a></li>';
    }else{
        for(let i=2;i<=page_count;i++){
            css = css = (page_num == i)?'active' :'';
            page_html += '<li class="page-item"><a class="page-link '+css+'" href="/'+url+'/'+i+'">'+i+'</a></li>';
        }
    }
    // if(page_count > 2){
    //     page_html += '<li class="page-item"><a class="page-link" href="/'+url+'/'+page_count+'">'+page_count+'</a></li>'
    // }
    if(page_num < page_count){
        page_html += '<li class="page-item"><a class="page-link" href="/'+url+'/'+(page_num*1+1)+'">下一页</a></li>'
    }
    return page_html;
}
// //随机生成名字
// var Mock = require("mockjs");
// var Random = Mock.Random;
// console.log(Random.cname());
