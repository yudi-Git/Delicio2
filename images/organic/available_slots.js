if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}
$(document).on('click', function (e) {

  if(!$(e.target).closest('.area_list').length && $('.autocomplete_timeslot').length ) {
    $('.autocomplete_timeslot').css({display:'none'});
  }else{
    $('.autocomplete_timeslot').css({display:''});
  }

  if(!$(e.target).closest('.timeslot').length && !$(e.target).closest('.main_homeslot').length && !$(e.target).closest('.timeslot #display_slots').length && !$(e.target).closest('.autocomplete_timeslot').length && !$(e.target).closest('#display_slots').length && !$(e.target).closest('.area_results .area_showing').length && !$(e.target).closest('.area_href').length) {
    $("#display_slots").css({display:'none'});
    first_click_timeslot = false; //to disable controller req on toggleup
  }

});

/*Timeslot JS*/
var first_click_timeslot = false; //to disable controller req on toggleup
$("#timeslot").click(function(){
jQuery.support.cors = true;
 $(".display_slots").toggle();
 if (first_click_timeslot == false) {
        $('.display_slots').html('<div class="loadergif"><img src="'+images_path+'/load.gif" /></div>');

        $.ajax({
        url     : base_url+"user/homeslot",        
        cache: false,
        success:function(result){
          /*$(".display_slots").show();*/
         $('.display_slots').html(result);
        },
        complete: function(){
            timeslot();
        }
        });
        first_click_timeslot = true;
        return;
    }
    //first_click_timeslot = false;
}); // END timeslot click.

$(".needhelp").click(function(){ //toggleup timeslot
 $(".display_slots").hide();
 first_click_timeslot = false;
});

//area click for timeslot
$('body').on('click', 'a.area_href', function(e) {
 
  if(e.which === 1) {
  var area_id = $(this).attr('rel');
  var area_name = $(this).attr('rev');
  $('.area_list').val(area_name);
  $('.area_id').val(area_id);

  var area = $(".area_list").val();
    var areaid = $(".area_id").val();
  $('#display_slots').html('<div class="loadergif"><img src="'+images_path+'/load.gif" /></div>');
    $.ajax({
      type  : "POST",
        url   : base_url+"user/homeslot",
        data  : "areaid="+areaid+"&area="+area,
        cache: false,
      success:function(result){
      $("#display_slots").html(result);
        },
        complete: function(){
            timeslot();
        }
});
  }
});//end

