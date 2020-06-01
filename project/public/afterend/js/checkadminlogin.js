// var url = document.referrer.split('/');
$(function(){
    $.ajax({
        type:'get',
        url:'/checkadminlogins',
        ansyc:false,
        success:function(data){
            if(data == 0){
                window.location = '/admin_login';
            }else{
                data = JSON.parse(data);
                // console.log(data);
                $('.admin-name').prev('img').hide();
                $('.admin-name').html(data.adname);
                localStorage.setItem('adname',data.adname);
                // window.location = '/'+url[url.length-1];
            }
        }
    })
})
