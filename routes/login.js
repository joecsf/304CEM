var express = require('express');
var dbConn = require('../lib/db');
var router = express.Router();

module.exports = router;

router.get('/', function(req, res, next) {
      
    res.render('login');   
    });

router.post('/register', function(req, res, next) {
	
	
	let uname = req.body.uname;
	let upwd = req.body.upwd;
	let remark = req.body.remark;
	
	var form_data = {
            uname: uname,
            upwd: upwd,
			remark: remark
        }
    
        // insert query
	
        dbConn.query('INSERT INTO t_user SET ?', form_data, function(err, result) {
   
		if(err) {
                req.flash('error', 'Registration is failed');
				res.redirect('/login/register')
            } else {                
                req.flash('success', 'Member successfully registered');
				res.redirect('/login')    
			}
			res.end();
        })
})
	

router.get('/register', function(req, res, next) {
      
    res.render('login/register');   
    });

router.post('/login',function(req,res,next){
   
	let uname = req.body.uname;
	let upwd = req.body.upwd;

	var SQL = 'select uid from t_user where uname='+'"'+ uname + '"' + ' and upwd=' +'"'+ upwd +'"' ;
	var form_data = {
            uname: uname,
            upwd: upwd,
        }
	
    dbConn.query(SQL, function (err,result){
    if(result.length > 0) {
				req.flash('success', 'Successfully Login');
				req.flash('username',uname);
				req.flash('uid',result[0].uid);
				session=req.session;
				session.uid = result[0].uid;
				session.username = uname;
				session.cid = 0;
				if (uname === 'admin') {
					req.flash('success', 'This is admin page');
					res.redirect('/products')
				} else {
					res.redirect('/carts')
				}
            } else {
				req.flash('error', 'Incorrect Username and/or Password!');
				res.redirect('/login')
				}
        res.end();
	})
})


/*
_router.post('/login',function(request,response){
    let user = request.body;
    let values = [user.username,user.pwd];
    let sql='select uid from `t_user` where uname=? and upwd=?';
    let cb=function(error,data,fields){
        if(!error&data.length==1){
            response.json({
                "status":200,
                "msg":"login successful",
                "data":data
            })

        }else{
            response.json({
                "status":400,
                "msg":"Login failed",
                "data":data
            })
        }
    }
    db._connetion(sql,values,cb);
    })*/