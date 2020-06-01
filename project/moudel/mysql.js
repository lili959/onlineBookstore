//加载模块
let mysql = require('mysql');  //加载数据库模块
require('colors');

//创建数据库连接
let con = mysql.createConnection({
    //数据库设置
    host:'127.0.0.1',  //服务器地址
    user:'root',  //用户名
    password:'root',// 密码
    port:'3306',  //默认端口
    database:'wssd'   //要连接的数据库名字
});

//进行连接
con.connect(function(err){
    if(err){
        console.log('  数据库连接失败'.red);
        return ;
    }
    console.log( '   数据库连接成功！'.green);
});

// let sql = 'select * from users';
// con.query(sql,function(err,result){
//     if(err){
//         console.log('  数据查询失败!!'.red);
//     }
//     console.log(result);
// });

//首页数据
exports.getdata = function(fun){
    let sql = 'select * from goods where state in(1,2) limit 0,10';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败！！！'.red);
            return;
        }
        exports.getcnxh(function(rows2){
            exports.getrmcp(function(rows3){
                exports.getbook(function(rows4){
                    exports.getysdw(function(rows5){
                        exports.getsets(function(rows6){
                            fun(rows,rows2,rows3,rows4,rows5,rows6);
                        })
                    })
                })
            })
            
        })
    })
}
//猜你喜欢
exports.getcnxh = function(fun){
    let sql = 'select * from goods where state in(1,2) limit 15,4';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败！！！'.red);
            return;
        }
        fun(rows);
    }) 
}
//热门产品
exports.getrmcp = function(fun){
    let sql = 'select * from goods where state in(1,2) limit 11,3';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败！！！'.red);
            return;
        }
        fun(rows);
    }) 
}
//书
exports.getbook = function(fun){
    let sql = 'select * from goods where state in(1,2) order by rand() limit 3';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败！！！'.green);
            return;
        }
        fun(rows);
    }) 
}
//有声读物
exports.getysdw = function(fun){
    let sql = 'select * from goods where typeid=22 and state in(1,2) limit 0,3';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败！！！'.red);
            return;
        }
        fun(rows);
    }) 
}
//少儿童书
exports.getsets = function(fun){
    let sql = 'select * from goods where typeid=21 and state in(1,2) limit 0,3';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败！！！'.red);
            return;
        }
        fun(rows);
    }) 
}


//登录数据对比
exports.getUserlogin = function(username,fun){
    let sql = 'select id,username,name,pass,state from users where state = 1 and username ='+username;
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败！！！'.red);
            return;
        }
        fun(rows);
    })
}



//注册用户
exports.getAdduser = function(post,fun){
    let sql = 'insert into users(username,name,pass,sex,state,addtime) values(?,?,?,?,?,?)';
    let parmas = [post.username,post.name,post.pass,post.sex,post.state,post.addtime];
    // arr.push(null);
    // for(key in post){
    //     arr.push(post[key]);
    // }
    con.query(sql,parmas,function(err,rows){
        if(err){
            console.log('数据添加失败！！！'.red);
            return;
        }
        let sql = 'select * from users where username = '+post.username;
        con.query(sql,function(err,result){
            if(err){
                console.log('数据查询失败！！！'.green);
                return;
            }
            fun(result);
            // console.log(result);
        })
    })
}

//修改用户信息
exports.updateUser = function(post,fun){
    let sql = 'update user set id="'+post.id+'",username="'+post.username+'",name="'+post.name+'",pass="'+post.pass+'",sex="'+post.sex+'",address="'+post.address+'",code="'+post.code+'",phone="'+post.phone+'",email="'+post.emain+'",state="'+post.state+'" where id='+post.id;
    con.query(sql,arr,function(err,rows){
        if(err){
            console.log('数据修改失败！！！');
            return;
        }
        // fun(rows);
        let sql = 'select * from users where id='+post.id;
        con.query(sql,function(err,date){
            if(err){
                console.log('  查询信息失败！！');
                return;
            }
            fun(date);
        });
    })
}

//删除用户
exports.removeUser = function(id,fun){
    let sql = 'update users set state=2 where id='+id;
    con.query(sql,function(err,date){
        if(err){
            console.log('信息修改失败！！');
            return;
        }
        let sql = 'select * from users where id='+post.id;
        con.query(sql,function(err,date){
            if(err){
                console.log('查询信息失败！！');
                return;
            }
            fun(date);
        });
    });
}

//添加书籍信息


//书籍详情
exports.Bookdetail = function(id,fun){
    let sql = 'select * from goods where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getzbtj(function(rows2){
            exports.gettjcp(function(rows3){
                fun(rows,rows2,rows3);
            })
        })
    });
}

