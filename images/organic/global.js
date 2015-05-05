if($.validator){
	var login_email_validated = 0;
	$( "#login_form" ).validate({
			rules: {
			    login: {
			      email: true,
			      required:true
			    }
			},
			success: function(label){
			  	if(label.attr('for') == 'login'){
			  		login_email_validated = 1;
			  	}
			}
	});
}// End If

var LOGIN = {
	reset : function(){
		$('#login-error').html('');
		$('.ermes').remove();
	},
	check : function(e, self){
		e.preventDefault();
		$.ajax({
          type  : "POST",
          url   : "/cart/check_cart_total",
          success: function(msg){
            var reponse_amt = JSON.parse(msg);
            if((Number(USER_ID) > 0 || !USER_ID) && Number(reponse_amt.response) >= 500){
				window.location.href = self.attr('href');
				return true;
			}else if(Number(reponse_amt.response) < 500){
				$.pgwModal({content:"<div><h3>Hi, we need you to order for Rs 500 minimum.</h3><div class='msg'><br><a class='closedialog'>OK</a></div></div>"});
               	$('.closedialog').click(function(){ $.pgwModal('close'); });
				return false;
			}else{
				$(".login").trigger("click");
				return false;
			}
          }
        });

	},
	validate : function(){
		LOGIN.reset();
		var check = true;
		
		if(login_email_validated == 0){
			$("#login_form").validate().element("#login");
			check = false;
		}

		if ($('input[name="login"]').val().length > 100){
			$('input[name="login"]').after('<div class="ermes" align="center">Please enter no more than 100 characters.</div>');
			check = false;
		}

		if($('input[name="login_password"]').val() == ''){
			$('input[name="login_password"]').after('<div class="ermes">Please enter a valid password</div>');
			check = false;
		}else if($('input[name="login_password"]').val().length > 255){
			$('input[name="login_password"]').after('<div class="ermes">Please enter no more than 255 characters.</div>');
			check = false;
		}

		if(!check){
			return false;
		}

		return true;
	},
	process  : function(e, self){
		if(!LOGIN.validate()){
			return false;
		}

		if(detectCSSFeature('transition')){
			$('.loginBtn').addClass('loading');
			$('.loginBtn').attr("disabled", true);	
		}
		
		$.ajax({
            type 	: "POST",
            url 	: base_url+"user/login",
            dataType: 'JSON',
            data 	: $('#login_form').serialize(),
            error 	: function(xhr, ajaxOptions, thrownError){
            	LOGIN.error(xhr.responseText);
            },
            complete: function(xhr, ajaxOptions){
            	LOGIN.complete();
            }
        }).done(function(msg){
        	LOGIN.responseHandler(msg);
        });
	},
	error : function(msg){
		$('#login-error').html('Some error occured. Please try again');
		$('#login-error').show();
		$('.loginBtn').removeClass('loading');
		$('.loginBtn').attr("disabled", false);
	},
	complete : function(){

	},
	responseHandler : function(msg){
		if(msg.status === 'success'){
		
			if($('#reurl').val() != ''){
				window.location.href = $('#reurl').val();
			}
			else{
				//location.reload();				
				$('.Regis').empty();					
				var linkappend = '<a href="'+base_url+'checkout" class="logoutlink login2">Checkout</a>';
				linkappend += ' <a href="'+base_url+'user/logout" class="logoutlink2 login">Logout</a>';
				if(msg.notification > 0){
					$('.my_account').append('<span style="background:#FF0000; color:#FFFFFF; padding:2px 3px; position:absolute; top:-7px; right:0;border-radius: 5px; -moz-border-radius: 5px;-webkit-border-radius: 5px;">'+msg.notification+'</span>');
				}
				$('.Regis').append(linkappend);
				
				CART.responseHandler(msg);
				USER_ID = msg.user_id;
				$('.prod_suggest_guest').remove();
				$('.prod_suggest').show();
				$.fn.colorbox.close();
			}
			location.reload();
			return;
		}
		else if(msg.status === 'error'){
			$('#login-error').html('Email or Password Incorrect');
        	$('#login-error').show();
        	$('.loginBtn').removeClass('loading');
        	$('.loginBtn').attr("disabled", false);
        }
		$('.login_loading').remove();
		$('.loginclick').show();
	}
}
/* ========== END login ========== */

