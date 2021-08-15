var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
var mysql=require('mysql');
 
// display products page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM good ORDER BY goodid desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/products/index.ejs
            res.render('carts',{data:''});   
        } else {
            // render to views/products/index.ejs
            res.render('carts',{data:rows});
        }
    });
});
// display add product page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('products/add', {
        goodname: '',
        goodnum: '',
		price: '',
		description: ''
    })
})

// add a new product
router.post('/add', function(req, res, next) {    

    let goodname = req.body.goodname;
    let goodnum = req.body.goodnum;
	let price = req.body.price;
	let description = req.body.description;
	
    let errors = false;

    if(goodname.length === 0 || goodnum === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter product name and number");
        // render to add.ejs with flash message
        res.render('products/add', {
            goodname: goodname,
            goodnum: goodnum,
			price: price,
			description: description
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            goodname: goodname,
            goodnum: goodnum,
			price: price,
			description: description
        }
        
        // insert query
        dbConn.query('INSERT INTO good SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
					res.render('products/add', {
                    goodname: form_data.goodname,
					goodnum: form_data.goodnum,
					price: form_data.price,
					description: form_data.description                    
                })
            } else {                
                req.flash('success', 'Product successfully added');
                res.redirect('/products');
            }
        })
    }
})

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/index.html');
});


// add cart
router.get('/addcart/(:goodid)', function(req, res, next) {

    session = req.session;
	let goodid = req.params.goodid;
	let cid = ''+ session.cid;
	let uid = ''+ session.uid;
	
/*	 res.json({
                   "status":400,
                   "msg":session.uid
	 })
*/	
	if (cid === '0') {
	//   let SQL ='INSERT INTO cart where uid = ' + uid;
	   let SQL ='INSERT INTO cart (uid) VALUES ('+ uid +')';
	   dbConn.query(SQL, function (err,result){
	   if(err) {
                req.flash('error', 'Item is failed in add');
				res.redirect('/carts')
            } else {                
                let SQL ='Select * from cart where uid="'+ uid + '" order by cid DESC Limit 1';
				console.log (SQL);
				dbConn.query(SQL, function (err,result){
				if (err) {
					req.flash('error', 'Item is failed in add');
					res.redirect('/carts')
				} else {
				
						session.cid = result[0].cid;
						cid = result[0].cid;
							
						let SQL = 'INSERT INTO goodcart (cid, gid,goodqutity) VALUE('+ cid +','+goodid +',1)'
						
						dbConn.query(SQL, function (err,result){
						if(err) {
								req.flash('error', 'Failed to add item');
								res.redirect('/carts')
						} else {                
								req.flash('success', 'Item is added');
								res.redirect('/carts')			
						}
						})
				}
				})
			}
		})
	} else {
			let SQL = 'INSERT INTO goodcart (cid, gid,goodqutity) VALUE('+ cid +','+goodid +',1)'
			dbConn.query(SQL, function (err,result){
			if(err) {
						req.flash('error', 'Failed to add item');
						res.redirect('/carts')
			} else {                
						req.flash('success', 'Item is added');
						res.redirect('/carts')			
			}
			})
	}
})

router.get('/editcart', function(req, res, next) {
    
	session = req.session;
	let cid = ''+ session.cid;
	
	SQL = 'SELECT  goodid,goodname,price,description, sum(gc.goodqutity) as ordernumber FROM cart c,goodcart gc,good g WHERE c.cid='+ cid + ' AND c.cid=gc.cid AND gc.gid=g.goodId group by goodid';	
    console.log (SQL);
	dbConn.query(SQL,function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/products/index.ejs
            res.render('carts/shoppingcarts',{data:''});   
        } else {
            // render to views/products/index.ejs
            res.render('carts/shoppingcarts',{data:rows});
        }
    })
})

   
// delete product
router.get('/deletecart/(:goodid)', function(req, res, next) {

    let goodid = req.params.goodid;
    let SQL =  
    dbConn.query('DELETE FROM goodcart WHERE gid = ' + goodid, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to products page
            res.redirect('/')
        } else {
            // set flash message
            req.flash('success', 'Item successfully deleted!')
            // redirect to products page
            res.redirect('/carts')
        }
    })
})

// edit profile
router.get('/editprofile', function(req, res, next) {
    
	session = req.session;
	let uid = session.uid;  
	SQL = 'SELECT * FROM t_user where uid=' + uid;
	console.log (uid);
	console.log (SQL);
	dbConn.query('SELECT * FROM t_user where uid=' + uid,function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/products/index.ejs
            res.render('carts/edit',{data:''});   
        } else {
            console.log (rows[0].uname);
			req.flash('success', 'Item successfully deleted!')
			// render to views/products/index.ejs
			
			// render to edit.ejs
            res.render('carts/edit', {
                title: 'Edit Profile', 
                uid: rows[0].uid,
                uname: rows[0].uname,
                upwd: rows[0].upwd,
				remark: rows[0].remark
            })
            res.render('carts/edit',{data:rows});
        }
    });
});

router.post('/update/:uid', function(req, res, next) {

    let uid = req.params.uid;
    let uname = req.body.uname;
	let upwd = req.body.upwd;
	let remark = req.body.remark;
   	
    let errors = false;

    // if no error
    if( !errors ) {   
 
        var form_data = {
           remark: remark
        }
        // update query
        dbConn.query('UPDATE t_user SET ? WHERE uid = ' + uid, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('carts/edit', {
                    uid: req.params.uid,
                    uname: uname,
					upwd: upwd,
					remark: remark
				})
            } else {
                req.flash('success', 'Product successfully updated');
                res.redirect('/carts');
            }
        })
    }
})
module.exports = router;