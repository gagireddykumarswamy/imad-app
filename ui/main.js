

var element=document.getElementById('counter');
element.onclick = function(){
    
    var request=new XMLHttpRequest();
    
    request.onreadystatechange = function(){
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200){
              var counter=request.responseText;
              var span=document.getElementById('count');
              span.innerHTML=counter.toString();
          }
          
      }  
        
    };
    request.open('GET','http://gagireddykumarswamy.imad.hasura-app.io/counter',true);
  request.send(null);
};

var inputname=document.getElementById('name');
var inputvalue=inputname.value;
var submit=document.getElementById('submit_btn');
submit.onclick = function(){
    
var names=['name1','name2','name3'];    
  var list='';  
  for(var i=0; i<names.length; i++){
      
      list += '<li>' + names[i] + '</li>';
  }
  var ul=document.getElementById('namelist');
  ul.innerHTML=list;
};
/*var img=document.getElementById('kumar');
var marginLeft = 0;
function moveRight(){
  marginLeft=marginLeft+1;
  img.style.marginLeft=marginLeft+'px';
}

img.onclick = function()
{
 var interval=setInterval(moveRight,50);  
};*/