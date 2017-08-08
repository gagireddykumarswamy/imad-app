
var counter = 0;

var element=document.getElementById('counter');
element.onclick = function(){
    
  counter=counter+1;
  var span=document.getElementById('count');
  span.innerHTML=counter.toString();
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