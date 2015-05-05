function tabs(a,b){
	for(var i=1; i<=b; i++)	{
		if($("#ctab"+i).length){
			if(i == a) {
					document.getElementById("ctab"+i).className = "gL2_14";
					document.getElementById("showtab"+i).style.display = "block";
			}else{
					document.getElementById("ctab"+i).className = "bl_2_14";
					document.getElementById("showtab"+i).style.display = "none";
			}
		}
	}
}

function tabs_popup(a,b){
	for(var i=1; i<=b; i++)	{
		if($("#ctab_popup"+i).length){
			if(i == a) {
					document.getElementById("ctab_popup"+i).className = "gL2_14_popup";
					document.getElementById("showtab_popup"+i).style.display = "block";
			}else{
					document.getElementById("ctab_popup"+i).className = "bl_2_14_popup";
					document.getElementById("showtab_popup"+i).style.display = "none";
			}
		}
	}
}

function tag_icons_switch(){
	var mainsku_dataid = $('#sku_add_main').data('id')+$('#sku_add_main').data('weight-code');
		var sku_tags = 'sku_tags'+mainsku_dataid;
		$('.tab_con_text_descri .tags_expert_speak').each(function(){
			if($(this).hasClass(sku_tags)){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
}

function hide_desc(no)
{
	var str = "partial_desc_"+no;
	var str1 = "full_desc_"+no;
	var str2 = "desc_read_more_"+no;
	//alert(no, str, str1);
	document.getElementById(str).style.display = "none";
	document.getElementById(str1).style.display = "block";
	document.getElementById(str2).style.display = "none";
}

function swap_multiple_images(small_prod_dom, main_prod_dom, thisDetails) {
	small_prod_json = JSON.parse(small_prod_dom.html());
	small_prod_dom.html(main_prod_dom.html());
	main_prod_dom.html(JSON.stringify(small_prod_json));
	product_thumb_li = $(".product_thumbs li")[0];
	images_array = undefined;

	$(".product_thumbs ul li").removeClass("selected");
	$(".product_thumbs ul").html("");

	if(small_prod_json.length == 0 ){
		new_product_thumb_li = $(product_thumb_li).clone();
		$("img", new_product_thumb_li).attr("src", "");
		$("img", new_product_thumb_li).attr("rel", "");
		$(".product_thumbs ul").append(new_product_thumb_li);
		$('.probigpop').attr('href', '');
	}

	for(i = 0; i < small_prod_json.length; i++) {
		new_product_thumb_li = $(product_thumb_li).clone();
		images_array = small_prod_json[i];
		$("img", new_product_thumb_li).attr("src", images_array["100x75"]);
		$("img", new_product_thumb_li).attr("rel", images_array["286x224"]);
		$(".product_thumbs ul").append(new_product_thumb_li);
		if(images_array["286x224"] === thisDetails._img) {
			new_product_thumb_li.addClass("selected");
			if (typeof images_array == 'undefined') {
				$('.probigpop').attr('href', '');
			} else {
				$('.probigpop').attr('href', images_array["286x224"]);
			}
		}
	}
}

var PROD_DETAIL = {
	swapProd : function($_this, $_main, $_type){
		$($_this).live('click', function(e){
			$('.sku-title').hide();
			var this_small = '';
			if($_type == 'popup_details'){
				this_small = $(this).closest('.pd_detail_small_2');
			}else{
				this_small = $(this).closest('.pd_detail_small_1');
			}
			e.preventDefault();
			/* For main product container */
			var out_of_stock_main = 0;
			if($($_main).find('.cart_add').data('weight-code')){
					var weight_code_main = $($_main).find('.cart_add').data('weight-code');
			}else{
				var weight_code_main = $($_main).find('.notify_details').data('weight-code');
				out_of_stock_main = 1;
			}

			/* For small product container */
			var out_of_stock_small = 0;
			if(this_small.find('.cart_add').data('weight-code'))
			{
				var weight_code_small	= this_small.find('.cart_add').data('weight-code');
			}else{
				var weight_code_small	= this_small.find('.ofs_small').data('weight-code');
				out_of_stock_small = 1;
			}
			var thisDetails = {
				_img 		: $(this).data('img'),
				_img_data 	: $(this).find('img').attr('src'),
				_lmt_stck	: this_small.find('.lStock-small-lstock').length,
				_weight 	: this_small.find('.pd_detail_de').html(),
				_off		: this_small.find('.discount-small-dis').html(),
				_url		: this_small.find('.pd_detail_de').attr('href'),
				_price 		: this_small.find('.total_amt2').html(),
				_amt   		: this_small.find('.total_amt3').html(),
				_new 		: this_small.find('.tag-small-new').html(),
				_hotselling : this_small.find('.tag-small-hot').html(),
				_featured 	: this_small.find('.tag-small-mooch').html(),
				_wghtcode	: weight_code_small,
				_desc		: $(this).closest('.product_detail_view_tab').find('.tab_con_text_descri').html(),
				_produrl	: this_small.find('.prod_img_link').attr('href'),
				_sku_desc	: $(this).data('sku-desc'),
				_outofstock : out_of_stock_small,
				_sku_desc_container : this_small.find('.detail_sku_desc').html(),
				_multiple_images_json : this_small.find('.thumbs_json').html()
			}
			var mainDetails = {
				_img 		: $($_main).find('.prod_img').data('img'),
				_img_data 	: $($_main).find('.prod_img').attr('src'),
				_lmt_stck	: $($_main).find('.lStockIn-lstock').length,
				_weight 	: $($_main).find('.product_detail_in_gm').html(),
				_url		: $($_main).find('.product_detail_in_gm').data('url'),
				_off		: $($_main).find('.discountIn-dis').html(),
				_price		: $($_main).find('.total_amt0').html(),
				_amt   		: $($_main).find('.total_amt1').html(),
				_new 		: $($_main).find('.tagIn-new').html(),
				_hotselling : $($_main).find('.tagIn-hot').html(),
				_featured 	: $($_main).find('.tagIn-mooch').html(),
				//_limited 	: $($_main).find('.lStockIn-lstock').html(),
				_wghtcode	: weight_code_main,
				_desc		: $($_main).find('.tab_con_text_descri').html(),
				_produrl	: $($_main).find('.big_product_img').data('url'),
				_sku_desc	: $('.tab_con_text_descri').find('h4').html(),
				_outofstock : out_of_stock_main,
				_sku_desc_container : $($_main).find('.detail_sku_desc').html(),
				_multiple_images_json : $($_main).find('.thumbs_json').html()
			}
			
			//alert(JSON.stringify(thisDetails));
			$('.sku-title').each(function(){
				if($(this).data('weight-code') == thisDetails._wghtcode){
					$(this).show();
				}
			});

			$($_main).find('.detail_sku_desc').html(thisDetails._sku_desc_container);
			this_small.find('.detail_sku_desc').html(mainDetails._sku_desc_container);
			// replace this details
			if(out_of_stock_main != 0 || out_of_stock_small != 0){	
				if(mainDetails._outofstock == 0){
					this_small.find('#notify_small').removeClass('notify_details_small');
					this_small.find('#notify_small').addClass('addButtonSmall');
					this_small.find('.ofs_small').addClass('cart_add add-btn-small-details').removeClass('ofs_small');
					this_small.find('.add-btn-small-details').html('Add');
				}else{
					if(out_of_stock_main != 1 || out_of_stock_small != 1){
						this_small.find('.addButtonSmall').addClass('notify_details_small').removeClass('addButtonSmall');
						this_small.find('.notify_details_small').attr('id', 'notify_small');
						this_small.find('.add-btn-small-details').addClass('ofs_small').removeClass('cart_add').removeClass(' add-btn-small-details');
						this_small.find('.ofs_small').html('Out of stock');
						this_small.find('.notify_details_small').insertAfter(this_small.find('.prod_imag_rup'));
					}
				}

				if(thisDetails._outofstock == 0){
						$($_main).find('.addButton').addClass('price_detail_3');
						$($_main).find('.notify_details').addClass('cart_add add-btn-details').removeClass('notify_details');
						$($_main).find('.cart_add').html('Add');
				}else{
					if(out_of_stock_main != 1 || out_of_stock_small != 1){
						$($_main).find('.addButton').removeClass('price_detail_3');
						$($_main).find('.cart_add').removeClass('add-btn-details').addClass('notify_details').removeClass('cart_add');
						$($_main).find('.notify_details').html('Out of stock');
					}
				}
			}
			$(this).find('img').attr('src', mainDetails._img);
			$(this).data('img', mainDetails._img_data);
			this_small.find('.pd_detail_de').html(mainDetails._weight);

			if(mainDetails._off)
			{
				if(this_small.find('.discount-small-dis').length)
				{
					this_small.find('.discount-small-dis').html(mainDetails._off);
				}
				else
				{
					this_small.find('.rbn_2').append('<div class="discount-small-dis" >'+mainDetails._off+'</div>');
				}

				if(this_small.find('.discount-small-dis').find('img').length){
					this_small.find('.discount-small-dis').removeClass('dis3');
				}else{
					this_small.find('.discount-small-dis').addClass('dis3');
				}

			}
			else
			{
				this_small.find('.discount-small-dis').remove();	
			}

			this_small.find('.total_amt2').html(mainDetails._price);


			if($.trim(mainDetails._amt) == ''){
				this_small.find(".total_saving_small_view-1").find('.total_rupee_small_view').html("");
				this_small.find('.total_amt3').html(mainDetails._amt);
			}else{
				this_small.find('.total_amt3').html(mainDetails._amt);
			}

			this_small.find('.rbn_brand_2').html(mainDetails._new);
			this_small.find('.rbn_brand_4').html(mainDetails._featured);
			// set tags

			PROD_DETAIL.setSelfTags(mainDetails._new, 'tag-small-new', '', this_small.find('.rbn_2'),'2','New','pl3');
			PROD_DETAIL.setSelfTags(mainDetails._hotselling, 'tag-small-hot', '', this_small.find('.rbn_2'),'2','Hot','pl4');
			PROD_DETAIL.setSelfTags(mainDetails._featured, 'tag-small-mooch', 'mooch-b.png', this_small.find('.rbn_2'),'2','','pl3');
			PROD_DETAIL.setSelfTags(mainDetails._lmt_stck, 'lStock-small-lstock', '', this_small.find('.rbn_2'),'2','','');


			//PROD_DETAILS.setSelfTag(mainDetails._off, 'rbn_brand_1', this_small);
			this_small.find('.pd_detail_de').attr('href', mainDetails._url);
			//this_small.find('.limited').html(mainDetails._limited);
			if(out_of_stock_main == 0){
				this_small.find('.cart_add').data('weight-code',mainDetails._wghtcode);
			}else{
				this_small.find('.ofs_small').data('weight-code',mainDetails._wghtcode);
			}
			this_small.find('.prod_img_link').attr('href', mainDetails._produrl);
			if(mainDetails._sku_desc){
				$(this).data('sku-desc', mainDetails._sku_desc);
			}
			else{
				$(this).data('sku-desc', '');
			}

			// replace main details
			$($_main).find('.prod_img').attr('src', thisDetails._img);
			$($_main).find('.prod_img').data('img', thisDetails._img_data);
			$($_main).find('.product_detail_in_gm').html(thisDetails._weight);

			if(thisDetails._off){
				if($($_main).find('.discountIn-dis').length)
				{
					$($_main).find('.discountIn-dis').html(thisDetails._off);
				}
				else
				{

					$('<div class="discountIn-dis" >'+thisDetails._off+'</div>').insertAfter($($_main).find(".prod_weight_div"));
				}


				if(!$($_main).find('.discountIn-dis').find('img').length){
					$($_main).find('.discountIn-dis').addClass('dis2');
				}else{
					$($_main).find('.discountIn-dis').removeClass('dis2');
				}
			}
			else{
				$($_main).find('.discountIn-dis').remove();
			}

			$($_main).find('.total_amt0').html(thisDetails._price);

			if(thisDetails._amt == ''){
				$($_main).find('.total_saving_pro_view-1').find('.total_rupee_pro_view').html('');
			}else{
				$($_main).find('.total_saving_pro_view-1').find('.total_rupee_pro_view').html('Rs. ');
			}

			$($_main).find('.total_amt1').html(thisDetails._amt);

			PROD_DETAIL.setSelfTags(thisDetails._new, 'tagIn-new', '', $($_main),'1','New','pl9');
			PROD_DETAIL.setSelfTags(thisDetails._hotselling, 'tagIn-hot', '', $($_main),'1','Hot','pl10');
			PROD_DETAIL.setSelfTags(thisDetails._featured, 'tagIn-mooch', 'mooch-b.png', $($_main),'1','','pl8');
			PROD_DETAIL.setSelfTags(thisDetails._lmt_stck, 'lStockIn-lstock', '', $($_main),'1','','');

			$($_main).find('.product_detail_in_gm').data('url', thisDetails._url);
			$($_main).find('.limited').html(thisDetails._limited);
			if(out_of_stock_small == 0){
				$($_main).find('.cart_add').data('weight-code', thisDetails._wghtcode);
			}else{
				$($_main).find('.notify_details').data('weight-code', thisDetails._wghtcode);
			}
			$($_main).find('.big_product_img').data('url', thisDetails._produrl);
			if(thisDetails._sku_desc){
				if($('.tab_con_text_descri').find('h4').length){
					$('.tab_con_text_descri').find('h4').html(thisDetails._sku_desc);
				}
				else{
					$('.tab_con_text_descri').find('h3').after('<h4>'+thisDetails._sku_desc+'</h4>');
				}
			}
			else{
				$('.tab_con_text_descri').find('h4').html('');
			}
			
			swap_multiple_images(this_small.find('.thumbs_json'), main_prod_dom = $($_main).find('.thumbs_json'), thisDetails);
			get_sku_count('');
			tag_icons_switch();
		});
	},
	setImg : function(_img, _extra_class){
		return '<img class="'+_extra_class+'" src="'+img_path+'/'+_img+'"/>';
	},
	setSelfTags : function(_tag, _class, _img, _self, _section, _current_tag, _extra_class){

		if(_section == '1'){

			if(_tag){
				if(_self.find('.'+_class).length != 0){
					//_self.find('.'+_class).html(PROD_DETAIL.setImg(_img, _extra_class));
				}
				else{

					if(_img != ''){
						$('<div class="'+_class+'">'+PROD_DETAIL.setImg(_img, _extra_class)+'</div>').insertAfter(_self.find(".prod_weight_div"));
					}else{
						$('<div class="'+_class+'"><div class="'+_extra_class+'">'+_current_tag+'</div></div>').insertAfter(_self.find(".prod_weight_div"));
					}
					
				}
			}
			else{
				_self.find('.'+_class).remove();
			}
		}else{
			if(_tag){
				if(_self.find('.'+_class).length  != 0){
					//_self.find('.'+_class).html(PROD_DETAIL.setImg(_img));
				}
				else{

					if(_img != ''){
						_self.append('<div class="'+_class+'">'+PROD_DETAIL.setImg(_img, _extra_class)+'</div>');
					}else{
						_self.append('<div class="'+_class+'"><div class="'+_extra_class+'">'+_current_tag+'</div></div>');
					}
				}
			}
			else{
				_self.find('.'+_class).remove();
			}
		}
		
	}
}

$(document).ready(function(){
	$('.shelf_in').wrap('<li style="width: auto;"></li>');
	if($.isFunction($.fn.jcarousel))
		$('.mycarousel').jcarousel();
	$("img.lazy").lazyload({effect : "fadeIn", container : $('.mycarousel'),
		error : function(self, settings){
			$(this).attr("src", $(this).attr('rel'));
		}
	}).removeClass('lazy');
	
	PROD_DETAIL.swapProd('.pd_detail_small_1 .prod_img_link', '.product_detail_inner1', 'default');

	on_error = "$(this).attr('src', '/themes/default/images/notavailable_286X224.jpg');";
	// $(".fancybox").fancybox();

	$('.probigpop').click(function(e){
		var bimg = $(this).find('img').attr('src');
		e.preventDefault();
		$.pgwModal({
		    content: '<img class="bimg" src='+ bimg +' alt="" onerror="' + on_error + '"/>',
		    title: ''
		    
		});
		$('.pm-body').addClass('prodetailpop');
		$('.pm-content').addClass('imgcenter');
		// var propopheight = $(window).height() - 65;
		
		//  if ( ($(window).height()) > 321) { 
		//  	console.log(propopheight);
		//  }
		//  else{
		//  	console.log('height issue');
		//  }
		//$('.imgcenter').css({'height': });

	});

	$('#ctab2').click(function(){
		$('.product_detail_small_pd').hide();
		tag_icons_switch();
	});
});

$(document).click(function(e){
	if(!$(e.target).closest('.product_detail_view_tab #ctab2').length && !$('.tags_expert_speak').is(':visible')){
		$('.product_detail_small_pd').show();
	}
});

$(document).ready(function(){
	$(".product_thumbs li").live('click', function(e){
		big_image_url = $("img", this).attr("rel");
		$(".big_product_img .prod_img").attr("src", big_image_url);
		$(".product_thumbs li").removeClass("selected");
		$('.probigpop').attr('href', big_image_url);
		$(this).addClass("selected");
	});
});