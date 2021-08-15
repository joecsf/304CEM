var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display products page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM good ORDER BY goodid desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/products/index.ejs
            res.render('products',{data:''});   
        } else {
            // render to views/products/index.ejs
            res.render('products',{data:rows});
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

// display edit product page
router.get('/edit/(:goodid)', function(req, res, next) {

    let goodid = req.params.goodid;
    dbConn.query('SELECT * FROM good WHERE goodid = "' + goodid + '"', function(err, rows, fields) {
    //dbConn.query('SELECT * FROM good WHERE goodid = ' + goodid, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Product not found')
            res.redirect('/products')
        }
        // if product found
        else {
            // render to edit.ejs
            res.render('products/edit', {
                title: 'Edit Product', 
                goodid: rows[0].goodid,
                goodname: rows[0].goodname,
                goodnum: rows[0].goodnum,
				price: rows[0].price,
				description: rows[0].description
            })
        }
    })
})

// update product data
router.post('/update/:goodid', function(req, res, next) {

    let goodid = req.params.goodid;
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
        res.render('products/edit', {
            goodid: req.params.goodid,
            goodname: goodname,
            goodnum: goodnum,
			price: price,
			description: description
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            goodname: goodname,
            goodnum: goodnum,
			price: price,
			description: description
        }
        // update query
        dbConn.query('UPDATE good SET ? WHERE goodid = ' + goodid, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('products/edit', {
                    goodid: req.params.goodid,
                    goodname: form_data.goodname,
					goodnum: form_data.goodnum,
					price: form_data.price,
					description: form_data.description    
                })
            } else {
                req.flash('success', 'Product successfully updated');
                res.redirect('/products');
            }
        })
    }
})

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/index.html');
});
   
// delete product
router.get('/delete/(:goodid)', function(req, res, next) {

    let goodid = req.params.goodid;
     
    dbConn.query('DELETE FROM good WHERE goodid = ' + goodid, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to products page
            res.redirect('/products')
        } else {
            // set flash message
            req.flash('success', 'Product successfully deleted!')
            // redirect to products page
            res.redirect('/products')
        }
    })
})
module.exports = router;