/* ========== TAB VIEW ========== */
var TABVIEW = {
	setTags : function(type, tag_class, page, flags){
		page.find('.'+tag_class).remove();

		if($.inArray(type, flags) != -1){
			var tDiv 			= document.createElement('div');
			var inside_tag_html = '';

			if(type == 'featured'){
				inside_tag_html = '<img src="'+img_path+'/mooch.png" class="pl3">'
			}else if(type == 'hotselling'){
				inside_tag_html = '<div class="pl4">Hot</div>';
			}else if(type == 'new'){
				inside_tag_html = '<div class="pl3">New</div>';
			}

			$(tDiv).addClass(tag_class);
			$(tDiv).html(inside_tag_html);
			$(tDiv).insertBefore(page.find(".productImg"));
		}
	},
	tags : function(self, page){
		var activeLi = self; 
        if(activeLi.data('description').length > 25)
        {
            page.find('.desc').find('.tooltip').html(activeLi.attr('data-desctooltip')+'<span class="classic">'+activeLi.attr('data-description')+'</span>');
        }
        else{
            page.find('.desc').find('.tooltip').html(activeLi.attr('data-description'));
        }
        //new product
		var flags = activeLi.data('tags').split(',');
		TABVIEW.setTags('new', 'tag-new', page, flags);
		TABVIEW.setTags('featured', 'tag-mooch', page, flags);
		TABVIEW.setTags('hotselling', 'tag-hot', page, flags);
		TABVIEW.setTags('limited', 'lStock-lstock', page, flags);
	},
	details : function(self, page){
		var mrpval = self.data('mrp');
		var off = self.data('discount');
		var priceval = self.data('price');
		var wt_code = self.data('wtcode');

		page.find('.new-price-amt').html(priceval);

		if(off > 0 && off != ''){
			if(page.find('.discount-dis').length){
				page.find('.discount-dis').css("display", "block");
				page.find('.discount-dis').html(off+"% off");
			}
			else{
				page.prepend('<div class="discount-dis">'+off+'% off'+'</div>');
			}
			page.find('.old-price').html(mrpval);
			//page.find('.new_price').css("top", "0px");
		}
		else{
			page.find('.old-price').html("");
			//page.find('.new_price').css("top", "5px");
			page.find('.discount-dis').css("display", "none");
		}
		page.find('.cart_add').data('weight-code', wt_code);
		page.find('.prName a').attr('href', self.data('url'));
		page.find('.productImg a').attr('href', self.data('url'));
	},
	image : function(self, page){
		var image = self.data('image');
		page.find('.productImg img').attr('src', image);
        var after_image = page.find('.productImg img');
        after_image.bind("error", function(){
	        var image_link = $(after_image).attr("rel");
	        $(after_image).attr("src", image_link);
        });
	},
	init : function(e, self){
		e.preventDefault();
		self.closest('.skuContainer').find('.sku').removeClass('active');
		self.addClass('active');
		var page = self.closest('.product-inner').find('.Pages');
		TABVIEW.image(self, page);
		TABVIEW.details(self, page);
		TABVIEW.tags(self, page);
		return false;
	}
}
/* ========== END TAB view ========== */

