console.log('Loaded!');

var img=document.getElementById('kumar');
var marginLeft = 0;
function moveRight(){
  marginLeft=marginLeft+10;
  img.style.marginLeft=marginleft+'px';
}

img.onclick = function()
{
 var interval=setInterval(moveRight,100);  
};