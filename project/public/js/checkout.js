$(function(){
    $.ajax({
        type:'get',
        url:'/address_data',
        dataType:'json',
        success:function(data){
            if(data.length !=0){
                $('.dd_ullist').css({height:'114px'})
            }
            for(var i=0;i<data.length;i++){
                $li = $('<li class="dd_liactive" data-id="'+data[i].cgn_id+'"></li>');
                $div1 = $('<div class="ddli_title"></div>');
                $span1 = $('<span class="ddli_title_name">'+data[i].cgn_name+'</span>');
                $span2 = $('<span class="ddli_title_tel">'+data[i].cgn_tel+'</span>');
                $div2 = $('<div class=ddli_address></div>');
                $p1 = $('<p>'+ data[i].cgn_province+ data[i].cgn_city+ data[i].cgn_area+'</p>');
                $p2 = $('<p>'+ data[i].cgn_detail+'</p>');
                $div3 = $('<div class="ddli_operation"></div>');
                $span3 = $('<span class="edit_address">编辑</span>');
                $span4 = $('<span class="remove_address">删除</span>');
                addressHTML();
                $('.dd_ullist').children().eq(0).addClass('ddli_active');
                arclick();
            }
        }
    });
    //点击选择收货地址
    function arclick(){
        $('.dd_ullist>li').click(function(){
            // console.log(111)
            $(this).addClass('ddli_active').siblings().removeClass('ddli_active');
        })
    }
    //三级联动
    getprovince('#province','#city','#area');
    
    $('#province').on('change',function(){
        // console.log($(this).val());
        getcity($(this).val(),'#city','#area');
    })
    $('#city').on('change',function(){
        // console.log($(this).val());
        getarea($(this).val(),'#area');
    })
    $('#province_1').on('change',function(){
        // console.log($(this).val());
        getcity($(this).val(),'#city_1','#area_1');
    })
    $('#city_1').on('change',function(){
        // console.log($(this).val());
        getarea($(this).val(),'#area_1');
    })

    //确认订单
    $('.tjbtn').click(function(){
        if($('.dd_ullist').children().length !=0 ){
            $('#mymoda2').modal('show');
            var data = {};
            data.order_number = new Date().getTime();
            data.addtime  = new Date().toLocaleString();
            data.order_pay = $('.curren').html();
            data.total = $('.total').html();
            data.cgn_id = $('.ddli_active').attr('data-id');
            data.status = '1';
            data.cgn_name = $('.ddli_active').children().eq(0).children().eq(0).html();
            data.cgn_tel = $('.ddli_active').children().eq(0).children().eq(1).html();
            data.cgn_address = $('.ddli_active').children().eq(1).children().eq(0).html()+$('.ddli_active').children().eq(1).children().eq(1).html();
            var length = $('.gwc_content>tr').length;
            if(length == 1){
                data.gwc_id = $('.gwc_content').children().attr('data-id');
            }else{
                var str = '';
                $('.gwc_content>tr').each(function(i){
                    str+=$(this).attr('data-id');
                    if(i<length-1){
                        str = str+',';
                    }
                })
                data.gwc_id = str;
            }
            // console.log(data);
            $.ajax({
                type:'get',
                url:'/confirm_order',   
                data:'data='+JSON.stringify(data),
                dataType:'json',
                success:function(result){
                    // console.log(result);
                    $('.confirm_pay').click(function(){
                        $.ajax({
                            type:'get',
                            url:'/update_order',
                            data:'order_number='+JSON.stringify(result[0].order_number),
                            dataType:'json',
                            success:function(results){
                                if(results == 1){
                                    alert('支付成功!!!!')
                                    window.location = '/orders';
                                }
                            }
                        })
                    })
                    $('.cancal').click(function(){
                        window.location = '/orders';
                    })
                }
            })
        }else{
            alert('请添加收货地址');
        }
    })
    //新增收货地址
    $('.add_quren').click(function(){
        var address = {};
        address.cgn_name = $('.cgn_name').val();
        address.cgn_tel = $('.cgn_tel').val();
        address.cgn_province = $('#province :selected').html();
        address.cgn_city = $('#city :selected').html();
        address.cgn_area = $('#area :selected').html();
        address.cgn_detail = $('.cgn_detail').val();
        // console.log(address);
        $.ajax({
            type:'get',
            url:'/add_address',
            data:'address='+JSON.stringify(address),
            dataType:'json',
            success:function(data){
                // console.log(data);
                $li = $('<li class="" data-id="'+data.cgn_id+'"></li>');
                $div1 = $('<div class="ddli_title"></div>');
                $span1 = $('<span class="ddli_title_name">'+data.cgn_name+'</span>');
                $span2 = $('<span class="ddli_title_tel">'+data.cgn_tel+'</span>');
                $div2 = $('<div class=ddli_address></div>');
                $p1 = $('<p>'+data.cgn_province+data.cgn_city+data.cgn_area+'</p>');
                $p2 = $('<p>'+data.cgn_detail+'</p>');
                $div3 = $('<div class="ddli_operation"></div>');
                $span3 = $('<span class="edit_address">编辑</span>');
                $span4 = $('<span class="remove_address">删除</span>');
                addressHTML();
                $('.dd_ullist').children().eq(0).addClass('ddli_active');
                $('#exampleModalCenter').modal('hide');
                arclick();
            }
        })
    })
    //获取省份
    function getprovince(getid,getid1,getid2){	
        $.ajax({
            type:'get',
            url:'/province',
            // async:false,
            success:function(result){
                // console.log(result);
                // callback(result);
                for(var i = 0;i<result.length;i++){
                    var $option = $('<option value='+result[i].PROVINCE_CODE+'>'+result[i].PROVINCE_NAME+'</options>');
                    $(getid).append($option);
                }
                getcity($(getid).children().eq(0).attr('value'),getid1,getid2);
            },
            
        });
    }
    //收货地址
    function addressHTML(){
        $div1.append($span1);
        $div1.append($span2);
        $div2.append($p1);
        $div2.append($p2);
        $div3.append($span3);
        $div3.append($span4);
        $li.append($div1);
        $li.append($div2);
        $li.append($div3);
        $li.on('mouseover',function(){
            $(this).children().eq(2).show();
        })
        $li.on('mouseout',function(){
            $(this).children().eq(2).hide();
        })
        //修改收货地址
        $span3.on('click',function(){
            getprovince('#province_1','#city_1','#area_1');
            var cgn_id = $(this).parent().parent().attr('data-id');
            // console.log(cgn_id)
            var that = $(this);
            $.ajax({
                type:'get',
                url:'/update_address',
                data:'cgn_id='+cgn_id,
                dataType:'json',
                success:function(data){
                    $('#mymodal').modal('show');
                    // console.log(data)
                    $('.cgn_name1').val(data[0].cgn_name);
                    $('.cgn_tel1').val(data[0].cgn_tel);
                    // console.log(data[0])
                    $('.cgn_detail1').val(data[0].cgn_detail);
                    $('#province_1').children().each(function(){
                        if($(this).html() == data[0].cgn_province){
                            $(this).attr('selected','selected');
                            getcity($(this).val(),'#city_1','#area_1');
                        }
                    })
                    $('#city_1').children().each(function(){
                        if($(this).html() == data[0].cgn_city){
                            $(this).attr('selected','selected');
                            getarea($(this).val(),'#area_1');
                        }
                    })
                    $('#area_1').children().each(function(){
                        if($(this).html() == data[0].cgn_area){
                            $(this).attr('selected','selected');
                        }
                    })
                    
                }
                
            })
                //保存修改
            $('.save_btn').click(function(){
                var address = {};
                address.cgn_id = cgn_id;
                address.cgn_name = $('.cgn_name1').val();
                address.cgn_tel = $('.cgn_tel1').val();
                address.cgn_province = $('#province_1 :selected').html();
                address.cgn_city = $('#city_1 :selected').html();
                address.cgn_area = $('#area_1 :selected').html();
                address.cgn_detail = $('.cgn_detail1').val();
                $.ajax({
                    type:'get',
                    url:'/updates_address',
                    data:'address='+JSON.stringify(address),
                    dataType:'json',
                    success:function(data){
                        // console.log(data);
                        var thats =  that.parent().parent().children();
                        // console.log(thats)
                        thats.eq(0).children().eq(0).html(data[0].cgn_name);
                        thats.eq(0).children().eq(1).html(data[0].cgn_tel);
                        thats.eq(1).children().eq(0).html(data[0].cgn_province+data[0].cgn_city+data[0].cgn_area);
                        thats.eq(1).children().eq(1).html(data[0].cgn_detail);
                        $('#mymodal').modal('hide');
                    }
                })
            })
        })
        //删除收货地址
        $span4.on('click',function(){
            var cgn_id = $(this).parent().parent().attr('data-id');
            var that = $(this);
            $.ajax({
                type:'get',
                url:'/remove_address',
                data:'cgn_id='+cgn_id,
                dataType:'json',
                success:function(data){
                    if(data){
                        that.parent().parent().remove();
                    }
                }
            })
        })
        $('.dd_ullist').append($li);
    }
    //获取城市
    function getcity(code,getid1,getid2){	
        // console.log(code);
        $.ajax({
            type:'get',
            url:'/city',
            async:false,
            data:'code='+code,
            success:function(result){
                // console.log(result);
                $(getid1).children().remove();
                for(var i = 0;i<result.length;i++){
                    var $option = $('<option value='+result[i].CITY_CODE+'>'+result[i].CITY_NAME+'</options>');
                    $(getid1).append($option);
                }
                getarea($(getid1).children().eq(0).attr('value'),getid2);
            },
            
        });
    }
    //获取区域
    function getarea(code,getid2){	
        $.ajax({
            type:'get',
            url:'/area',
            async:false,
            data:'code='+code,
            success:function(result){
                // console.log(result);
                // callback(result);
                $(getid2).children().remove();
                for(var i = 0;i<result.length;i++){
                    var $option = $('<option value='+result[i].AREA_CODE+'>'+result[i].AREA_NAME+'</options>');
                    $(getid2).append($option);
                }
                getstreet($(getid2).children().eq(0).attr('value'));
            },
            
        });
    }
    //获取街道
    function getstreet(code){	
        $.ajax({
            type:'get',
            url:'/street',
            // async:false,
            data:'code='+code,
            success:function(result){
                // console.log(result);
                // callback(result);
                for(var i = 0;i<result.length;i++){
                    var $option = $('<option value='+result[i].STREET_CODE+'>'+result[i].STREET_NAME+'</options>');
                    $('#street').append($option);
                }	
            },
            
        });
    }
})