//重磅推荐
exports.getzbtj = function(fun){
    let sql = 'select * from goods where state in(1,2) order by rand() limit 4';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    });
}
//推荐产品
exports.gettjcp = function(fun){
    let sql = 'select * from goods where state in(1,2) order by rand() limit 3';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    });
}

//获取省份表信息。
exports.getPro = function(fun){
    let sql = 'select * from bs_province';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })
}
//获取城市表信息。
exports.getcitys = function(code,fun){
    let sql = 'select * from bs_city where PROVINCE_CODE='+code;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败'.red);
            return ;
        }
        fun(rows);
    })
}
//获取区域表信息。
exports.getareas = function(code,fun){
    let sql = 'select * from bs_area where CITY_CODE='+code;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })
}
//获取街道表信息。
exports.getstreets = function(code,fun){
    let sql = 'select * from bs_street where AREA_CODE='+code;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })
}

//加入购物车
exports.getgwc = function(data,fun){
    // console.log(data);
    let sql = 'select * from gwc where bookname = "'+data.bookname+'" and user = "'+data.user+'"';
    // console.log(sql);
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        // console.log(rows);
        if(rows.length == 0){
            let sql = 'insert into gwc values(?,?,?,?,?,?,?,?)';
            var arr = ['',data.bookname,data.user,data.imgs,data.price,data.num,data.allprice,data.url];
            con.query(sql,arr,function(err,rowss){
                if(err){
                    console.log(' 数据添加失败');
                    return ;
                }
                fun(1);
            })
        }else{
            var num = (rows[0].num*1 + data.num*1);
            var price = (data.price*1).toFixed(2);
            var allprice = ((rows[0].num*1 + data.num*1) * price).toFixed(2);
            let sql = 'update gwc set num='+num+' , allprice = '+ allprice +' where  bookname = "'+data.bookname+'" and user = "'+data.user+'"';
            // console.log(sql);
            con.query(sql,function(errs,rowss){
                if(errs){
                    console.log(' 数据修改失败');
                    return ;
                }
                fun(1);
            })
        }
    })
   
}

//获取购物车信息
exports.getcart = function(user,fun){
    let sql = 'select * from gwc where user = "'+user+'" order by id desc';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败');
            return;
        }
        fun(rows);
    })
}

//更改购物车信息
exports.updategwc = function(book,fun){
    let sql = 'update gwc set num ='+book.num+',allprice ='+book.allprice+' where id='+book.id;
    // console.log(sql);
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据修改失败');
            return;
        }
        fun(rows);
    })
}

//删除购物车信息
exports.delgwc = function(id,fun){
    let sql = 'delete from gwc where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据删除失败');
            return;
        }
        fun(rows);
    })
}

//填写订单
exports.getorderDate = function(data,fun){
    // var gwc_id = data.gwc_id;
    // console.log(data);
    let sql = 'select * from gwc where id in('+data.gwc_id+')';
    // console.log(sql);
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败');
            return;
        }
        fun(rows);
    })
}

//新增收货地址
exports.addconsignee = function(data,fun){
    let sql = 'insert into consignee values(?,?,?,?,?,?,?,?)';
    var arr = [null,data.user_id,data.cgn_name,data.cgn_province,data.cgn_city,data.cgn_area,data.cgn_detail,data.cgn_tel];
    con.query(sql,arr,function(err,rows){
        if(err){
            console.log('数据添加失败');
            return;
        }
        let sql1 = 'select * from consignee where user_id='+data.user_id;
        con.query(sql1,function(err,result){
            if(err){
                console.log('数据查询失败');
                return;
            }
            if(result.length == 1){
                fun(result[0]);
            }else{
                fun(result[result.length-1]);
            }
        })
    })
}

//获取收货人地址数据
exports.getconsignee = function(user_id,fun){
    let sql1 = 'select * from consignee where user_id='+user_id;
    con.query(sql1,function(err,result){
        if(err){
            console.log('数据查询失败');
            return;
        }
        fun(result);
    })
}
//获取收货人地址数据
exports.getconsignees = function(cgn_id,fun){
    let sql1 = 'select * from consignee where cgn_id='+cgn_id;
    con.query(sql1,function(err,result){
        if(err){
            console.log('数据查询失败');
            return;
        }
        fun(result);
        // console.log(result);
        // exports.getPros(result[0].cgn_province);
    })
}