function timeslot() {

    var load; //load javascript onnly once
    $(".area_results").click(function(){
    var inputArea = $( ".area_showing" ).text();
    $( ".area_results" ).replaceWith( "<div class='area_li' style='relative'><input type='text' maxlength='20' size='22' name='area' class='area_lis area_list' value='"+inputArea+"' onkeyup='re_enter_area(event)' placeholder='Start typing to load areas' autocomplete='off'><input type='hidden' name='area_id' class='area_id' value=''></div><ul id='timeslote_auto2' class='populate'></ul>");
    $(".populate").css('display','none');
   });


    $(".ul-selected a").trigger('click'); 
        var $liSelected = $('#liarea');
        var $ulSelected = $('#timeslote_auto');

    $(".display_slots").keydown(function(e) {
  // Make sure we have a ul selected
        if($ulSelected) { 
        if(e.which === 40) {  

            if($liSelected) {
                $liSelected.removeClass('ul-selected');
                var $next = $liSelected.next();
                if($next.length) {
                    $liSelected = $next.addClass('ul-selected');
                }
                else {
                    $liSelected = $ulSelected.children('li').first().addClass('ul-selected');  
                }
            }
            else {
                $liSelected = $ulSelected.children('li').first().addClass('ul-selected');            
            }

        }else if(e.which === 38) {            
           if($liSelected) {
                $liSelected.removeClass('ul-selected');
                var $prev = $liSelected.prev();
                if($prev.length) {
                    $liSelected = $prev.addClass('ul-selected');
                }
                else {
                    $liSelected = $ulSelected.children('li').last().addClass('ul-selected');  
                }
            }
            else {
                $liSelected = $ulSelected.children('li').last().addClass('ul-selected');        
            }
            return false;
        }   
    }
});
  /*------------*/
   $('.area_list').on('input', function() {  
 if($(this).val() == '' || $(this).val() == null || $(this).val().length <= 1){
  //$(".area_lists").css('display','block');
  $('.area_list').css('border-radius', '15px');
  $('.area_lists').html('');
  return false;
}

var string_name = $(this).val().trim();
var my_city_search = readCookie(city_cookie);
if(!my_city_search){
    my_city_search='MQ==';/*Default city mumbai*/;
}

 $.ajax({
            type  : "POST",
            url   : base_url+'user/get_areas',
            dataType: 'JSON',
            data  : 'term='+string_name+'&city='+my_city_search,
            success: function(msg){
              if(msg == null){
                $('.autocomplete_timeslot').css({'visibility':'hidden'});
                $('.area_lists').html('');
                return false;
              }
              $('.autocomplete_timeslot').css({'visibility':'visible'}); /*for timeslote scrollbar*/
              $('.area_list').css('border-radius', '15px 15px 1px 1px');
              $('.area_lists').html('');
              var option = '';
              for(var i = 0; i < msg.length; i++){
                if(i % 2 === 0){
                    option += '<li class="area_li grey_bg" id="liarea"><a class="area_href"  rev="'+msg[i].area+'" rel="'+msg[i].id+'" href="javascript:void(0)" class="area_href">'+msg[i].area+'</a></li>';
                  }else{
                    option += '<li class="area_li white_bg" id="liarea"><a class="area_href"  rev="'+msg[i].area+'" rel="'+msg[i].id+'" href="javascript:void(0)" class="area_href">'+msg[i].area+'</a></li>';
                  }
              }
              $('.area_lists').html(option);
            }
        });
}); // END timeslot click.

    if (!load) {
    load = 1;
  /*------------*/
  $(".ul-selected a").trigger('click'); 
    var $liSelected = $('#liarea');
    var $ulSelected = $('#timeslote_auto');

$(".display_slots").keydown(function(e) {
  
  if(e.which === 13){
    var area_id = $('.ul-selected').find('.area_href').attr('rel');
    var area_name = $('.ul-selected').find('.area_href').attr('rev');
    if (!area_id){
      return false;
    }
  $('.area_list').val(area_name);
  $('.area_id').val(area_id);

    var area = $(".area_list").val();
    var areaid = $(".area_id").val();
  $('#display_slots').html('<div style="width:50px;margin:auto;margin-top:40px;"><img src="'+images_path+'/load.gif" /></div>');
    $.ajax({
      type  : "POST",
        url   : base_url+"user/homeslot", 
        data  : "areaid="+areaid+"&area="+area,
        cache: false,
      success:function(result){
      $("#display_slots").html(result);  
        },
        complete: function(){
            timeslot();
        }
    });
  }
  // Make sure we have a ul selected
});
  /*------------*/

} //end if load
//-------------

}

function re_enter_area(event) {

  var my_city_search = readCookie(city_cookie);
  if(!my_city_search){
      my_city_search='MQ==';/*Default city mumbai*/;
  }
  var load_enter;
var keycode = event.which;
if (keycode != 40 && keycode != 38 && keycode != 13) {
 if($('.area_lis').val() == '' || $('.area_lis').val() == null || $('.area_lis').val().length <= 1){
  $(".populate").css('display','none');
  return;
}
var string_name = $('.area_lis').val().trim();
$(".populate").css('display','block');
 $.ajax({
            type  : "POST",
            url   : base_url+'user/get_areas',
            dataType: 'JSON',
            data  : 'term='+string_name+'&city='+my_city_search,
            success: function(msg){
                $('.area_list').css('border-radius', '15px 15px 1px 1px');
              $('.populate').html('');
              var option = '';
              for(var i = 0; i < msg.length; i++){
                if(i % 2 === 0){
                    option += '<li class="area_li grey_bg" style="border-left:1px solid #C0C0C0;border-right:1px solid #C0C0C0;"><a class="area_href"  rev="'+msg[i].area+'" rel="'+msg[i].id+'" href="javascript:void(0)" class="area_href">'+msg[i].area+'</a></li>';
                  }else{
                    option += '<li class="area_li white_bg" style="border-left:1px solid #C0C0C0;border-right:1px solid #C0C0C0;"><a class="area_href"  rev="'+msg[i].area+'" rel="'+msg[i].id+'" href="javascript:void(0)" class="area_href">'+msg[i].area+'</a></li>';
                  }
              }
              $('.populate').html(option);
               $('.populate').css({'visibility':'visible'});
            }
        });

$(".ul-selected a").trigger('click'); 
  var $liSelected = $('#liarea');
  var $ulSelected = $('#timeslote_auto2');
$(".display_slots").keydown(function(e) {
  // Make sure we have a ul selected
    if($ulSelected) { 
        if(e.which === 40) {  
            if($liSelected) {
                $liSelected.removeClass('ul-selected');
                var $next = $liSelected.next();
                if($next.length) {
                    $liSelected = $next.addClass('ul-selected');
                }
                else {
                    $liSelected = $ulSelected.children('li').first().addClass('ul-selected');  
                }
            }
            else {
                $liSelected = $ulSelected.children('li').first().addClass('ul-selected');     
            }
        }else if(e.which === 38) {   

           if($liSelected) {
                $liSelected.removeClass('ul-selected');
                var $prev = $liSelected.prev();
                if($prev.length) {
                    $liSelected = $prev.addClass('ul-selected');
                }
                else {
                    $liSelected = $ulSelected.children('li').last().addClass('ul-selected');  
                }
            }
            else {
                $liSelected = $ulSelected.children('li').last().addClass('ul-selected');            
            }
        }        
    }
});
}

}
/*Timeslot JS end*/
$(window).load(function () {
    $('.livechatmain').load(base_url+'home/live_chat');
});


