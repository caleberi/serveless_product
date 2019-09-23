const mongoose = require("mongoose")
        ,mongoosastic = require('mongoosastic');

var productSchema = new mongoose.Schema( {
        name:{
                type:String,
        },
        price:{
                type:Number,
        },
        description:String,
        sku_quantity:{
                type:Number,
                default:0
        },
        status:{
                type:Number,
                default:0
        },
        date:{
                type:Date,
                default:Date.now()
        }
});

productSchema.plugin(mongoosastic);

var productmodel=  mongoose.model('Products',productSchema,'product');




module.exports = productmodel;