//修改收货人地址
exports.updateconsignee = function(data,fun){
    let sql = 'update consignee set cgn_name="'+data.cgn_name+'",cgn_tel="'+data.cgn_tel+'",cgn_province="'+data.cgn_province+'",cgn_city="'+data.cgn_city+'",cgn_area="'+data.cgn_area+'",cgn_detail="'+data.cgn_detail+'" where cgn_id='+data.cgn_id;
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据修改失败');
            return;
        }
        let sql1 = 'select * from consignee where cgn_id='+data.cgn_id;
        con.query(sql1,function(err,result){
            if(err){
                console.log('数据查询失败');
                return;
            }
            fun(result);
        })
    })
}
//删除收货人地址
exports.removeconsignee = function(cgn_id,fun){
    let sql1 = 'delete from consignee where cgn_id='+cgn_id;
    con.query(sql1,function(err,result){
        if(err){
            console.log('数据删除失败');
            return;
        }
        fun(result);
    })
}

//添加订单
exports.confirmOrder = function(data,user,fun){
    let sql = 'insert into orders values(?,?,?,?,?,?,?,?,?,?,?)';
    var arr = [null,data.uid,data.order_number,data.order_pay,data.cgn_id,data.total,data.status,data.addtime,data.cgn_name,data.cgn_tel,data.cgn_address];
    con.query(sql,arr,function(err,rows){
        if(err){
            console.log('数据添加失败');
            return;
        }
        exports.getorders(data.order_number,function(list){
            //写入订单详情表
            // console.log(list);
            fun(list);
            exports.getdetail(list[0].id,data.gwc_id,function(list2){
            })
        })
    })
}
//获取订单数据
exports.getorders = function(order_number,fun){
    let sql = 'select * from orders where order_number='+order_number;
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败');
            return;
        }
        fun(rows);
    })
}
//添加订单详情表数据
exports.getdetail = function(orderid,gwc_id,fun){
    let sql = 'select * from gwc where id in('+gwc_id+')';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败');
            return;
        }
        for(var i=0;i<rows.length;i++){
            let sql1 = 'insert into detail values(null,'+orderid+','+rows[i].url+','+rows[i].price+','+rows[i].num+','+rows[i].allprice+')';
            con.query(sql1,function(err,rows){
                if(err){
                    console.log('数据添加失败');
                    return;
                }
            })
        }
        //删除购物车
        exports.deletegwc(gwc_id,function(){
           fun('0');
        })
    })
}
//删除购物车
exports.deletegwc = function(gwc_id){
    let sql = 'delete from gwc where id in('+gwc_id+')';
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据删除失败');
            return;
        }
    })
}

//获取订单页面的数据
exports.getordersdata = function(uid,fun){
    var arr = [];
    let sql = 'select * from orders left join consignee  on orders.cgn_id = consignee.cgn_id where orders.uid='+uid+' and consignee.user_id='+uid;
    // console.log(sql);
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据查询失败');
            return;
        }
        var code = 0;
        if(rows.length == 0){
            fun(arr);
        }
        for(var i=0;i<rows.length;i++){
            exports.getdatas(rows[i],function(list){
                arr.push(list);
                code = code + 1;
                if(code == rows.length){
                    fun(arr.reverse());
                }
            })
        }
    })
}
//获取订单图片数据
exports.getdatas = function(that,fun){
    let sql1 = 'select bookid from detail where orderid='+that.id;
    con.query(sql1,function(err,rows2){
        if(err){
            console.log('数据查询失败');
            return;
        }
        if(rows2.length == 1){
            let sql2 = 'select picname from goods where id='+rows2[0].bookid;
            con.query(sql2,function(err,rows3){
                if(err){
                    console.log('数据查询失败');
                    return;
                }
                that.picname = rows3[0].picname.split(',')[0];
                // console.log(that)
                fun(that);
            })
        }else{
            var str = '';
            for(var i=0;i<rows2.length;i++){
                str = str+rows2[i].bookid;
                if(i < rows2.length-1){
                    str = str+ ',';
                }
            }
            let sql3 = 'select picname from goods where id in('+str+')';
            con.query(sql3,function(err,rows4){
                if(err){
                    console.log('数据查询失败');
                    return;
                }

                var str1 = '';
                for(var i= 0;i<rows4.length;i++){
                    str1 = str1+rows4[i].picname.split(',')[0];
                    if(i < rows4.length-1){
                        str1 = str1+ ',';
                    }
                }
                that.picname = str1;
                fun(that)
            })
            
        }
    })
}
//修改订单表状态
exports.updateordersdata = function(order_number,fun){
    let sql = 'update orders set status=2 where order_number='+order_number;
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据修改失败');
            return;
        }
        fun(rows);
    })
}
//修改订单表状态
exports.updateordersdatas = function(order_number,fun){
    let sql = 'update orders set status=2 where order_number='+order_number;
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据修改失败');
            return;
        }
        fun(rows);
    })
}
exports.cancalordersdata = function(order_number,fun){
    let sql = 'update orders set status=0 where order_number='+order_number;
    con.query(sql,function(err,rows){
        if(err){
            console.log('数据修改失败');
            return;
        }
        fun(rows);
    })
}