/*dj start*/

/**New sticky**/    
  $(window).scroll(function(){
  var filh = $('#sticky').height(); // filter bar height
  var ftm = 0; // filter bar distance from top
   // window height
  var sarea = (filh+ftm)-wh; // Total scroll area
  var wh = $(window).height();
  var sct = $(document).scrollTop();

  var mt = sct-sarea; // get margin top
  var bah = $('#section').height(); // right side content height

  // if window height is more than filter bar height
  if(sct>sarea && sct<(bah+ftm)-wh && wh<filh){
  $('#sticky').css({'margin-top':mt})
  }

  if(sct<sarea && wh<filh){
  $('#sticky').css({'margin-top':0})
  }

  if(sct>(bah+ftm)-wh && wh<filh){
  $('#sticky').css({'margin-top':bah-filh})
  }

  // if window height is low than filter bar height
  if(wh>filh){
  $('#sticky').css({'margin-top':sct-0})
  }

  if(wh>filh && sct-ftm>bah-filh){
  $('#sticky').css({'margin-top':bah-filh})
  }

  if(wh>filh && sct<0){
  $('#sticky').css({'margin-top':0})
  }

  if ( ($(window).width()) < 799) { 
    if(sct==0){
      $('#sticky').css({'margin-top':'0px'});
    }
  }
  else{
    if(sct==0){
      //$('#sticky').css({'margin-top':'10px'});
      if($('#greencat1 .topnav').length > 0){       
        $('#sticky').css({'margin-top':'40px'});
      }
      else{       
        $('#sticky').css({'margin-top':'10px'});
      }
    }
  }
});
    
  
  /*End sticky*/
//======================= Left Navigation =======================//

$('#nav ul li').click(function(){ 
  $('.cartContainer, .signupContainer, .loginContainer').slideUp();
  $('.targetDiv').removeClass('active');
  $('.display_slots').hide();
  $('.needHelp, .setting').removeClass('open'); 
  return false
});
    
$(document).click(function(){
  $('#nav ul ul').removeClass('aul');
  $('#nav li').removeClass('act');  
  $('#nav li ul').css({'display':'none', 'height':'0'});  
  leftnav(1);
});

function leftnav(hover){
  if(hover == 1){
    $('#nav li').hover(function(){                  
        $(this).children('ul').css({'display':'block', 'height':'auto'});
       },function(){
        $(this).children('ul').css({'display':'none', 'height':'0'});
    });
  }else{
    $("#nav li").off('hover');
  }
}

$(document).ready(function () { 
     $('#nav li#catname').click(function(e) {
        leftnav(0);
        $('#nav li').removeClass('act');
        $('#nav li ul').css({'display':'none'});

        var $parent = $(this);
        if (!$parent.hasClass('act')) {
            $parent.addClass('act');
            $(this).children('ul').css({'display':'block', 'height':'auto'});
        }
        e.preventDefault();
    });

    $('.sub_cat').click(function() {
        leftnav(1);
        $('#nav li').removeClass('act');
        $('#nav li ul').css({'display':'none'});
    });
});


