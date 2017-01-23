var express = require('express');
var router = express.Router();
var  crypto=require('crypto');


var token='3AVoK73qbI';

/* GET home page. */
router.get('/wechat/hello', function(req, res, next) {
  res.render('index', { title: 'hello wechat Express' });
});
function middleware(req,res,next){
	
	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var echostr   = req.query.echostr;
	var nonce     = req.query.nonce;
	if(!signature || !timestamp || !nonce){
		return res.send('invalid request!');
	}
	if(req.method==='POST'){
		console.log('post:',{body:JSON.stringify(req.body),query:req.query});

	}
	if(req.method==='GET'){
		console.log('get:',{get:req.body});
		if(!echostr){
                        return res.send('invalid request!get ');
                }
	}


	var params =[token,timestamp,nonce];
	params.sort();

	
	var hash=crypto.createHash('sha1');
	var sign=hash.update(params.join('')).digest('hex');

	
	if(signature===sign){
		if(req.method==='GET'){
			res.send(echostr?echostr:'invalid request!');
		}else{
			
			var tousername=req.body.xml.tousername[0];
			var fromusername=req.body.xml.fromusername[0].toString();
			var createtime=req.body.xml.createtime[0].toString();
			var msgtype=req.body.xml.msgtype[0].toString();
			var content=req.body.xml.content[0].toString();
			var msgid=req.body.xml.msgid[0].toString();
			
			var response='<xml>'+
				 '<ToUserName><![CDATA['+fromusername+']]></ToUserName>'+
				 '<FromUserName><![CDATA['+tousername+']]></FromUserName>'+
				 '<CreateTime>'+createtime+'</CreateTime>'+
				 '<MsgType><![CDATA['+msgtype+']]></MsgType>'+
				 '<Content><![CDATA['+content+']]></Content>'+
				 '</xml>';

			
			res.set('Content-Type','text/xml');
			res.send(response);
		}
	}else{
		res.send('invalid sign!');
	}
}

router.get('/wechat/verify',middleware);
router.get('/api/wechat',middleware);
router.post('/api/wechat',middleware);
module.exports = router;

