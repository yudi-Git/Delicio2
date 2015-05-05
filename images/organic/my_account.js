$(document).ready(function() {
  cities  = JSON.parse(cities);
  /**
  * For on select value 
  * from drop down form submission
  * user/my_usuals
  */

  $('#date').change(function(){
      $('#form_date').submit();
  });

  SEARCH.placeholder("input#area");
  SEARCH.placeholder("input#earea");

  /**
  * Common validator for address.
  */
  if($.validator){
    $.validator.addMethod("loginRegex", function(value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\-\s\,\&\'\/\.]+$/i.test(value);
    }," Must contain only a-z A-Z 0-9 & , ' - / . ");

    $.validator.addMethod("username", function(value1, element1) {
        return this.optional(element1) || /^[a-zA-Z\s\&\.]+$/i.test(value1);
    }," Must contain only a-z A-Z & . ");

  /* To check old password match */
  $.validator.addMethod(
    "checkoldpassword",
    function(value, element) {  
      var _old_pass = $('input[name="old_pass"]').val();
      valid = true;
      $.ajax({
          type: "GET",
           url: base_url+"user/check_password",
          data: "password="+_old_pass,
          async: false, 
          dataType:"json",
       success: function(msg)
       {
          // if the old password did not match, it returns a string "error"
          if(msg.status === 'error'){            
            valid = false;  // already exists
          }
       }
     });
      return valid;       
    }, $.validator.messages.checkoldpassword
  );

  /*
  * Validating feedback.
  */
   $('#feedback_form').validate({
    rules: {
      feedback:{
        maxlength: 600,
        loginRegex:true
      }
    }
  });
}// END IF
  
  var address_rules = {
    loginRegex:true
  };

  /**
   * For colorbox popup
   * Pages used are
   * /colorbox/jquery.colorbox.js
   * colorbox.css   
   */

  // colorbox for edit address
  $(".inline").live('click',function(){
      $.pgwModal({
          content: "<div class='pen_box1' id='inline_content'>"+
          "<div class='editloader'>"+
          "<img src='"+images_path+"/loading.gif' alt='' />"+
          "</div>"+
          "<form name='add_form' action='"+base_url+"user/edit_address_form' method='post' id='edit_address_form'>"+
          "<div class='marbot'><label>City<span class='error'>*</span></label><br/>"+
          "<select id='ecity' name='city' required></select>"+
          "<label for='ecity' class='error'></label></div>"+

          "<div class='marbot areaautodrop'><label>Area<span class='error'>*</span></label>"+
          "<input type='text' id='earea' name='area' placeholder='Start typing to load area names from server' value='' required/>"+
           "<label for='earea' class='error'></label></div>"+   

          "<div class='marbot'><label>Pincode</label>"+
          "<input name='pincode' type='text' maxlength='6' id='epincode' required readonly>"+
          "<label for='epincode' class='error'></label></div>"+

          "<div class='marbot'><label>Street Name<span class='error'>*</span></label>"+
          "<input type='text' name='street_name' class='address_validation' id='street_name' maxlength='255' required>"+
          "<label for='street_name' class='error'></label></div>"+

          "<div class='marbot'><label>Building Name<span class='error'>*</span></label>"+
          "<input type='text' name='building_name' class='address_validation' id='building_name' maxlength='100' required>"+
          "<label for='building_name' class='error'></label></div>"+

          "<div class='marbot'><label>Flat No / Wing<span class='error'>*</span></label>"+
          "<input type='text' name='flat_no' class='address_validation' id='flat_no' maxlength='100' required>"+
          "<label for='flat_no' class='error'></label></div>"+       

          "<div class='marbot'>"+
          "<label>Landmark<span class='error'>*</span></label>"+
          "<input name='landmark' type='text' autocomplete='off' class='address_validation' id='elandmark' maxlength='255' required>"+
          "<label for='elandmark' class='error' ></label></div>"+

          /*"<div class='marbot areaautodrop'>Area<span class='error'>*</span>"+
          "<input type='text' id='earea' name='area' placeholder='Start typing to load area names from server' value='' required/>"+
          "<label for='earea' class='error'></label></div>"+           

          "<div class='marbot'>"+
          "Landmark<span class='error'>*</span>"+
          "<input name='landmark' type='text' autocomplete='off' id='elandmark' required>"+
          "<label for='elandmark' class='error' ></label></div><div class='marbot'>"+

          "Pincode<span class='error'>*</span>"+
          "<input name='pincode' type='text' maxlength='6' id='epincode' required>"+
          "<label for='epincode' class='error'></label></div>"+*/
          
          "<input type='hidden' name='address_form_hidden' value=''>"+
          "<input type='hidden' name='reload_url' value=''>"+
          "<input type='hidden' name='r_area' value=''>"+
          "<div class='buttoncenter'><input name='submit' type='submit' value='SUBMIT' class='pop_submit button'></div><br>"+
          "<center>Fields marked with <span class='star_icon'>*</span> are mandatory</center></form></div>"

      });

    //$("#edit_address_form").validate();
     var formcheck = {
        ecity_r : false,
        earea_r: false,
        epincode_r: false,
        street_name_r : false,
        building_name_r: false,
        flat_no_r: false,
        elandmark_r : false
    };

    $('#edit_address_form').validate({
      rules: {
         pincode: {
          minlength: 6,
          digits: true,
          number: true
         },
         street_name:address_rules,
         flat_no:address_rules,
         building_name:address_rules,
         landmark:address_rules
      },
      invalidHandler: function(event, validator) {     
        var errors = validator.numberOfInvalids();       
          if (errors) {
            $('.editloader').hide();            
          }
          else {
             $('.editloader').fadeIn();            
          }
        },
        success: function(label) {        

          if(label.attr('for') == 'ecity'){
             formcheck.ecity_r = true;
          }
           if(label.attr('for') == 'earea'){
               formcheck.earea_r = true;
          }
           if(label.attr('for') == 'epincode'){
               formcheck.epincode_r = true;
          }
           if(label.attr('for') == 'street_name'){
               formcheck.street_name_r = true;
          }
           if(label.attr('for') == 'building_name'){
               formcheck.building_name_r = true;
          }
           if(label.attr('for') == 'flat_no'){
               formcheck.flat_no_r = true;
          }
           if(label.attr('for') == 'elandmark'){
               formcheck.elandmark_r = true;            
          }

        }
    });

       $('#edit_address_form').submit(function(e){        
          if(formcheck.ecity_r == true && formcheck.earea_r == true && formcheck.epincode_r == true && formcheck.street_name_r == true && formcheck.building_name_r == true && formcheck.flat_no_r == true &&  formcheck.elandmark_r == true){
             $('.editloader').fadeIn();
          }

          if(!AREA.check('#earea', e)){
            $('.editloader').hide();
              if($('#earea').val()==''){
                $('label[for="earea"]').html("Please select area.").show();  
              }else{
                $('label[for="earea"]').html("The area aentered is incorrect or either we currently do not serve the area.").show();
              }
              
              return false;
          }
          $('.editloader').fadeOut(4000);
          return true;
          
       });


      var _self = $(this);
      var val = $(this).attr('data-id');
      var reload_url = $(this).attr('data-page_type');
      $('input[name="reload_url"]').val(reload_url);

      $('.closedialog').click(function(){ $.pgwModal('close'); });
      $('input[name="address_form_hidden"]').val(val);
      //$('#eaddress').text($(this).closest('.shipping_form').find('.address_ship_ad').html());
      //alert($(this).closest('.shipping_form').find('.address_ship_ad').find('.street_name').text());
      $('#street_name').val($(this).closest('.shipping_form').find('.address_ship_ad').find('.street_name').text());
      $('#building_name').val($(this).closest('.shipping_form').find('.address_ship_ad').find('.build_name').text());
      $('#flat_no').val($(this).closest('.shipping_form').find('.address_ship_ad').find('.flat_no').text());

      if(!$(this).closest('.shipping_form').find('.address_ship_ad').find('.flat_no').length ){
          $('#street_name').val($(this).closest('.shipping_form').find('.address_ship_ad').text());
      }

      $('#earea').val($(this).closest('.shipping_form').find('.add_area').html());
      $('#elandmark').val($(this).closest('.shipping_form').find('.add_landmark').text());
      $('#epincode').val($(this).closest('.shipping_form').find('.add_pincode').html()); 
      $('input[name="r_area"]').val($(this).closest('.shipping_form').find('.add_area').attr('data-area'));

      if($(this).closest('.shipping_form').find('.add_city').attr('data-id') == undefined){
        my_city = decodeURIComponent(readCookie(city_cookie));  
        if(!my_city){
          my_city='MQ==';/*Default city mumbai*/;
        }
      }else{
        my_city = $(this).closest('.shipping_form').find('.add_city').attr('data-id');
      }
      
      my_city_name = "";
      for (key in cities) {
          my_city_name +="<option value='"+key+"'";
          if(my_city == key){
            my_city_name +=" selected='selected' ";
          }
          my_city_name +=" >"+cities[key]+"</option>";
      }
      $('#ecity').append(my_city_name);  
        AREA.process_autocomplete('#earea');
        $('#ecity').change(function(){
          $('#earea').val("");
          $('#epincode').val("");
          AREA.process_autocomplete('#earea');
        });
     
       $('.closedialog').click(function(){ $.pgwModal('close'); });

  });

  /**
  * Common validation for address fields.
  */
/*  $('body').on('input', '.address_validation', function(){
      $(this).val($(this).val().replace(/[^a-zA-Z0-9,-/&'']/g, ""));
  });*/

  // colorbox for change password

  $(".change_pass").live('click',function(){
    
      $.pgwModal({content: "<div id='change_password'>"+
        "<div class='chplbl'>Change Password</div>"+
        "<form method='post' action='"+base_url+"user/changepassword' name='change_pass_form' id='change_pass_form'>"+
        "<div class='marbot'><label>Old password<span class='error'>*</span></label>"+
        "<input name='old_pass' type='password' id='old_pass' required>"+
        "<label for='old_pass' class='error'></label></div>"+
        "<div class=marbot><label>New password<span class='error'>*</span></label>"+
        "<input name='new_pass' type='password' id='new_pass' required>"+
        "<label for='new_pass' class='error'></label></div>"+
        "<div class='marbot'><label>Confirm new password<span class='error'>*</span></label>"+
        "<input name='confirm_pass' type='password' id='confirm_pass' required>"+
        "<label for='confirm_pass' class='error'></label></div>"+
        "<div class='buttoncenter'><input type='submit' id='btnchangepass' value='SUBMIT' class='pop_submit button'></div><br>"+
        "Fields marked with <span class='star_icon'>*</span> are mandatory</form></div>"});
        
      $('.closedialog').click(function(){ $.pgwModal('close'); });
     
      // Change password form
      $('#change_pass_form').validate({
        rules: {
          old_pass:{
            maxlength: 255,
            checkoldpassword: true
          },
          new_pass:{
            minlength: 5,
            maxlength: 255,
            noSpace:true
           },
           confirm_pass: {
            equalTo: '#new_pass',
            minlength: 5,
            maxlength: 255,
            noSpace:true
           }
        },
        messages: {
         old_pass: {
          checkoldpassword: "Wrong Password."      
          }
        }
      });
  });

  /**
  * For registration form validation
  * Page used is
  * jquery.validate.min.js
  */

  // In order to check if email address is in valid format

if($.validator){
  $.validator.addMethod(
      "multiemail",
      function (value, element) {
          var email = value.split(/[;,]+/); // split element by , and ;
          valid = true;
          for (var i in email) {
              value = email[i];
              valid = valid && $.validator.methods.email.call(this, $.trim(value), element);             
          }
          return valid;
      },
      $.validator.messages.multiemail
  );

  // In order to check if email address already registered

  $.validator.addMethod(
    "uniqueEmailAddress",
    function(value, element) {
      var _txtEmail = $('input[name="email"]');
      _txtEmail.closest('td').find('label').remove();
      valid = true;
      $.ajax({
          type: "POST",
           url: base_url+"user/check_email_exists",
          data: "email="+value,
          async: false, 
          dataType:"json",
       success: function(msg)
       {
          // if the user exists, it returns a string "true"
          if(msg.status === 'success'){            
            valid = false;  // already exists
          }
          /*else{
            
            if(_txtEmail.closest('td').find('label').length){
              _txtEmail.closest('td').find('label').show();
              _txtEmail.closest('td').find('label').html('<span style="color: #fff; font-size: 14px; font-weight: bold;">Available</span>');
            }
            else{
              _txtEmail.after('<label><span style="color: #fff; font-size: 14px; font-weight: bold;">Available</span></label>');
            }
          }*/
       }
     });
      return valid;       
    }, $.validator.messages.uniqueEmailAddress
  );
  
  /* To check area selected from dropdown or not */

  /*$.validator.addMethod(
    "checkareaselected",
    function(value, element) {
      var value = $.trim($('input[name="area"]').val());
      valid = true;
      $.ajax({
          type: "GET",
          url: base_url+"user/check_area",
          data: "area="+value,
          async: false, 
          dataType:"json",
         success: function(msg)
         {
            // if the user exists, it returns a string "true"
            if(msg.status === 'error'){            
              valid = false;  // already exists
            }
         }
       });
       return valid;
    }, $.validator.messages.checkareaselected
  );*/

  /* To check unique mobile number */
  $.validator.addMethod(
    "uniquemobile",
    function(value, element) {  
      var _txtEmail = $('input[name="mobile"]');
      _txtEmail.closest('td').find('label').remove();
      valid = true;
      $.ajax({
          type: "POST",
           url: base_url+"user/check_mobile_exists",
          data: "mobile="+value,
          async: false, 
          dataType:"json",
       success: function(msg)
       {
          // if the user exists, it returns a string "true"
          if(msg.status === 'success'){            
            valid = false;  // already exists
          }
       }
     });
      return valid;       
    }, $.validator.messages.uniqueEmailAddress
  );

   // In order to trigger error if above 3 functions fails

  $.validator.addMethod("noSpace", function(value, element) { 
     return value.indexOf(" ") < 0 && value != ""; 
  }, "No space allowed in password.");

   // Registration form
   var reg_rule_check = {
    email_r : false,
    pass_r: false,
    pass_r1: false
   };
  $('#form1').validate({
    rules: {
       email: {
        email: true,
        maxlength:100,
        uniqueEmailAddress: true
        },
       mobile: {
        minlength: 10,
        digits: true,
        maxlength:10,
        uniquemobile:true
       },
       password: {
        noSpace: true,
        minlength: 5
       },
       password1: {
        noSpace: true,
        minlength: 5,
        equalTo: '#password' 
       },
      iagree:{required:true}
    },
    messages: {
       email: {
        multiemail: "You must enter a valid email, or comma separate multiple",
        uniqueEmailAddress: "Emailid is already taken"      
        },
        mobile:{
          uniquemobile: "Mobile number is already taken.",
          minlength: "Please enter at least 10 digits.",
          maxlength: "Please enter at least 10 digits."
        },
        iagree:{
          required:"Please accept the Terms of Service."    
        }
    },
    success: function(label) {

        if(label.attr('for') == 'email'){
          reg_rule_check.email_r = true;
        }
        if(label.attr('for') == 'password'){
          reg_rule_check.pass_r = true;
        }
        if(label.attr('for') == 'password_again'){
          reg_rule_check.pass_r1 = true;
        }
        if(label.attr('for') == 'email'){
          label.addClass("valid").text("Available");
        }
    }
  });

  $('#form1').submit(function(e) {
    if( reg_rule_check.email_r == true  && reg_rule_check.pass_r == true && reg_rule_check.pass_r1 == true){
      if(detectCSSFeature('transition')){
        $('.signUpBtn').addClass('loading');  
      }
    }
  });

  $('#form2').validate({
    ignore:'',
    rules: {
       pincode: {
        minlength: 6,
        digits: true
       },
       phone:{digits:true, maxlength:11},
       fname:{username:true, maxlength:50},
       lname:{username:true, maxlength:50},
       street_name:address_rules,
       flat_no:address_rules,
       building_name:address_rules,
       landmark:address_rules
    }
  });

//Edit profile form
  $('#personal_form').validate({
    rules: {
       mobile: {
        digits: true,
        minlength: 10,
        maxlength:10,
        uniquemobile:true
       },
       fname: {
        maxlength:50,
        username:true
       },
       lname: {
        maxlength:50,
        username:true        
       },
       phone: {
        maxlength:11,
        digits: true
       }
    },
    messages: {
       
        mobile:{
          uniquemobile: "Mobile number is already taken.",
          minlength: "Please enter at least 10 digits.",
          maxlength: "Please enter at least 10 digits."
        }
      
    }
  });

    var forgot_pass_check = 0;
  /*
  * Validating forgot password.
  */
   $('#forgotP').validate({
    rules: {
      forgotemail:{ 
        email: true,
        maxlength: 100
      }
    },
    success: function(label) {
      if(label.attr('for') == 'email'){
          forgot_pass_check = 1;
        }
    }
  });

  $("#forgotP").submit(function(e) {
    if(forgot_pass_check == 1){
      var email = $("input[name=forgotemail]").val();
      $.ajax({
          type: "POST",
          url: base_url+"user/forgot_password",
          data: "email="+email,
          dataType:"JSON",
          success: function(data)
          {  
            if(data.msg == 'success'){
              $('.forget_pass_msg').html('Email has been sent to your Email-id. Please use those credentials to login.');
              $('#forg_pass').html('Email Sent');
              $('#forg_pass').attr('disabled', true);
            }
            else
            {
              $('.forget_pass_msg').html(data.error);
              $('.forgot_pass_sug').html('');
            }
          }
      });
    }
    e.preventDefault();
  }); 

} // END CONDITION
/** 
* For Autoload area
* pages used are autocomplete.search.js
*/
  var url = '';
  var AREA = {
    process_autocomplete : function($_this){
        if($($_this).attr("id")=="earea"){
          url = base_url+'user/get_areas?city='+$('#ecity').val();
        }else if($($_this).attr("id")=="area"){
          url = base_url+'user/get_areas?city='+$('#city').val();
        }else{
          url =base_url+'user/get_areas';
        }
        if($($_this).length){
            try{
                $($_this).autocomplete({
                  appendTo:".areaautodrop",
                  source : url,
                minLength: 3,
                focus: function( event, ui ) {
                  $($_this).val(ui.item.area);
                  return false;
                },
                select: function( event, ui ) {
                  $($_this).attr('rel', ui.item.id);
                  $($_this).attr('rev', ui.item.pincode);
                  $($_this).val(ui.item.area);
                  $('#epincode').val(ui.item.pincode);  
                  console.log($($_this).attr('rev'));       
                  return false;
                }
                })
                .data( "ui-autocomplete" )._renderItem = function(ul, item) {
                var label = item.area;
                var term = this.term.split(' ').join('|');
                var re = new RegExp("(" + $.ui.autocomplete.escapeRegex(term) + ")", "gi");
                label = label.replace(re,"<b>$1</b>");
                return $( "<li>" )
                .append( "<a>" + label + "</a>" )
                .appendTo( ul );
                };
            }catch(e){}
        }
    },
    check : function($_this, e){
        var checkReturn = true;
        //e.preventDefault();
        if($($_this).val() == ''){
            return false;
        }
        else{
          
          $('#submit').attr('disabled', true);
          $.ajax({
              type: "GET",
              url: base_url+'user/check_area',
              data: 'area='+$($_this).val(),
              dataType:"json",
              async:false
          }).done(function( json ){
              /*
              Commented as it remove textbox of area
              $($_this).parent().find('.error').remove();
              */
              if(json.status !== 'success'){
                  checkReturn = false;
                  $('#area_column3').html('<label for="area" class="error" id="area_column4">The area entered is incorrect or either we currently do not serve the area</label>').show();
                  $("#area_column4").show();
              }
          })
          .always(function(xhr, ajaxOptions){
              $('#submit').attr('disabled', false);
          });
        }

        return checkReturn;
    }
  }

  // On registration page

  AREA.process_autocomplete('#area'); 
  $('#form2').submit(function(e){
    if(!AREA.check('#area', e)){
          return false;
      }
      return true;
  });

  $('#city').change(function(e){
    $('#area').val("");
    $('#epincode').val("");
    AREA.process_autocomplete('#area'); 
  });
  // On edit address page
  
  AREA.process_autocomplete('#earea');
  /*$("#earea").live('input', function(){
    //alert('asa');
    AREA.process_autocomplete('#earea');
  });*/

});

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

