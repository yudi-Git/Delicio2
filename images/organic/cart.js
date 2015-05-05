
                                                                                 /*
 * LocalBanya JS FILE for managing SHOPPING CART
 * Also manages hotsellling, banyabargains and new products tag.
 */
$(document).ready(function(){ 

	//--------Select ------//
	$('select.pwt2').live('change',function(){
		var product = {
			_price : $(this).find('option:selected').data('price'),
			_mrp : $(this).find('option:selected').data('mrp'),
			_weight_code : $(this).find('option:selected').data('weight-code')
		}
		$(this).closest('.previous_order_table').find('.local_price').html(product._price);
		$(this).closest('.previous_order_table').find('.mrp_price').html(product._mrp);
		$(this).closest('.previous_order_table').find('.cart_add').data('weight-code', product._weight_code);
	});
	$('a.search_cart_add, .prod_imag_btn .cart_add').live({
		mouseenter: function () {
			$(this).find('img').attr('src', images_path+'/srcbtnb.png');
	    },
	    mouseleave: function () {
	    	$(this).find('img').attr('src', images_path+'/srcbtnr.png');
	    }
	});
});

	function get_sku_count(call_from) {
		var sku_count = new Array();
		$('.tblcart tr').each(function(k){
			sku_count[k] = [$(this).find('a.delprod').data('id')+"{||}"+$(this).find('a.delprod').data('weight-code'), Number($(this).find('input.qtybox').val())];
		});

		updateAddOption(call_from,'product-inner','add-btn','add-btn-after',sku_count);
		// if(document.getElementsByClassName('product_detail_view_content')){
		if(document.querySelectorAll('product_detail_view_content')){
			updateAddOption(call_from,'product_detail_view1','add-btn-details','add-btn-after',sku_count);
			updateAddOption(call_from,'pd_detail_small','add-btn-small-details','add-btn-small-details-after',sku_count);	
		}		
	}

	/* Common function for applying */
	function updateAddOption(call_from,container_class,remove_class,add_class,sku_count){
		//console.log(sku_count);
		if(call_from == 'page_load'){
			$('.'+container_class).each(function(i){
				for(var s = 0 ; s < sku_count.length; s++){
					if(jQuery.inArray($(this).find('a.cart_add').data('id')+"{||}"+$(this).find('a.cart_add').data('weight-code'), sku_count[s]) == 0){
							$(this).find('.cart_add').removeClass(remove_class).addClass(add_class).html('');
							$(this).find('.cart_add').html('<span class="sku_count">'+sku_count[s][1]+'</span><span class="sku_total"> In Cart</span>');
							break;
					} // END IF
				} // END FOR
			});
		}else{
			$('.'+container_class).each(function(i){
				if(sku_count.length == 0){
					if($(this).find('.'+add_class).data('id') && $(this).find('.'+add_class).data('id') != ''){
							$(this).find('.cart_add').addClass(remove_class).removeClass(add_class).html('Add');
						}
				}
				for(var s = 0 ; s < sku_count.length; s++){
					if(jQuery.inArray($(this).find('a.cart_add').data('id')+"{||}"+$(this).find('a.cart_add').data('weight-code'), sku_count[s]) == 0){
						if($(this).find('.'+remove_class).data('id') && $(this).find('.'+remove_class).data('id') != ''){
							$(this).find('.cart_add').removeClass(remove_class).addClass(add_class).html('<span class="sku_count">'+sku_count[s][1]+'</span><span class="sku_total"> In Cart</span>');
							
						}else{
							$(this).find('.cart_add').find('.sku_count').html(sku_count[s][1]);
						}
						break;
					}else{
						if($(this).find('.'+add_class).data('id') && $(this).find('.'+add_class).data('id') != ''){
							$(this).find('.cart_add').addClass(remove_class).removeClass(add_class).html('Add');
						}
					}// END IF
			  	}// END FOR
		  	});
		}
	}

