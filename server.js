const express = require('express')
const mongoose = require('mongoose')
const shorturl = require('./models/shorturl')
const app = express()

mongoose.connect('mongodb://localhost/urlshortener',{
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get("/",async (req,resp)=>{
    const shorturls = await shorturl.find()
    resp.render('index',{shorturls:shorturls});
    console.log("server started successfully");
});

app.post('/shortUrls',async (req,resp)=>{
   await shorturl.create({full : req.body.fullurl})
   resp.redirect('/');
});

app.get('/:shorturl',async (req,resp)=>{
const Shorturl = await shorturl.findOne({short:req.params.shorturl})
if(Shorturl == null) return resp.sendStatus(404)

Shorturl.clicks++
Shorturl.save()

resp.redirect(Shorturl.full)
})

app.listen(process.env.PORT || 5000);
