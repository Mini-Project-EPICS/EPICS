let express=require('express');
let path=require("path");

let hbs = require('express-handlebars'); 
let bcrypt=require('bcrypt'); 
let cookieParser=require('cookie-parser'); 
require('./database/connection');
let app=express();
let userdata=require('./database/userdata');
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// app.engine('hbs', hbs({ extname: 'hbs' }));
const staticpath=path.join(__dirname,"./public") 
  
 const fornt_view=path.join(__dirname,"./views/frontview"); 
 const nav_path=path.join(__dirname,"./views/nav") 
 
 app.set('view engine', 'hbs'); 
 app.set('views',fornt_view); 
//  hbs.registerPartials(nav_path); 
  
  app.use(express.static(staticpath));







app.get('/home',(req,res)=>{
    res.send("home page")
});



app.get('/register',(req,res)=>{ 
        res.render('register'); 
    }); 


app.post('/register',async(req,res)=>{ 
       try{ 
        let password=req.body.password; 
        let cpassword=req.body.cpassword; 
        if(password==cpassword){ 
    const registerdata=new userdata({ 
     
        name:req.body.name, 
        password:password, 
        cpassword:cpassword,  
        email:req.body.email, 
    education:req.body.education
    
    }) ; 
     
     let token= await registerdata.tokencreate(); 
     
     
    res.cookie("usertoken",token,{ 
        expires:new Date(Date.now()+24 * 60 * 60 * 1000), 
        httpOnly:true 
    }); 
     
     
     
     
    const registered=await registerdata.save(); 
     
     
      
    res.status(201).render("home"); 
        } 
        else{ 
            // res.send("password is not marching.."); 
            return res.render('register',{error:"password is not marching.."}) 
        } 
     
     
       } catch(error){ 
        res.status(400).send(error); 
        console.log(error); 
     
       } 
    }); 
   



    app.get('/login',async(req,res)=>{
        res.send("login get method");
    })
    app.post('/login',async(req,res)=>{ 
            try{ 
                const email=req.body.email; 
                const password=req.body.password; 
              const useremail= await userdata.findOne({email}) 
             
         const passwordmatch=await bcrypt.compare(password,useremail.password); 
         let token= await useremail.tokencreate(); 
          
         res.cookie("usertoken",token,{ 
            expires:new Date(Date.now()+24 * 60 * 60 * 1000), 
            httpOnly:true 
        }); 
          
        console.log( passwordmatch); 
               if(passwordmatch) {  
                res.status(201).render("home"); 
              } 
              else{ 
         
                // res.send("password is not matching.."); 
                return res.render('login',{error:"Invalid email or password"}) 
              } 
         
            } 
            catch(err){ 
                res.status(401).send(err); 
                console.log(err); 
            } 
        }) 
      
     


app.listen(3000,()=>{
    console.log("server is running..")

})