var LB_ALERT = {
	confirm : function(title, message, callback){
		LB_ALERT._show(title, message, callback, 'confirm');
	},
	_show : function(title, message, callback, type){

		switch(type){
			case 'confirm':
				$('.hshow').show();
				$('.hshow').find('.white').html("<div class='class_for_search'><h3>"+
					"<span class='class_for_search'>"+title+"</span></h3>"+
					"<div class='msg'>"+message+
					"<br><br><div style='text-align:right'>"+
					"<a href='javascript:void(0)' class='closedialog popup_cancel'>CANCEL</a>"+
					" &nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' class='popup_ok'>OK</a></div>"+
					"</div></div>");
				
				$(".popup_ok").live('click', function() {
					if( callback ) callback(true);
					$('.hshow').hide();
				});
				$(".popup_cancel").live('click', function() {
					callback = '';
					if( callback ) callback(false);
					$('.hshow').hide();
				});
			break;
		}
	}
}
/* Function for changing search input radius */
// function search_border_radius(){
// 	//if($("ul.ui-autocomplete").css('display') == 'block'){
// 	if($("ul.ui-autocomplete").is(":visible")){	
// 		$('.searchContainer').addClass('search_border_radius');
// 	}else{
// 		$('.searchContainer').removeClass('search_border_radius');
// 	}
// }
// function shadoww(){
// 	if($("ul.ui-autocomplete").is(":visible")){	
// 		$('.searchContainer').addClass('shadoww');
// 	}else{
// 		$('.searchContainer').removeClass('shadoww');
// 	}
// }

function htmlDecode( html ) {
    var a = document.createElement( 'a' ); a.innerHTML = html;
    return a.textContent;
};

var SEARCH = {
	cnt : 0,
	inner : function(item, term){
		if(item.is_solr == true){	
			if(SEARCH.cnt == 0){
				SEARCH.cnt++;
				return '<div class="autocomplete-header">'+item.heading+item.suggestions+'</div>';
			}
		}// END IF
		var label = item.brand_name+' '+item.prod_name;
		term = term.split(' ').join('|');
        var re = new RegExp("(" + $.ui.autocomplete.escapeRegex(term) + ")", "gi") ;
        label = label.replace(re,"<b>$1</b>");
		var str = '<span class="ser_1">'+
					'<span class="ser_2">'+
						'<span class="Serfontamt">Rs.</span>'+
						item.amount+
					'</span>'+
					'<input class="ser_3" type="text" value="1" data-weight-code="'+item.weight_code+'" data-id="'+item.id+'" />'+
					'<div class="key_imabtnadd ser_4">'+
						'<a class="search_cart_add add-btn-search" data-weight-code="'+item.weight_code+'" data-id="'+item.id+'"  data-name="'+$.trim(item.brand_name)+' '+$.trim(item.prod_name)+'">'+
							'Add'+
						'</a>'+
					'</div>'+
				'</span>';
		var img = '<a class="autocomplete-prod-img"><img onerror="$(this).attr(\'src\',\''+item.default_img+'\')" src="'+item.image+'" height="30" width="30"/></a>';
		return str = img+'<a class="ser_6" href="'+item.url+'">'+label+' ('+item.weight+' '+item.unit+')'+'</a>'+str;
		
	},
	placeholder : function($_this){		
		var _default = $($_this).data('placeholder');
		if(_default !== undefined){
			if(_default == $($_this).val()){
				$($_this).css('color', '#808080');
			}
			$($_this).live('focus', function(){
				if(_default == $(this).val()){
					$(this).val('');
					$(this).css('color', '#000');
				}
			});
			$($_this).live('blur', function(){
				if($(this).val() == ''){
					$(this).val(_default);
					$(this).css('color', '#808080');
				}
			});
		}
	},
	patch : function(){

		$.ui.autocomplete.prototype._renderItem = function(ul, item) {
			// $('.searchContainer').addClass('search_border_radius');
			return $("<li class='ser_5'>")
	        	.data("item.autocomplete", item)
				.append(SEARCH.inner(item, this.term))
				.appendTo(ul);
		}

	}
}