function devicesresize(){
  var flag = true;

  if ( ($(window).width()) < 799) {  
    $('aside#sticky').stop().addClass('moveout').removeClass('movein'); 
    $('.catbtn').click(function(){
      //e.stopPropagation();
      if(flag == true){           
        $('aside#sticky').stop().removeClass('moveout').addClass('movein');       
        $('section#section').stop().css({'margin-right':'-272px','border-left':'1px solid #52b5a8'});
        $('.trmenus').stop().css({'right':'-100%'});
        $('.trmenus').removeClass('bounceInRight animated');
        flag = false;   
      }
      else{           
        $('aside#sticky').stop().removeClass('movein').addClass('moveout');   
        $('section#section').stop().css({'margin-right':'0px','border-left':'0px solid #52b5a8'});
        flag = true;
      }
    });

    var flag2 = true;
    $('.rspbtn').click(function(){  
    $('.cartContainer, .signupContainer, .loginContainer').slideUp();  
    $('.targetDiv').removeClass('active'); 
      if(flag2 == true){
        $('.trmenus').stop().css({'right':'0'});
        $('.trmenus').addClass('bounceInRight animated');
         $('html, body').css({'overflow': 'hidden','height': '100%'});
        flag2 = false;    
      }
      else{
        $('.trmenus').stop().css({'right':'-100%'});
        $('.trmenus').removeClass('bounceInRight animated');
        $('html, body').css({'overflow': 'auto','height': 'auto'});
        flag2 = true;
      }
    });
    
    // $('.area_list').live('focus',function(){     
    //      $('html, body').css({'overflow': 'hidden','height': '100%'});
    // });
    // $('.area_list').live('blur',function(){     
    //     $('html, body').css({'overflow': 'auto','height': 'auto'});
    // });

    $('.signUp, .login, .mycart, .check_login, .mbsearch, .mbclose, .closecross').click(function(){
        
        $('.trmenus').stop().css({'right':'-100%'});
        $('.trmenus').removeClass('bounceInRight animated');
        $('html, body').css({'overflow': 'auto','height': 'auto'});
        flag2 = true;
      
    });

    $('#nav ul li ul li a, .lavaLamp li ul li a, .stkoverlay').click(function(){
      //e.stopPropagation();     
      $('aside#sticky').stop().addClass('moveout').removeClass('movein');
      $('section#section').stop().css({'margin-right':'0px','border-left':'0px solid #52b5a8'});
      $('.trmenus').stop().css({'right':'-100%'});
      $('.trmenus').removeClass('bounceInRight animated');
        $('aside#sticky').removeClass('stkshdow');
        $('.stkoverlay').fadeOut(500);
        $('html, body').css({'overflow': 'auto','height': 'auto'});
      flag = true;
      flag2 = true;
    });
    
  }

  var windhght = $(window).height()-45;
  //var flgskd = true;
  if ( ($(window).width()) < 767){ 

    $('aside#sticky').stop().addClass('moveout').removeClass('movein');
    $('aside#sticky').removeClass('stkshdow');
    $('.stkoverlay').fadeOut(0);
    $('html, body').css({'overflow': 'auto','height': 'auto'}); 

    $('aside#sticky').css({'height': windhght});

    $('.catbtn').click(function(){
      if(flag == true){     
        $('aside#sticky').removeClass('stkshdow');
        $('.stkoverlay').fadeOut(300);
        $('html, body').css({'overflow': 'auto','height': 'auto'});       
      }
      else{
        $('aside#sticky').addClass('stkshdow');
        $('.stkoverlay').fadeIn(300);
        $('html, body').css({'overflow': 'hidden','height': '100%'});
      }
    });     
  }

  if ( $(window).width() > 799) {       
       $('aside#sticky').stop().removeClass('moveout').addClass('movein');
       $('section#section').stop().css({'margin-right':'0px','border-left':'0px solid #52b5a8'});     
    }
    else
    {            
       $('aside#sticky').stop().removeClass('movein').addClass('moveout');
       $('section#section').stop().css({'margin-right':'0px','border-left':'0px solid #52b5a8'});
    }

    if($(window).width() >= 567 ){
      $('.selected_slot').hide();
    }

}

  
$(document).ready(function(){
  devicesresize();
  $('.mbsearch').click(function(e){
    e.stopPropagation();
    $(this).fadeOut(0);
    $('.search').focus();
    $('.banya').fadeOut(0);   
    $('.searchContainer').addClass('gosearch');
    $('.mbclose').fadeIn(0);
  });

  $('.mbclose').click(function(e){ 
    e.stopPropagation();
    $(this).fadeOut(0); 
    $('.searchContainer').removeClass('gosearch');
    $('.mbsearch').fadeIn(0);
    $('.banya').fadeIn(0);  
    $('ul.ui-autocomplete').fadeOut(0);
    $('.searchContainer').removeClass('shadoww');
    $('.search').removeClass('searcfocus');
  }); 

//.dropdown-setting  .dropdown-needhelp
  
  $('.dropdown-toggle').click(function(e){    
    e.stopPropagation();
    $('.dropdown-setting, .dropdown-needhelp').slideUp();
    $(this).next('ul').toggle();
  });
  $(document).click(function () { 
      $('.mbclose').fadeOut(0); 
      $('.searchContainer').removeClass('gosearch');
      $('.mbsearch').fadeIn(0);
      $('.banya').fadeIn(0);  
      $('ul.ui-autocomplete').fadeOut(0);
      $('.searchContainer').removeClass('shadoww');
      $('.search').removeClass('searcfocus');

      $('.dropdown-setting, .dropdown-needhelp').slideUp();

        // leftnav(1);
        // $('#nav li').removeClass('act');
        // $('#nav li ul').css({'display':'none'});
  });

  var isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
  if(isiPad > -1){
     // alert('!Dhiraj, I am iPad user.');
    $("li#catname").hover(function() {      
      $(this).addClass('act');
    }, function() {
      $('#nav li').removeClass('act');
    });
  }
 


});

