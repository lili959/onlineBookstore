$(function(){
    $('.dd_nav').on("click","li",function(){
        $(this).addClass("dd_nav_active").siblings().removeClass("dd_nav_active");
    });
    var outTradeNo="";  //订单号
    for(var i=0;i<5;i++) //5位随机数，用以加在时间戳后面。
    {
        outTradeNo += Math.floor(Math.random()*10);
    }
    outTradeNo = new Date().getTime() + outTradeNo;  //时间戳，用来生成订单号
    // console.log(outTradeNo);
});