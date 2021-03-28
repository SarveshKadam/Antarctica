const express = require('express')
const Organization = require('../model/employees')
const auth = require('../middleware/authentication')

const router = express.Router()

router.post('/employees',auth, async (req, res) => {
    const organization = new Organization(req.body)

    try {
        await organization.save()
        res.status(201).send(organization)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/employees',auth, async (req,res)=>{
    try {
        const organization = await Organization.find().populate('employees').exec()
        res.send(organization)
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

router.patch('/employees/:id',auth,async (req,res)=>{
    try {
        const organization = await Organization.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});
        if(!organization){
            throw new Error()
        }
        res.send(organization)

    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/employees/:id',auth,async(req,res)=>{
    try {
        const organization = await Organization.findByIdAndDelete(req.params.id);
        if(!organization){
            throw new Error()
        }
        res.send(organization)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router