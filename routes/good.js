const express=require('express');
const db	=	require('../lib/db');
const _router=express.Router();
const mysql=require('mysql');
module.exports=_router;

//Get product information interface
_router.route('/getList')
   .get(function(request,response){
       let values=[];
       let sql = 'select * from good';
       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained cargo information",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Failed to obtain cargo information",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })

//Get shopping cart delete product information interface
_router.route('/deleteCart')
   .get(function(request,response){
       let cid=request.query.goodId;
       let values=[cid];

       let sql="delete from goodcart where gid=?"
       let cb=function(err,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully deleted",
                   "data":[]
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"failed to delete",
                   "data":[]
               })
           }
       }
       db._connetion(sql,values,cb);
   })
   
//Get cleared product information interface
_router.route('/deleteAllCart')
   .get(function(request,response){
       let values=[];
       let sql="delete from goodcart";
       let cb=function(err,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully deleted",
                   "data":[]
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"failed to delete",
                   "data":[]
               })
           }
       }
       db._connetion(sql,values,cb);
   })

//Get shopping cart information interface
_router.route('/getCartList')

   .get(function(request,response){
       
	   let uid=request.query.uid;
       let cid=request.query.cid;
       let values=[cid];

       let sql = 'SELECT  goodId,goodName,goodNum,price,gc.`goodqutity` FROM cart c,goodcart gc,good g WHERE c.cid=? AND c.cid=gc.cid AND gc.gid=g.goodId';
       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained cargo information",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":'SELECT  goodId,goodName,goodNum,price,gc.`goodqutity` FROM cart c,goodcart gc,good g WHERE c.cid=? AND c.cid=gc.cid AND gc.gid=g.goodId',
				   "msg":"Failed to obtain cargo information",
                   "data":data,
				   
               })
           }
       }
       db._connetion(sql,values,cb);

   })
//Get shopping cart settlement interface
_router.route('/getTotal')
   .get(function(request,response){
       let uid=request.query.uid;
       let cid=request.query.cid;
       let values=[uid,cid];
       console.log(values);
       let sql = 'select *from t_user where uid=?;SELECT  goodId,goodName,price,gc.goodqutity FROM cart c,goodcart gc,good g WHERE c.cid=? AND c.cid=gc.cid AND gc.gid=g.goodId;';
       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successful user and shopping cart information",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Failed to obtain user and shopping information",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })
   
//Get product details information interface
_router.route('/getGoodDetailInfo')
   .get(function(request,response){
       let cid=request.query.goodId;
       let values=[cid];

       let sql="select * from good where goodId=?"
       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Get failed",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })

//Get shopping cart and add product information interface
_router.route('/saveCartInfo')
	.get(function(request, response) {
		
	   let count=request.query.count;
       let goodId=request.query.goodId;
       let cartId=request.query.cartId;
	   let values=[cartId,goodId,count];
		console.log(values);	
			
	   let sql="INSERT INTO goodcart (cid, gid,goodqutity) VALUE(?,?,?);"
       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Get failed",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })

//Create shopping cart interface
_router.route('/createC')
   .get(function(request,response){
       let uId=request.query.uId;
       let cId=request.query.cId;
       let values=[cId,uId];
       console.log(values);
       let sql=" INSERT INTO cart VALUE(?,?);";
       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Get failed",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })

_router.route('/setuid')
   .get(function(request,response){
       let username=request.query.username;
       let values=[username];
       let sql=" SELECT uid FROM t_user WHERE uname=?;";
       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Get failed",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })
   
//Get all product information
_router.route('/selectAll')
   .get(function(request,response){
       let values=[];

       console.log(values);
       let sql=" SELECT Count(*) FROM good;SELECT goodId FROM good;";
       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Get failed",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })
//All products are added to the shopping cart interface
_router.route('/addAll')
   .get(function(request,response){
       let gooddata=request.query.gooddata;
       let length=request.query.length;
       let cid=request.query.cid;
       let sql="";
       for(let i=0;i<length;i++){
           sql+=selectOne(cid,gooddata[i].goodId)

       }
       let values=[];

       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Get failed",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })
   
function selectOne(cid,gid){
   let sql='INSERT INTO `goodcart` (`gcid`, `cid`, `gid`, `goodqutity`) VALUES(NULL,'+cid+','+gid+',NULL); '
   return sql;
}

//Bulk products add to shopping cart interface
_router.route('/selectSome')
   .get(function(request,response){
       let arr1=request.query.arr1;
       let length=request.query.length;
       let cid=request.query.cid;
       let sql="";
       for(let i=0;i<length;i++){
           sql+=selectOne(cid,arr1[i])
       }
       let values=[];

       let cb=function(err,data,fields){
           if(!err){
               response.json({
                   "status":200,
                   "msg":"Successfully obtained",
                   "data":data
               })
           }else{
               response.json({
                   "status":400,
                   "msg":"Get failed",
                   "data":data
               })
           }
       }
       db._connetion(sql,values,cb);
   })

