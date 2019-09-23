const errorHandler = (code,msg)=>{
        return{
                statusCode:code||500,
                headers:{'Content-Type':'text/plain'},
                body:msg
        }
}

module.exports = {
        errorHandler
}