$(document).ready(function(){
	
	// treeview
	jQuery('ul.user-options li:last-child').css("border-right","solid 0px #89ac2a;");


	$(document).keydown(function(e){
		if($(this).data("keyboard-autocomplete")==="enabled" && navigator.userAgent.search("MSIE") <= 0){
			var activeElem=$(".keyboard-autocomplete"),
				activeElemPos=Math.abs($(".keyboard-autocomplete .mCSB_container").position().top),
				pixelsToScroll=60;
			if(e.which===38){ //scroll up
				e.preventDefault();
				if(pixelsToScroll>activeElemPos){
					activeElem.mCustomScrollbar("scrollTo","top");
				}else{
					activeElem.mCustomScrollbar("scrollTo",(activeElemPos-pixelsToScroll),{scrollInertia:400,scrollEasing:"easeOutCirc"});
				}
			}else if(e.which===40){ //scroll down
				e.preventDefault();
				activeElem.mCustomScrollbar("scrollTo",(activeElemPos+pixelsToScroll),{scrollInertia:400,scrollEasing:"easeOutCirc"});
			}
		}
	});

	if($.isFunction($.fn.treeview)){
	  	$("#navigation").treeview({
		    collapsed: true,
		    unique: true,
		    animated:400 
	    });
  	}

  	$('.current').mouseover(function(){
  		/*var submenu = $(this).find('ul.submenu');
        if (submenu.hasClass('submenu')){
            submenu.removeClass('hide');
        }*/
     	$(this).find('ul.inner-current').find('li:odd').css('background-color','#b1d64c');
     	$(this).find('ul.inner-current').find('li:even').css('background-color','#c0e55b');
       
		/*$(".inner-current li:odd").css('background-color','#c0e55b');
		$(".inner-current li:even").css('background-color','#b1d64c');*/
  	});
  	

  	$('#search_form').submit(function(){
  		if($('#searchKeyword').val() == 'Enter your search keyword here' ||
  		$('#searchKeyword').val() == '')
  		return false;
  	});

  	$('#searchKeyword').on('input', function() {
  		$('#searchKeyword').val($('#searchKeyword').val().replace(/[^a-zA-Z0-9 \s\(\)\'\"\/\&\, ]/g, ""));
  	});

  	$('body').on('input', '.ser_3', function() {
  		var data_id = $(this).val();
  		
  		if(data_id == '0'){
  			$(this).val('1');
  		}
  		if(data_id == 0 || data_id == ''){
	      	
	  		$('.ui-menu-item').find('.ser_3').keydown(function (e) {
		        // Allow: backspace, delete, tab, escape, enter and .
		        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
		             // Allow: Ctrl+A
		            (e.keyCode == 65 && e.ctrlKey === true) || 
		             // Allow: home, end, left, right
		            (e.keyCode >= 35 && e.keyCode <= 39)) {
		                 // let it happen, don't do anything
		                 return;
		        }
		        // Ensure that it is a number and stop the keypress
		        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		            e.preventDefault();
		        }
		        
	    	});
  		}
  	});	
  	
  	
    $('.page_navigation a').click(function(){ 
	    $('body,html').animate({scrollTop:0},300);      
	});
    
    /* ========== login ========== */
    $('.check_login').live('click', function(e){
    	LOGIN.check(e, $(this));
    });

    $('input[name="login"],input[name="login_password"]').blur(function(e){
    	LOGIN.validate();

    });

    $('.loginclick').live('click', function(e){
    	LOGIN.process(e, $(this));
    });

    $("#login_form input").keypress(function(e) {
    	if (e.keyCode == 13) {
    		LOGIN.process(e, $(this));
    	}
    });
    /* ========= end login ========= */

    $('.tabs ul li a').live('click', function(e){
    	TABVIEW.init(e, $(this));
    });

    $('.sku').live('click', function(e){
    	TABVIEW.init(e, $(this));
    });

    $("img.lazy").lazyload(
		{
    		event: "lazyload", effect : "fadeIn", failure_limit : 10, skip_invisible : false,
    		error : function(self, settings){
    			$(this).attr("src", $(this).attr('rel'));
    		}
    	}
	).trigger("lazyload");//.removeClass('lazy');

	$("img.lazy").error(function () {
	  	$(this).unbind("error").attr("src", $(this).attr('rel'));
	});

	$(".prod_img").removeClass('lazy');

	// INFINITE SCROLL
	if($.isFunction($.fn.jscroll)){
		$('.infinite-scroll').jscroll({
		    loadingHtml: '<p class="show_more_products"><img src="'+images_path+'/load.gif" alt="Loading" /> Loading more products...</p>',
		    padding: 20,
		    nextSelector: 'a.jscroll-next:last'
		});
	}

	$(".plans a").mouseover(function() {
	    $(".navigation_container").show();
  	});
	$(".plans").mouseleave(function() {
	    $(".navigation_container").css("display","none");
  	});
  	
	$(".navigation_container").mouseover(function(){
		$(this).css("display","block");
	});
	$(".navigation_container").mouseleave(function(){
		$(this).hide();
	});

	//$(".inlinesuggest").colorbox({inline:true, width:"400", height:"200"});
	$('.inlinesuggest').click(function(){
		$.pgwModal({
		    target: '#inline_suggest'
		});
		$('.suggest_product_error').html('');
		$('.formsubmit').click(function(){
			var cat_suggest = $('.pm-content #cat_suggest').val();
			$('.pm-content #cat_suggest').focus();
			$('.suggest_product_error').html('').hide();
			
			if(cat_suggest == "" || cat_suggest.trim().length < 1){
				$('.suggest_product_error').html('Enter a product name');
				$('.suggest_product_error').show();
			}
			else if(/^[a-zA-Z0-9\-\s\,\&\'\/\.]*$/.test(cat_suggest) == false){
				$('.suggest_product_error').html("Must contain only a-z A-Z 0-9 & , ' - / .");
				$('.suggest_product_error').show();
			}
			else if(cat_suggest.length > 255)
			{
				$('.suggest_product_error').html("Max 255 characters allowed.");
				$('.suggest_product_error').show();
			}
			else{
				$.ajax({
					type 	: "POST",
					url 	: base_url+"user/process_product_suggest",
					data 	: {cat_suggest : cat_suggest},
					cache 	: false,
					success: function(b){
						alert('Thank you for suggesting the product to us. \n Our teams will work on it and revert to you as soon as the items are in available.\n\n Team Localbanya');
						$('.pm-content #cat_suggest').val('');
					}
				});	
			}
		});
	});
	
	// $('#cboxClose').click(function(){
	// 	$.colorbox.remove();
	// 	//$(".inlinesuggest").colorbox({inline:true, width:"400", height:"200"});
	// 	//location.reload();
	// 	window.location.href = window.location;
	// });

	if($.isFunction($.fn.selectbox)){
		$("#select_category").selectbox();
		$(".selectbox").selectbox();
	}
	
	SEARCH.placeholder("input#searchKeyword");
	if($.ui !== undefined){
		SEARCH.patch();
		

		$("input#searchKeyword").autocomplete({
			appendTo:".searchContainer",
			source: base_url+"home/ajax_search",
			minLength: 2,
			select: function(event, ui) {			
				location.href = ui.item.url;
				$.getJSON(base_url+'user/autocomplete_logger?searchKeyword='+$("input#searchKeyword").val());
				
				return false;
			},
			complete: function(event, ui){
				// search_border_radius();
			},
			focus: function (event, ui) {
				$('input#searchKeyword').focus();
				/*$( '.ui-autocomplete, .cartContainer' ).bind( 'mousewheel DOMMouseScroll', function ( e ) {
				    var e0 = e.originalEvent,
				        delta = e0.wheelDelta || -e0.detail;
				    
				    this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
				    e.preventDefault();
				});*/

	            return false;
        	},
			open : function(){
				SEARCH.cnt = 0;
			  	var numitems = parseInt($(".ui-autocomplete li").length);
			    
			    if(numitems> 12){
		    		//$('.ui-autocomplete').css({'overflow-y': 'auto', 'overflow-x': 'hidden'});
					////$('.ser_6').css({'width':'340px'});
			    }else{
			    	//$('.ui-autocomplete').css({'overflow-y': '', 'overflow-x': ''});
			    	////$('.ser_6').css({'width':'340px'});
			    }


			    $(".ui-autocomplete").mCustomScrollbar({
			    	advanced:{
				        autoScrollOnFocus: true
				    }
				});


				/*for perfect scroll*/
				// if (navigator.userAgent.search("MSIE") <= 0) {
				// 	$('.ui-autocomplete').scrollTop(0);
				// 	$('.ui-autocomplete').perfectScrollbar();
				// 	$('.ui-autocomplete').perfectScrollbar('update');
				// 	$('.ui-autocomplete').addClass('uiauto-notiebrws');
				// }else{
				// 	$('.ui-autocomplete').removeClass('uiauto-notiebrws');
				// }


				$(".ui-autocomplete").hover(function(){
					$(document).data({"keyboard-autocomplete":"enabled"});
			    $(".ui-autocomplete").addClass("keyboard-autocomplete");
					
				},function(){
					$(document).data({"keyboard-autocomplete":"disabled"});
					$(this).removeClass("keyboard-autocomplete");
				});

				// $('.ui-autocomplete').find('.mCSB_scrollTools').css('width','5px');
				/*$('.ui-autocomplete li:odd').css('background-color','#eee');
				$('.ui-autocomplete li:even').css('background-color','#fff');*/

				// $(".ui-autocomplete").hover(function(){
				// 	$(document).data({"keyboard-auto":"enabled"});
				// 	$(this).addClass("keyboard-auto");
				// },function(){
				// 	$(document).data({"keyboard-auto":"disabled"});
				// 	$(this).removeClass("keyboard-auto");
				// });
        	}
		});

		$('.search, .ui-autocomplete').click(function(e){
			e.stopPropagation();
		});
		$('.search').focus(function(){			
			$('.searchContainer').addClass('shadoww');
			$(this).addClass('searcfocus');
			// if($("ul.ui-autocomplete").is(":visible")){	
			// 	$('.searchContainer').addClass('shadoww');
			// }			
		});
		// $('.search').blur(function(){				
		// 	$('.searchContainer').removeClass('shadoww');	
		// });
		
		$(document).click(function(e){
			$('.searchContainer').removeClass('shadoww');
			$('.search').removeClass('searcfocus');

			var elem = $(e.target).attr('class');
		    var exception_classes = new Array("ser_1","ser_2","ser_3","key_imabtnadd ser_4","cart_addNew","img_search_class","ser_5 Serprobg","ser_5","lb-search-inputBx ui-autocomplete-input","ui-autocomplete ui-menu ui-widget ui-widget-content ui-corner-all","simplemodal-overlay","simplemodal-container","simplemodal-wrap","simplemodal-data","class_for_search","ser_5 ui-menu-item","ser_5 Serprobg ui-menu-item","msg","autocomplete-header","autocomplete-suggestion");
		    if($.inArray(elem, exception_classes) == -1)
		    {
		        $( "#searchKeyword" ).autocomplete( "close" );
		    }
		});
		$('.autocomplete-suggestion').live('click', function(){
			location.href = $(this).attr('href');
		});
	}

	$(window).scroll(function(){
	    if ($(this).scrollTop() > 100) {
	        $('.scrollup').fadeIn();
	    } else {
	        $('.scrollup').fadeOut();
	    }
	});

	$('.scrollup').click(function(e){
		e.preventDefault();
	    $("html, body").animate({ scrollTop: 0 }, 600);
	    return false;
	});
	var hash = window.location.hash;
	if(hash == "#login" && $('#inline_content').length){
		var itemid = '#div1';
		jQuery(function ($) {
			$(itemid).slideDown();
			$(itemid).addClass('active');
		});
	}else if(hash == "#registration" && $('#inline_content').length){
		var itemid = '#div2';
		jQuery(function ($) {
			$(itemid).slideDown();
			$(itemid).addClass('active');
		});
	}
	$('.bill_no').click(function(){
		if($(window).width()<500){
		  bill=$(this).data("id");
	      $('.bill_no').each(function(){
	      	if(bill==$(this).data("id") && $(".bill"+bill).css("display") == 'none'){
	      		$(".bill"+bill).fadeIn();
	      	}else{
	      		$(".bill"+$(this).data("id")).hide();
	      	}
	      });
	      
	    }
    });	

	$('.proceed-button').click(function(){
		var city = $('#cityname').val();
		if(city =='' || city == undefined){
			$.pgwModal({content:"<div class='errorPopup'><div class='msg'>Please select city.<br><br><a class='closedialog'><img src='"+images_path+"/btn_ok.jpg' border='0' /></a></div></div>"});
           $('.closedialog').click(function(){ $.pgwModal('close'); });
           return false;
		}
		eraseCookie(city_cookie);
		createCookie(city_cookie,city,"30");
		location.reload();
	});

	$('#changecity').change(function(){
		var city = $('#changecity').val();
		eraseCookie(city_cookie);
		createCookie(city_cookie,city,"1");
		location.reload();
    });
	
});
$(document).ajaxComplete(function(event, request, settings) {
    //Lazy load image
	$("img.lazy").lazyload(
		{
			event: "lazyload", effect : "fadeIn", failure_limit : 10, skip_invisible : false,
			error : function(self, settings){
    			$(this).attr("src", $(this).attr('rel'));
    		}
		}
	).trigger("lazyload");
	
	$("img.lazy").error(function () {
	  	$(this).unbind("error").attr("src", $(this).attr('rel'));
	});

	$(".prod_img").removeClass('lazy');
	
});

function countcart()
{
	var tempcount2=0;
	$('table.tblcart tbody tr').each(function(i){ 
	tempcount2++;
	
	});
	if (tempcount2==0)
		return tempcount2+' Items';
	else
		return tempcount2+' Items '+$('.totalprize').html();

}
/*** for close of quick view popup ***/
// $('body').on('click', 'a.simplemodal-close', function() {
// 		$.modal.close();
// });

jQuery(function($) {

  var _oldShow = $.fn.show;

  $.fn.show = function(speed, oldCallback) {
    return $(this).each(function() {
      var obj         = $(this),
          newCallback = function() {
            if ($.isFunction(oldCallback)) {
              oldCallback.apply(obj);
            }
            obj.trigger('afterShow');
          };

      // you can trigger a before show if you want
      obj.trigger('beforeShow');

      // now use the old function to show the element passing the new callback
      _oldShow.apply(obj, [speed, newCallback]);
    });
  }
});

/*function BrowserDetection() {
    if (navigator.userAgent.search("MSIE") >= 0) {
    	return 1;
    }
    //Check if browser is Chrome or not
    else if (navigator.userAgent.search("Chrome") >= 0) {
       return 2;
    }
    //Check if browser is Firefox or not
    else if (navigator.userAgent.search("Firefox") >= 0) {
    	return 3;
    }
    //Check if browser is Safari or not
    else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
       	return 4;
    }
    //Check if browser is Opera or not
    else if (navigator.userAgent.search("Opera") >= 0) {
       	return 5;
    }
}*/

function detectCSSFeature(featurename){
    var feature = false,
    domPrefixes = 'Webkit Moz ms O'.split(' '),
    elm = document.createElement('div'),
    featurenameCapital = null;

    featurename = featurename.toLowerCase();

    if( elm.style[featurename] ) { feature = true; } 

    if( feature === false ) {
        featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);
        for( var i = 0; i < domPrefixes.length; i++ ) {
            if( elm.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
              feature = true;
              break;
            }
        }
    }
    return feature; 
}

/* Function for hiding or showing the green category bar */
function dropdown_check(param){
	if($('#divneedHelp ,.setting').hasClass('open')){return false;}
	if($('.display_slots').css('display') == 'block'){return false;}
	
}// END FUNCTION

$(document).keyup(function(e) { 
   if (e.which == 27) {
   		$('.display_slots').hide();
   		dropdown_check();
   		// search_border_radius();

   	   	if($('.hshow').hide()){
	   		return false;	
	   	}
	}
});

$(document).on('click', function (e) {

	if(!$(e.target).closest('.addButton').length && !$(e.target).closest('.cartContainer').length && !$(e.target).closest('.topfixed').length) {
	    if($(".cartContainer").is(':visible') && $(".cartContainer").css('height') >= '200px')
		{
			if ($(".cartContainer").slideUp("fast")){
				$('.targetDiv').removeClass('active');
	    	}
	    }
	}

	if(!$(e.target).closest('.forgotPass').length && !$(e.target).closest('.loginContainer').length && !$(e.target).closest('.signupContainer').length && !$(e.target).closest('.topfixed').length){
		if($(".signupContainer").is(':visible') && $(".signupContainer").css('height') >= '120px')
		{
			if ($(".signupContainer").slideUp("fast")){
					$('.targetDiv').removeClass('active');
		    	}
		}

		if($(".loginContainer").is(':visible') && $(".loginContainer").css('height') >= '120px')
		{
			if ($(".loginContainer").slideUp("fast")){
					$('.targetDiv').removeClass('active');
		    	}
		}

		if($(".forgotPass").is(':visible') && $(".forgotPass").css('height') >= '150px')
		{
			if ($(".forgotPass").slideUp("fast")){
					$('.targetDiv').removeClass('active');
		    	}
		}
	}

	if(!$(e.target).closest('.ui-autocomplete').length && !$(e.target).closest('.search').length) {
	   	// $('.searchContainer').removeClass('search_border_radius');		
	}

	if(!$(e.target).closest('.scrollfixed').length){
		$("#nav li ul").css({"visibility":""});
	}

	/* For green category toggle according to the display of top nav div's*/
	
	if(!$(e.target).closest('.targetDiv').length && !$(e.target).closest('.showSingle').length && !$(e.target).closest('.needHelp').length && !$(e.target).closest('.setting').length && !$(e.target).closest('.display_slots').length ){
		dropdown_check();
	}
});

$("#setting").click(function(){ //toggleup timeslot
	 $(".display_slots").hide();
	 first_click_timeslot = false;
});


/*** For browser back reloading after ajax contents are loaded ***/
window.onpopstate =  function(e) {
	// alert(e.isTrusted);
	if(e.isTrusted == true && typeof(e.isTrusted)!=undefined){
		location.reload();
		return true;
	}
	if(event.state){
		location.reload();
	}else{
		var stateObj = { id: "state" };
		history.pushState(stateObj, '',window.location.href);
	}
}


$(window).load(function(){
	// $("ul.ui-autocomplete").wrap("<div class='autocompltouter'></div>");
	if($.ui !== undefined)
		$( "#searchKeyword" ).autocomplete( "close" );

	if(!(document.cookie.indexOf(city_cookie) >= 0)) {
		if($('.ratingPage').is(":visible")){ 
		  $('#divFadePopUp').show();
		  $('#multicity').show();
		}
	}
	
	/*$('.proceed-button').click(function(){
		var city = $('#cityname').val();
		if(city =='' || city == undefined){
			$.pgwModal({content:"<div class='errorPopup'><div class='msg'>Please select city.<br><br><a class='closedialog'><img src='"+images_path+"/btn_ok.jpg' border='0' /></a></div></div>"});
           $('.closedialog').click(function(){ $.pgwModal('close'); });
           return false;
		}
		eraseCookie(city_cookie);
		createCookie(city_cookie,city,"30");
		location.reload();
	});

	$('#changecity').change(function(){
		var city = $('#changecity').val();
		eraseCookie(city_cookie);
		createCookie(city_cookie,city,"1");
		location.reload();
    });*/

    $('.changecity_resp').click(function(e){
    	$('#divFadePopUp').show();
	  	$('#multicity').show();
	  	$('.rspbtn').trigger("click");
    });
});

function createCookie(name,value,days) {
	domain = LOCALBANYA.cookie_domain;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/"+((domain) ? "; domain=" + domain : "");
}

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

function eraseCookie(name) {
    createCookie(name,"",-1);
}

