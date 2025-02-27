const z = require('zod')

const signup= z.object({
    firstname:z.string(),
    lastname:z.string(),
    password:z.string(),
    username:z.string().min(4),
    email:z.string().email()
})

const signin = z.object({
    username:z.string(),
    password:z.string()
})

const updateBody = z.object({
    password:z.string().optional(),
    firstname:z.string().optional(),
    lastname:z.string().optional(),
    username:z.string()
})
const transfer = z.object({
    sender:z.string(),
    receiver:z.string(),
    amount:z.number()
})
module.exports={
    signup,
    signin,
    updateBody,
    transfer
}   