var CART = {
	self : null,
	sUrl : '',
	params : {},
	bundleItems : {},
	loader : 'default',//product_name
	displayLoader : function(){
		if(CART.loader === 'product_name' && CART.self !== null){
			$('.addproductMessage').removeClass('hide');
			return "<span>"+CART.self.data('name')+"</span> added to your cart.";
		}
		else{
			return 'Please wait for a moment until Banya updates your cart.';
		}
	},
    validate : function(event){
        if(event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
            return;
        }
        else{
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }
        }
    },
	count : function(){
		var count = 0;
		$('table.tblcart tbody tr').each(function(i){
			count = Number(count) + Number($(this).find('.qtybox').val());
			i++;
		});
		
		return count;
	},
	setError : function(msg){
		if(msg === undefined || msg === ''){
			return false;
		}
		$('.cart_alert').remove();
		return '<div class="cart_alert">'+msg+'</div>';
	},
	complete: function(){
		$('.addproductMessage').fadeOut();
        $('#cartloader').fadeOut('slow');
        
    	CART.self = null;
		CART.loader = 'default';
	},
	error: function(msg){
		$('.cartarea').before(CART.setError('Oops! some error occured while processing.'));
		$('.cartContainer').slideDown();
		$('.targetDiv').addClass('active');
	},
	requestHandler : function(e){
		
		if(CART.sUrl === 'delete'){
			$('.cartarea').before(CART.setError('<div class="delete_cart">Please wait for a moment until Banya updates your cart.</div>'));
		}else{
			$('.addproductMessage').html(CART.displayLoader());
			$('.addproductMessage').fadeIn('fast');
		}
		$('#cartloader').fadeIn('fast'); 
        $.ajax({
            type 	: "POST",
            url 	: base_url+"cart/"+CART.sUrl,
            dataType: 'JSON',
            data 	: CART.params,
            error 	: function(xhr, ajaxOptions, thrownError){
            	CART.error(xhr.responseText);
            },
            complete: function(xhr, ajaxOptions){
            	CART.complete();
            }
        }).done(function(msg){
        	CART.responseHandler(msg);
        });
        
        //LB_TRACK.mergeParams(params);
	},
	responseHandler : function(msg){
		if(msg === null)return;
		if(msg.status === 'success'){
			if($('.cartWrapper').length){
        		$('.cartWrapper').html(msg.response);
	        	if (navigator.userAgent.search("MSIE") <= 0) {

		        	$("#mycustomscrollC").mCustomScrollbar("update");

					$("#mycustomscrollC").mCustomScrollbar({advanced: {updateOnContentResize: true}});
					$("#mycustomscrollC").hover(function(){
						$(document).data({"keyboard-cart":"enabled"});
						$(this).addClass("keyboard-cart");
					},function(){
						$(document).data({"keyboard-cart":"disabled"});
						$(this).removeClass("keyboard-cart");
					});

					
				}else{
						
				}
        	}else{
        		$('.cartbox').html(msg.response);
        	}
        	var call_from = 'after_ajax_call';
        	get_sku_count(call_from);
        	if($.isNumeric(msg.message) && msg.message > 0){
        		var _prod_name = 'this';
        		if(CART.self !== null){
        			_prod_name = "<span style='color:#52b5a8'>"+CART.self.data('name')+"</span>";
        		}

				$.pgwModal({
				    content: "<div class='class_for_search errorPopup'><h3>"+
        				"<span class='class_for_search'>Oops!!</span></h3>"+
        				"<div class='msg'>Banya can let you add only "+msg.message+
        				" units of "+_prod_name+" product "+
        				"to the cart/your bill at a time. Please call our customer"+
        				" support at 1860 3133 122 for any assistance.<br><br>"+
        				"<a class='closedialog'>OK</a></div></div>"
				});
				$('.closedialog').click(function(){ $.pgwModal('close'); });
        	}
        	else{
        		$('.cartarea').before(CART.setError(msg.message));
        	}
        }
        else if(msg.status === 'error'){
        	$('.cartarea').before(CART.setError(msg.message));
        }
        $('.carttotal').html(CART.count());
        CART.toggleCart();
	},
    toggleCart : function(){
    	if($('.cart_alert').length > 0){
        	$('.cartContainer').slideDown('fast');
			$('.targetDiv').addClass('active');
        }
    }
}

