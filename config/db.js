const mongoose=require('mongoose')
const config=require('config')
const url=config.get('url')
const dbConnect=async ()=>{
    try{
        await mongoose.connect(url,{
            useCreateIndex:true,
            useNewUrlParser:true,
            useUnifiedTopology: true
        })
        console.log("mongodb connected")

    }catch(err) {
        console.log('Mongo db connection failed')
    }
}
module.exports=dbConnect