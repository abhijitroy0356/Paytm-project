const express = require('express');
const {JWT_SERECT} = require('../config');
const pool= require('../db')
const {signup,signin, updateBody, bulkUser} = require('../zod')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware');
const router = express.Router();


router.post('/signup',async (req, res)=>{
    const unclearBody = await req.body;
    const body = signup.safeParse(unclearBody)
    if(!body.success){
        return res.status(411).json({
            msg:'bad request body incorrect'
        })
    }
    const {firstname,lastname,password,username}=body.data
    
    const findout = await pool.query(`SELECT username FROM Paytm WHERE username = ${username}`)
    if(findout){
        res.status(411).send('already have user with this email')
        return
    }
    try{
        const check=await pool.query(`INSERT INTO Paytm (firstname, lastname, password, username) VALUES (${firstname} ${lastname} ${password} ${username})`)
        if(check.rowCount){
        return res.status(200).json({
            msg:"user created succesfully",
            token:token
        })
    }
    }catch(err){
        res.status(411).json({
            msg:"email already taken or incorret inputs"
        })
    }
    
    
})
router.post('/signin',async (req, res)=>{
    const unclearBody = req.body
    const body = signin.safeParse(unclearBody)
    if(!body.success){
        return res.status(411).json({
            msg:"wrong body"
        })
    }
    const username = body.username
    const password = body.password
    
    try{
        const check = await pool.query(`SELECT username from Paytm where username = ${username} and password =${password}`)
        const token = jwt.sign({username:username},JWT_SERECT)
        if(check.rowCount){
            res.status(200).json({
                token
            })
        }
    }catch(err){
        res.json({
            msg:"user not found"
        })
    }
})
router.put('/update', authMiddleware, async (req,res)=>{
    const body = req.body;
    const unfilteredBody = updateBody.safeParse(body);
    if(!unfilteredBody.success){
        return res.status(411).json({
            msg:"wrong body"
        })
    }

    try{
        const {firstname,lastname,username, password}= unfilteredBody.data
        let query = `UPDATE Paytm SET`
        if(firstname){
            query+=` firstname=${firstname} OR`
        }
        if(lastname){
            query+=` lastname=${lastname} OR`
        }
        if(password){
            query+=` password=${password} OR`
        }
        query+= `WHERE username=${username}`

        const queryDef = await pool.query(query)
        if(queryDef.rowCount==1){
            return res.status(200).json({
                msg:"updated successfully"
            })
        }
    }catch(err){
        return res.status(411).res({
            msg:"failed updation"
        })
    }
})
router.get('/bulk',authMiddleware, async(req, res )=>{
    const body = req.body;
    const filteredBody= bulkUser.safeParse(body)
    if(!filteredBody.success){
        return res.status(411).json({
            msg:"wrong body"
        })
    }
    const{username, firstname, lastname} = filteredBody.data
    let query=`SELECT username, firstname, lastname, email FROM Paytm WHERE`
    let values = []
        if(username){
            values.push(username)
            query+=` username LIKE ${username} OR`
        }
        if(firstname){
            values.push(firstname)
            query+=` firstname LIKE ${firstname} OR`
        }
        if(lastname){
            values.push(lastname)
            query+=` lastname LIKE${lastname}`
        }
    if(values.length===0){
        query=`SELECT username, firstname, lastname, email FROM Paytm`
    }
    try{
        const finalQuery= await pool.query(query)
        if(finalQuery.rowCount==1){
            return res.status(200).json({
                msg:"these are the results"
            })
        }
    }catch(err){
        return res.status(411).json({
            msg:"invalid",
        })
    }
})  
module.exports=router