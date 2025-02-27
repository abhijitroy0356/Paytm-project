const express = require('express')
const authMiddleware = require('../middleware')
const pool = require('../db')
const transfer= require('../zod')
const router = express.Router()

router.get("/balance", authMiddleware,async (req, res)=>{
    const username = req.query.username
        if(username.rowCount === 0){
            return res.status(400).json({
                msg:"username is not given"
            })
        }
    try{
        if(username){
            const amount= await pool.query(`SELECT balance FROM Account WHERE username = ${username}`)
            if(!amount){
                return res.status(404).json({
                    msg:"No user with this username found"
                })
            }
        }
        return res.status(200).json({
            msg:"your balance",
            balance:amount.rows[0].balance
        })

    }catch(err){
        return res.status(404).json({
            msg:"no user with this id is found"
        })
    }
})

router.post('/transfer', authMiddleware, async (req, res)=>{
    const body = req.body
    const filterBody =transfer.safeParse(body)
    if(!filterBody.success){
        return res.status(411).json({
            msg:"bad request"
        })
    }
    const {sender, receiver, amount} = filterBody.data
    try{
        await pool.query('BEGIN')

        const senderBalance = await pool.query(`SELECT balance FROM Account WHERE username=${sender}`)

        if(senderBalance.rowCount===0){
            return res.status(411).json({
                msg:"insufficient balance"
            })
        }
        const currentBalance = senderBalance.rows[0].balance

        const receiver = await pool.query(`SELECT * FROM Paytm`)

    }catch(err){
        return res.status(404).json({
            msg:"not found"
        })
    }
})

module.exports=router
