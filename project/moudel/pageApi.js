let sql = require('./mysql');


//用户分页点击
exports.getUsers = function(req,res){
    let page_num = req.params.page;
    // console.log(page_num);
    let pro_page = 15;
    sql.getUser(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
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
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}

//订单分页
exports.getOrders = function(req,res){
    let page_num = req.params.page;
    // console.log(page_num);
    let pro_page = 15;
    sql.getOrder(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getorders');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}
//订单详情分页
exports.getdetail = function(req,res){
    let page_num = req.params.page;
    // console.log(page_num);
    let pro_page = 15;
    sql.getDetail(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getdetail');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}
//收货人地址分页
exports.getcgn = function(req,res){
    let page_num = req.params.page;
    // console.log(page_num);
    let pro_page = 15;
    sql.getConsignee(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getcgn');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}
//购物车存放分页
exports.getgwc = function(req,res){
    let page_num = req.params.page;
    // console.log(page_num);
    let pro_page = 15;
    sql.getGwc(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getgwc');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}

//图书分页
exports.getBooks = function(req,res){
    let page_num = req.params.page;
    // console.log(page_num);
    let pro_page = 15;
    sql.getBook(page_num,pro_page,function(list,count){
        for(var i=0;i<list.length;i++){
            if(list[i].state == 1){
                list[i].state = '新添加';
            }else if(list[i].state == 2){
                list[i].state = '在售';
            }else if(list[i].state == 3){
                list[i].state = '下架';
            }
        }
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getbook');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}

//分类分页
exports.getCategorys = function(req,res){
    let page_num = req.params.page;
    // console.log(page_num);
    let pro_page = 15;
    sql.getCategory(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getcategory');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}

//省份分页点击
exports.getProvinces = function(req,res){
    let page_num = req.params.page;
    // console.log(page_num);
    let pro_page = 15;
    sql.getProvinces(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getprovince');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}

//城市分页点击
exports.getCitys = function(req,res){
    let page_num = req.params.page;
    let pro_page = 15;
    sql.getCity(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getcity');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}

//区域分页点击
exports.getAreas = function(req,res){
    let page_num = req.params.page;
    let pro_page = 15;
    sql.getArea(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getarea');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}

//街道分页点击
exports.getStreets = function(req,res){
    let page_num = req.params.page;
    let pro_page = 15;
    sql.getStreet(page_num,pro_page,function(list,count){
        let page_count = Math.ceil(count/pro_page);
        let page_html = pagging(page_num,page_count,'getstreet');
        let json = {list:list,page_html:page_html};
        // console.log(json);
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(json));
    }) 
}


//HTML页数生成
function pagging(page_num,page_count,url){
    let page_html = '';
    let css = '';
    if(page_num > 1){
        page_html += '<li class="page-item"><a class="page-link" href="/'+url+'/'+(page_num*1-1)+'">上一页</a></li>';
    }
    if(page_num == 1){
        page_html += '<li class="page-item"><a class="page-link active" href="/'+url+'/1">1</a></li>';
    }else{
        page_html += '<li class="page-item"><a class="page-link" href="/'+url+'/1">1</a></li>';
    }
    if(page_count > 8){
        if(page_num > 4 && page_num <(page_count*1-3)){
            page_html += '<li class="page-item"><a class="page-link" href="javascript:void(0)">...</a></li>';
            for(let i=(page_num*1-2);i<(page_num*1+3);i++){
                css = (page_num == i)?'active' :'';
                page_html += '<li class="page-item"><a class="page-link '+css+'" href="/'+url+'/'+i+'">'+i+'</a></li>';
            }
            page_html += '<li class="page-item"><a class="page-link" href="javascript:void(0)">...</a></li>';
        }else if(page_num*1 >= (page_count*1 - 3) && page_num <= page_count *1){
            page_html += '<li class="page-item"><a class="page-link" href="javascript:void(0)">...</a></li>';
            for(let i=(page_count*1 - 5);i<page_count*1;i++){
                css = css = (page_num == i)?'active' :'';
                page_html += '<li class="page-item"><a class="page-link '+css+'" href="/'+url+'/'+i+'">'+i+'</a></li>';
            }
        }else{
            for(let i=2;i<=5;i++){
                css = css = (page_num == i)?'active' :'';
                page_html += '<li class="page-item"><a class="page-link '+css+'" href="/'+url+'/'+i+'">'+i+'</a></li>';
            }
            page_html += '<li class="page-item"><a class="page-link" href="javascript:void(0)">...</a></li>';
        }
        
    }else{
        for(let i=2;i<page_count;i++){
            css = css = (page_num == i)?'active' :'';
            page_html += '<li class="page-item"><a class="page-link '+css+'" href="/'+url+'/'+i+'">'+i+'</a></li>';
        }
    }
    if(page_count > 1){
        if(page_num == page_count){
            page_html += '<li class="page-item"><a class="page-link active" href="/'+url+'/'+page_count+'">'+page_count+'</a></li>';
        }else{
            page_html += '<li class="page-item"><a class="page-link" href="/'+url+'/'+page_count+'">'+page_count+'</a></li>';
        }
    }
    if(page_num < page_count){
        page_html += '<li class="page-item"><a class="page-link" href="/'+url+'/'+(page_num*1+1)+'">下一页</a></li>'
    }

    return page_html;
}


