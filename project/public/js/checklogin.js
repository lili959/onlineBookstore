$(function(){
    $.ajax({
        type:'get',
        url:'/checksLogin',
        success:function(data){
            // console.log(data);
            if(data == '0'){
                window.location = '/login'
            }else{
                $('#user_names').prev().hide();
                $('#user_names').css({display:'inline-block'});
                $('#user_names').children().eq(0).html(data);
                $('#user_names').children().eq(1).click(function(){
                    // console.log(1);
                    $.ajax({
                        type:'get',
                        url:'/loginout',
                        success:function(data){
                            if(data == 0){
                                window.location = '/login';
                            }
                        }
                    })
                    return false;
                })
            }
        }
    })
})