let mongose=require("mongoose");
let userschema=mongose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    education:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    cpassword:{
        type:String,
        require:true,
    }
})

userschema.methods.tokencreate=async function(){ 
        try{ 
            const token =jwt.sign({_id:this._id},"thismysceretecodegivenbysaikumartarra"); 
            this.tokens=this.tokens.concat({token:token}) 
            await this.save(); 
            return token; 
        }catch(err){ 
             
            console.log(err); 
        } 
    } 
     
    userschema.pre("save", async function(next){ 
       
        if(this.isModified("password")){ 
        this.password= await bcrypt.hash(this.password,10); 
        this.cpassword= await bcrypt.hash(this.cpassword,10); 
         
        console.log("password"+this.password); 
        console.log("cpassword"+this.cpassword); 
        } 
    next(); 
})





let userdata=mongose.model("userdatasch", userschema);
module.exports=userdata;