//搜索页面路由
exports.getbookdata = function(input,fun){
    let sql = 'select * from goods where book like "%'+input+'%" and state in (1,2)';
    // console.log(sql);
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getzbtj(function(rows2){
            exports.gettjcp(function(rows3){
                exports.getcounts(input,function(count){
                    fun(rows,rows2,rows3,count);
                })
            })
        })
    });
}

exports.getcounts = function(key,fun){
    let sql = 'select count(*) count from goods where book like "%'+key+'%" and state in(1,2)';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        // console.log(rows[0])
        fun(rows[0].count);
    })
}



/* 后端页面 */

//后台登录
exports.getadminuser = function(name,fun){
    let sql = 'select * from adminlist where name="'+name+'"';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })

}


//用户管理
exports.getUser = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from users limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('users',function(count){
            fun(rows,count);
        })
    });
}
//后台获取用户数据
exports.getUsers = function(id,fun){
    let sql = 'select * from users where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败'.red);
            return ;
        }
        fun(rows);
    })
}

//管理员修改用户信息
exports.editUser = function(data,fun){
    let sql = 'update users set name="'+data.name+'",pass="'+data.pass+'",sex="'+data.sex+'",state="'+data.state+'" where id='+data.id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据修改失败');
            return ;
        }
        exports.getUsers(data.id,function(list){
            fun(list);
        })
    })
}

//管理员删除用户信息
exports.removeUsers = function(id,fun){
    let sql = 'update users set state=0 where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据修改失败');
            return ;
        }
        exports.getUsers(id,function(list){
            fun(list);
        })
    })
}


//订单管理
exports.getOrder = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from orders limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('orders',function(count){
            fun(rows,count);
        })
    });
}
//获取订单数据
exports.getod = function(id,fun){
    let sql = 'select * from orders where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    });
}

//后台修改订单数据
exports.editOrder = function(data,fun){
    let sql = 'update orders set cgn_name="'+data.cgn_name+'",cgn_tel="'+data.cgn_tel+'",cgn_address="'+data.cgn_address+'",order_pay="'+data.order_pay+'",total="'+data.total+'",status="'+data.status+'" where id='+data.id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getod(data.id,function(list){
            fun(list);
        })
    });
}
//后台删除订单数据
exports.removeod = function(id,fun){
    let sql = 'update orders set status=0 where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getod(id,function(list){
            fun(list);
        })
    });
}


//订单详情表
exports.getDetail = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from detail limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('detail',function(count){
            fun(rows,count);
        })
    });
}

//收货人地址表
exports.getConsignee = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from consignee limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('consignee',function(count){
            fun(rows,count);
        })
    });
}

//购物车存放表
exports.getGwc = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from gwc limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('gwc',function(count){
            fun(rows,count);
        })
    });
}



//图书管理
exports.getBook = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from goods order by id desc limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('goods',function(count){
            fun(rows,count);
        })
    });
}

//获取图书数据
exports.getbookid = function(id,fun){
    let str = '';
    let arr = [];
    let sql = 'select * from goods where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.gettype(rows[0].typeid,function(list){
            arr  = list[0].path.split(',');
            if(arr.length <= 2){
                rows[0].typeid = list[0].name + ',';
                exports.gettypes(function(list3){
                    fun(rows,list3);
                })
            }else{
                arr.pop();
                arr.shift();
                arr.reverse();
                rows[0].typeid = list[0].name + ',';
                let code = 0;
                for(var i=0;i<arr.length;i++){
                    exports.gettype(arr[i],function(result){
                        rows[0].typeid = rows[0].typeid + result[0].name + ','; 
                        code = code + 1;
                        if(code == arr.length){
                            exports.gettypes(function(list3){
                                // console.log(rows,list3);
                                fun(rows,list3);
                            })
                        }
                    })
                }
            }
        })
    });
}

//添加图书
exports.addbook = function(data,fun){
    let sql = 'insert into goods values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let arr = [null,data.picname,data.typeid,data.book,data.descr,data.press,data.author,data.publicationtime,data.number,data.isbn,data.oldprice,data.price,data.state,data.store,data.addtime];
    con.query(sql,arr,function(err,rows){
        if(err){
            console.log(' 数据添加失败');
            return ;
        }
        fun(rows);
    })
}

