//to use
//logger.info('This is info');
//logger.error('This is error');
var fs = require('fs');

module.exports = function( filename , doit , data , callback ){

var roomlist;
if(!doit){
  //filename을 split으로 디렉터리별로 나누어
  //디렉터리가 없으면 mkdir으로 디렉터리를 만들고,
  //디렉터리의 퍼미션이 없으면 err발생시킨다.
  //디렉터리가 모두 만들어지면 return 0;
  var dirarr=filename.split("/");
  for(var i=0;i<dirarr.length;i++){

  }
}else if(doit==r){
  //읽는다. 파일이 없으면 빈 파일을 써둠

}else if(doit==w){
  //쓴다. 에러 발생 시 디렉터리 체크 실행한다.(!doit) 부분

}


return roomlist;
};
