  function searchShip(){
      var shipname=check_para(encodeURI($('#shipname').val()));
      if(shipname.length == 0){
          alert('please type shipname');
          $("#shipname").focus();
          return false;
      }
      $.ajax({
          url: site_url+'/shipdata/search_ship/en/'+shipname,
          success:function(data){
              if(data == 'no'){
                  $('#result').html('<div class="text-center"> <p style="font-size:17px;border:1px dotted-bottom #ccc;"> <strong> Sorry, no result.</strong></p></div>');
              }else
                  $('#result').html(data);
              $('#modal-2').modal('show');
          }
      });
  }
function check_para(parameter)
{
  "use strict";
  if(!parameter.match(/\&|\$|\{|\}|\(|\)|\#|\!|\;|<|>|\,|\.|\/|\*|\^/g)){
    return parameter;
  }else{
    alert('no type special chars!');
    return;
  }
}

function isSymbols(parameter)
{
  "use strict";
  if(parameter.match(/\~|\`|\!|\@|\^|\&|\*|\(|\)|\_|\=|\+|\{|\}|\[|\]|\;|\:|\"|\'|\<|\>|\,|\.|\?|\/|\#/) == null)
  {
    return false;
  }
  else{
    return true;
  }

}

function isDigit(parameter)
{
  "use strict";
  if(parameter.match(/[0-9]/g) == null)
  {
    return false;
  }
  else{
    return true;
  }

}

  function searchMan(){


      //var shipman = check_name(encodeURI($('#shipman').val()));
      var shipman = $('#shipman').val();
      if(shipman.length == 0){
          alert('Please enter the name.');
          $("#shipman").focus();
          return false;
      }

      if (isSymbols(shipman)) {
          alert('no type special chars.');
          return false;
      }

      if(isDigit(shipman)){
        alert('no type number.');
          return false; 
      }
      shipman = encodeURI($('#shipman').val());
      
      var birthday=$('#dob').val();
      
      if(birthday.length == 0){
          alert('please type birthday.');
          $("#dob").focus();
          return false;
      } 
      
      var arr = birthday.split(".");
      birthday = encodeURI(arr[0] + "-" + arr[1] + "-" + arr[2]);

      $.ajax({
          url: site_url+'/shipdata/search_man/ko/'+shipman+'/'+birthday,
          success:function(data){
              if(data == 'no'){
                  $('#result').html('<div class="text-center"> <p style="font-size:17px;border:1px dotted-bottom #ccc;"> <strong> Sorry, no result.</strong></p></div>');
              }
              else
              {
                $('#result').html(data);
              }
              $('#modal-2').modal('show');
          }
      });
  }