//修改图书
exports.editbook = function(data,fun){
    let sql = 'update goods set picname="'+data.picname+'",typeid="'+data.typeid+'",book="'+data.book+'",press="'+data.press+'",descr="'+data.descr+'",author="'+data.author+'",publicationtime="'+data.publicationtime+'",numbers="'+data.number+'",isbn="'+data.isbn+'",oldprice="'+data.oldprice+'",price="'+data.price+'",state="'+data.state+'",store="'+data.store+'" where id='+data.id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据修改失败');
            return ;
        }
        fun(rows);
    })
}

//删除图书数据
exports.deletebook = function(id,fun){
    let sql = 'update goods set state=3 where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据删除失败');
            return ;
        }
        fun(rows);
    });
}

//搜索图书
exports.booksearch = function(keys,fun){
    let sql = 'select * from goods where concat(id,book,author) like "%'+keys+'%"';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })
}

//分类管理
exports.getCategory = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from type limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('type',function(count){
            fun(rows,count);
        })
    });
}
//获取顶级分类数据
exports.gettypes = function(fun){
    let sql = 'select * from  type where pid=0';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })
}
//后台获取二级分类数据
exports.getctgy = function(pid,fun){
    let sql = 'select * from type where pid='+pid;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })
}

//后台添加分类
exports.addtype = function(data,fun){
    let sql = 'insert into type values(?,?,?,?)';
    let arr = [null,data.name,data.pid,data.path];
    con.query(sql,arr,function(err,rows){
        if(err){
            console.log(' 数据添加失败');
            return ;
        }
        fun(rows);
    })
}

//后台获取分类数据
exports.gettype = function(id,fun){
    let sql = 'select * from type where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    });
}

//后台编辑分类
exports.edittype = function(data,fun){
    let sql = 'update type set name="'+data.name+'",pid='+data.pid+',path="'+data.path+'" where id='+data.id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据修改失败');
            return ;
        }
        exports.gettype(data.id,function(list){
            fun(list);
        })
    });
}

//删除分类
exports.removetype = function(id,fun){
    let sql = 'delete from type where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据删除失败');
            return ;
        }
        fun(rows);
    });
}

// 获取省份列表数据
exports.getProvinces = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from bs_province limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('bs_province',function(count){
            fun(rows,count);
        })
    });
}

//获取表的总条数
exports.getCount = function(table,fun){
    let sql = 'select count(*) count from '+table;
    con.query(sql,function(err,result){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(result[0].count);
    })
}


//获取城市
exports.getCity = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from bs_city limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('bs_city',function(count){
            fun(rows,count);
        })
    })
}

//获取区域
exports.getArea = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from bs_area limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('bs_area',function(count){
            fun(rows,count);
        })
    })
}

//获取街道
exports.getStreet = function(page_num,pro_page,fun){
    let offset = (page_num*1-1) * pro_page;
    let sql = 'select * from bs_street limit '+offset+','+pro_page;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        exports.getCount('bs_street',function(count){
            fun(rows,count);
        })
    })
}

//获取系统用户表数据
exports.getadminlist = function(fun){
    let sql = 'select * from adminlist';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })
}

exports.getadminlistn = function(name,fun){
    let sql = 'select * from adminlist where name="'+name+'"';
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败');
            return ;
        }
        fun(rows);
    })
}
//添加管理员用户
exports.addAdminlist = function(data,fun){
    let sql = 'insert into adminlist values(?,?,?,?)';
    var arr = [null,data.name,data.adname,data.pass];
    con.query(sql,arr,function(err,rows){
        if(err){
            console.log(' 数据添加失败');
            return ;
        }
        fun(rows);
    })
}


//获取管理员用户数据
exports.getadminlists = function(id,fun){
    let sql = 'select * from adminlist where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据查询失败'.red);
            return ;
        }
        fun(rows);
    })
}

//修改管理员用户信息
exports.editadminlist = function(data,fun){
    let sql = 'update adminlist set name="'+data.name+'",pass="'+data.pass+'",adname="'+data.adname+'" where id='+data.id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据修改失败');
            return ;
        }
        exports.getadminlists(data.id,function(list){
            fun(list);
        })
    })
}

//删除管理员用户
exports.removeadminlist = function(id,fun){
    let sql = 'delete from adminlist where id='+id;
    con.query(sql,function(err,rows){
        if(err){
            console.log(' 数据修改失败');
            return ;
        }
        fun(rows);
    })
}
