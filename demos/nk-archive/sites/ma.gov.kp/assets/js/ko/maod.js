  function searchShip(){

      var shipname=check_para(encodeURI($('#shipname').val()));

      if(shipname.length == 0){
          alert('검색할 배이름을 입력하십시오.');
          $("#shipname").focus();
          return false;
      }
      $.ajax({
          url: site_url+'/shipdata/search_ship/ko/'+shipname,
          success:function(data){
              if(data == 'no'){
                  $('#result').html('<div class="text-center"> <p style="font-size:17px;border:1px dotted-bottom #ccc;"> <strong> 검색결과가 없습니다.</strong></p></div>');
              }
              else
              {
                  $('#result').html(data);
              }
              $('#modal-2').modal('show');
          }
      });
      
  }
function check_para(parameter)
{
  "use strict";
  if(!parameter.match(/\~|\`|\!|\@|\^|\&|\*|\(|\)|\_|\=|\+|\{|\}|\[|\]|\;|\:|\"|\'|\<|\>|\,|\.|\?|\/|\#/))
  {
    return parameter;
  }else{
    alert('특수기호는 입력할수 없습니다.');
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
          alert('검색할 선원이름을 입력하십시오.');
          $("#shipman").focus();
          return false;
      }

      if (isSymbols(shipman)) {
          alert('특수기호는 입력할수 없습니다.');
          return false;
      }

      if(isDigit(shipman)){
        alert('수자는 입력할수 없습니다.');
          return false; 
      }
      shipman = encodeURI($('#shipman').val());
      
      var birthday=$('#dob').val();
      
      if(birthday.length == 0){
          alert('검색하려는 선원의 생년월일을 입력하십시오.');
          $("#dob").focus();
          return false;
      } 
      
      var arr = birthday.split(".");
      birthday = encodeURI(arr[0] + "-" + arr[1] + "-" + arr[2]);

      $.ajax({
          url: site_url+'/shipdata/search_man/ko/'+shipman+'/'+birthday,
          success:function(data){
              if(data == 'no'){
                  $('#result').html('<div class="text-center"> <p style="font-size:17px;border:1px dotted-bottom #ccc;"> <strong> 검색결과가 없습니다.</strong></p></div>');
              }
              else
              {
                $('#result').html(data);
              }
              $('#modal-2').modal('show');
          }
      });
  }

	
