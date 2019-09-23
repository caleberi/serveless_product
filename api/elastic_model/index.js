var fs =  require('fs');

var es = require('elasticsearch');

var client  =  new es.Client({
        host:'localhost:9200'
})


fs.readFile('product.json',{encoding:'utf-8'},(err,data)=>{
        if(!err)
        {
                product_req = data.split('\n').reduce((product_req,line) =>{
                        var  obj,product;
                        try{
                                obj = JSON.parse(line);
                        }catch(err){
                                console.log('Done reading');
                                return product_req;
                        }

                        product = {
                                id:obj._id.$oid,
                                name:obj.name,
                                description:obj.description,
                                sku_quantity: obj.sku_quantity,
                                status: obj.status,
                                price:obj.price
                        }

                        product_req.push({_index:'products',_type:'product',_id:product.id});
                        product_req.push(product);
                        return product_req;
                },[])


                var busy = false;
                var cb = (err,resp)=>{
                        if (err) {
                                console.log(err);
                        }
                        busy = false;
                }

                var probability_insertor =()=>{
                        if(!busy){
                                busy = true;
                                client.bulk({
                                        body:product_req.slice(0,100)
                                },cb);
                        }
                        product_req =  product_req.slice(100);
                        console.log(product_req.length);
                        
                        if(product_req.length>0){
                                setTimeout(probability_insertor,10);
                        }else{
                                console.log("inserted all the records");
                        }
                }

                probability_insertor();
        }

        throw err;
});