/* To check whether the get parameter is present in the url */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}// END FUNCTION


function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


function scrolldownnup(){

    var previousScroll = 0;     
      $(window).scroll(function () {
          if ( ($(window).width()) < 666) { 
             var currentScroll = $(this).scrollTop();
             if (currentScroll > previousScroll){
                //alert('down');
                // $('body').css({'background':'red'});
                $('.topfixed, .topfixed-checkout').css({'top':'-48px'});
                $('.tag_filter').css({'bottom':'-42px'});
             }
             else {
                //alert('up');
                // $('body').css({'background':'green'});
                $('.topfixed, .topfixed-checkout').css({'top':'0px'});
                $('.tag_filter').css({'bottom':'0px'});
             }
             previousScroll = currentScroll;

              //when scrolling stopped
              clearTimeout( $.data( this, "scrollCheck" ) );
              $.data( this, "scrollCheck", setTimeout(function() {
                  $('.topfixed, .topfixed-checkout').css({'top':'0px'});
                  $('.tag_filter').css({'bottom':'0px'});
              }, 250) );
            
            

          }         

          leftnav(1);
          $('#nav li').removeClass('act');
          $('#nav li ul').css({'display':'none'});

      }); 

}
scrolldownnup(); 

/**/
function sortbyfilters(){
  // var sortby = true;
  if ( ($(window).width()) < 666) { 
    // $('.sort_panel').click(function(e){
    //     e.preventDefault();   
    //     if(sortby == true){
    //         $('.overlaycustmpops').css({'display':'block'});
    //         sortby = false;
    //     }
    //     // else{
    //     //     //$('.overlaycustmpops').css({'display':'none'});
    //     //     //sortby = true;
    //     // }
    // });

    // $('.overlaycustmpops, #sortBySelectBoxItOptions, .topfixed').click(function(){
    //     $('.overlaycustmpops').css({'display':'none'});
    //      sortby = true;
    //      //alert(sortby);
    // });

    $('.prodfltrs').click(function(){
         $('.multi_tag_main').css({'display':'block'});
         $('html, body').css({'overflow': 'hidden','height': '100%'});
    });
    $('.apply, .cancel').click(function(){
         $('.multi_tag_main').css({'display':'none'});
         $('html, body').css({'overflow': 'auto','height': 'auto'});
    });
    

  }
}
sortbyfilters();
/**/  

$(window).resize(function () {  
  devicesresize();  
  scrolldownnup();  

});