$(document).ready(function(){
	$('.carttotal').html(CART.count());

    CART.toggleCart();

	$('.cart_add').live('click', function(){
		CART.sUrl = 'add';
		CART.loader = 'product_name';
		CART.self = $(this);
		if($.isEmptyObject(CART.bundleItems)){
			CART.params = {
				prod_id 		: $(this).data('id'),
				weight_code		: $(this).data('weight-code'),
				quantity 		: 1
			};
		}
		else{
			CART.sUrl = 'add_multiple';
			CART.params = CART.bundleItems;
		}
		CART.requestHandler();
	});
		/*Below code created for bundle break add LOC 135 18 July 2014 */
		$('.add-btn-small').live('click', function(){
		CART.sUrl = 'add';
		CART.loader = 'product_name';
		CART.self = $(this);
		if($.isEmptyObject(CART.bundleItems)){
			CART.params = {
				prod_id 		: $(this).data('id'),
				weight_code		: $(this).data('weight-code'),
				quantity 		: 1
			};
		}
		else{
			CART.sUrl = 'add_multiple';
			CART.params = CART.bundleItems;
		}
		CART.requestHandler();
	});

	$('.delprod').live('click', function(){
		CART.sUrl = 'delete';
		CART.params = {
			prod_id 		: $(this).data('id'),
			weight_code		: $(this).data('weight-code')
		};
		CART.requestHandler();
	});

	$('.qtybox').live('change', function(){
		CART.sUrl = 'update';
		CART.self = $(this);
		if($(this).val()==0){$(this).val(1);}
		CART.params = {
			prod_id 		: $(this).data('id'),
			weight_code		: $(this).data('weight-code'),
			quantity 		: $(this).val()
		};
		CART.requestHandler();
	});

	
	$('.search_cart_add').live('click', function(e){
		e.preventDefault();	
		CART.sUrl = 'add';
		CART.loader = 'product_name';
		CART.self = $(this);
		CART.params = {
			prod_id 		: $(this).data('id'),
			weight_code		: $(this).data('weight-code'),
			quantity 		: $(this).closest('.ser_1').find('input.ser_3').val()
		};
		CART.requestHandler();
		return false;
	});

    $(".qtybox").live("keydown", function(e) {
       CART.validate(e);
    });


    $('.cancel_prod').live('click', function(e){
    	var _self = $(this);
    	var msg = "Are you sure you want to delete this product?"+
		" <br><br>Deleting it the would result into "+
		" cancellation of bundle and rates would be "+
		" applicable according to individual products.<br>";
		LB_ALERT.confirm('', msg, function(res){
				if(res==true){
				  	_self.closest('.bundle_item').fadeOut(300, function() {
				  				$(this).remove();//$(".bx-clone").remove();
				  				$('.jcarousel_imag .prod_clo_arw .cancel_prod').remove();
				  				$('.jcarousel_imag .bundle-item-add').show();
				  				$('.product_detail_inner1 .cart_add').hide();
				  				$('.product_detail_inner2 .cart_add').hide();
				  				$('.product_detail_inner1 .total_amt0').wrap("<strike>");
				  				$('.product_detail_inner2 .total_amt0').wrap("<strike>");
				  			}
				  		);
				  	
			  	}
			}
		);
		
    });

	$(window).bind("load", function() {
		if(navigator.userAgent.search("MSIE") >= 0){
			
		}
		//alert( $.browser.msie);
		if (navigator.userAgent.search("MSIE") <= 0 ) {
			//alert('I am not IE browser');
		$("#mycustomscrollC").mCustomScrollbar({
		    scrollButtons:{
		        enable:true
		    },
		    advanced:{
		        autoScrollOnFocus: false
		    }	
		});
		$("#mycustomscrollC").mCustomScrollbar("update");
		$("#mycustomscrollC").mCustomScrollbar({advanced: {updateOnContentResize: true}});
		$("#mycustomscrollC").hover(function(){
			$(document).data({"keyboard-cart":"enabled"});
			$(this).addClass("keyboard-cart");
		},function(){
			$(document).data({"keyboard-cart":"disabled"});
			$(this).removeClass("keyboard-cart");
		});
		$(document).keydown(function(e){
			if($(this).data("keyboard-cart")==="enabled"){
				var activeElem=$(".keyboard-cart"),
					activeElemPos=Math.abs($(".keyboard-cart .mCSB_container").position().top),
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

			
		}
		else{
			
		}
		var call_from = 'page_load';
		get_sku_count(call_from);
		
	});

    var li_count = $('.left_nav_cat').length;
	$('.left_nav_cat').each(function(k){
		var sucat_li_count = 0;
		if($(this).find('ul.sub_cat_ul li').length > li_count){
			var diff_count = (($(this).find('ul.sub_cat_ul li').length - li_count)*32) + 7 ;
			var diff_count = '-'+diff_count+'px';
			$(this).find('ul.sub_cat_ul').css({'top':diff_count});
		}
		li_count--;
	});

          $(".left_nav_cat").hover(
            function() {
                var sub_cat_last_top_position;
                sub_cat_ul = $(this).find('ul.sub_cat_ul');

                sub_cat_last_li = $("li:last-child", sub_cat_ul);
                sub_cat_last_li_top = $(sub_cat_last_li).offset().top;
                sub_cat_last_li_position = sub_cat_last_li_top - $(window).scrollTop();
                sub_cat_height = sub_cat_ul[0].childElementCount * 27;

                eTop = $(this).offset().top;
                cat_position = eTop - $(window).scrollTop();
                
                window_height = $(window).height();
                bottom_position = sub_cat_height - 10;

                if(sub_cat_last_li_position > window_height) {
                    sub_cat_ul.css({'top': '-' + bottom_position + 'px'});
                }

                sub_cat_first_li = $("li:first-child", sub_cat_ul);
                sub_cat_first_li_top = $(sub_cat_first_li).offset().top;
                sub_cat_first_li_position = sub_cat_first_li_top - $(window).scrollTop();
            }
        );
});

/* Function to hide and show the top green bar */
function green_cat_toggle(toggle_type, toggle_on){
	if($(window).scrollTop() < 50 || toggle_on === 1){
			if(toggle_type == 0){			
				$('.topnav').stop().fadeOut();		    
			}else{			
				$('.topnav').fadeIn();					 	
			}
		}
		
}

//======================= Login / Sign Up Toggle =======================//
$(document).ready(function(){
	jQuery(function ($) {
	    $('.showSingle').click(function (e) {
	    	
			var itemid = '#div' + $(this).attr('target'); //id of the element to show/hide.

	        //Show the element if nothing is shown.
	        if ($('.active').length === 0) {
	        	//green_cat_toggle(0, 0);
	        	$(itemid).slideDown();
	            $(itemid).addClass('active');
	            //Hide the element if it is shown.

	            $('#login, #mobile').focus();
	            
	        } else if (itemid == "#" + $('.active').attr('id')) {
	        	//green_cat_toggle(1, 0);
	        	$('.active').slideUp();
	            $(itemid).removeClass('active');

	            //Otherwise, switch out the current element for the next one sequentially.
	        } else {
	            $('.active').slideUp(function () {
	                $(this).removeClass('active');
	                if ($(".targetDiv:animated").length === 0) {
	                	//green_cat_toggle(0, 0);
	                	$(itemid).slideDown();
	                    $(itemid).addClass('active');
	                    $('#login, #mobile').focus();
	                }
	            });
	        }

	    });
	});

	$('.closecross').click(function () {
		$('.active').slideUp();
		$('.targetDiv').removeClass('active');
	});

	//=============== toggle cart on click of cancel image =================//
	$('body').on('click', 'a.togglecart', function() {
		$(".cartContainer").slideUp();
		$('.targetDiv').removeClass('active');
	});

	$('.needHelp').click(function(e){
		if($(e.target).closest('.dropdown-needhelp').length === 0){
			if($('.dropdown-needhelp').css('display') == 'block'){
				//green_cat_toggle(1, 0);
			}else if($('.dropdown-needhelp').css('display') == 'none'){
				//green_cat_toggle(0, 0);
			}
		}
	});

	$('.setting').click(function(e){
		if($(e.target).closest('.dropdown-setting').length === 0){
			if($('.dropdown-setting').css('display') == 'block'){
				//green_cat_toggle(1, 0);
			}else if($('.dropdown-setting').css('display') == 'none'){
				//green_cat_toggle(0, 0);
			}
		}
	});

	$('.timeslot').click(function(e){
		if($(e.target).closest('.dropdown-timeslot').length === 0){
			if($('.display_slots').css('display') == 'none'){
				//green_cat_toggle(1, 0);
			}else if($('.display_slots').css('display') == 'block'){
				//green_cat_toggle(0, 0);
			}
		}
	});

	$('.cartContainer').bind( 'mousewheel DOMMouseScroll', function ( e ) {
	    var e0 = e.originalEvent,
	        delta = e0.wheelDelta || -e0.detail;
	    
	    this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
	    e.preventDefault();
	});

});
//======================= X 0 X =======================//

