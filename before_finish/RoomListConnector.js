//to use
//logger.info('This is info');
//logger.error('This is error');
var fs = require('fs');
var Logger = require('logger.js');
logger = new Logger('fs.log');

var roomlist;
exports.filecheck = function( filename , callback ){
  //filename을 split으로 디렉터리별로 나누어
  //디렉터리가 없으면 mkdir으로 디렉터리를 만들고,
  //디렉터리의 퍼미션이 없으면 err발생시킨다.
  //디렉터리가 모두 만들어지면 return 0;
  //반드시 파일 이름까지 다 입력할것
  var dirarr=filename.split("/");
  var message;
  var adder="";
  for(var i=1;i<dirarr.length-1;i++){
    if(!(dirarr[i]=="")){
    adder = adder+"/"+dirarr[i];
    fs.stat(adder,function(err,stats){
      if(err||!stats){
        fs.mkdirSync(adder,0775);
        message=message+"new dir ["+dirarr[i]+"] created]\n";
    }
  });
  }
  }
  callback(message);
}
exports.read = function( filename , callback ){
  //읽는다. 파일이 없으면 빈 파일을 써둠
  fs.stat(adder,function(err,stats){
    if(err||!stats){
      callback("no file!")
  }
  fs.readFile(filename,'utf8',function(err,data){
    callback(err,data);
  });
});


}
exports.write = function( filename , data , callback ){
  //쓴다. 에러 발생 시 디렉터리 체크 실행한다.(!doit) 부분
  var err;
  callback(err);
}
