"use strict";
const mongoose = require("mongoose");
var productModel = require("./api/models/products_schema.js");
var config = require("./api/config/index.js");
const error = require("./api/errors/index.js");
mongoose.Promise = require("bluebird");

const dbCaller = (db, handler) => {
  db.then(() => {
    handler();
  }).catch(err => {
    console.log(err);
  });
};

function db_connect_on_action(action) {
  return dbCaller(
    mongoose
      .connect(config.db_url)
      .then(() => {
        console.log("Successfully connected to the database");
      })
      .catch(err => {
        console.err("Could not to the database.Exiting now...", err);
        process.exit();
      }),
    action
  );
}

module.exports.create = (event, context, callback) => {
  console.log(event);

  if (event.queryStringParameters) {
    var name = event.queryStringParameters.name;
    var price = event.queryStringParameters.price;
    var description = event.queryStringParameters.description;
    var sku_quantity = parseInt(event.queryStringParameters.sku_quantity);
    var status = event.queryStringParameters.status ? 1 : 0;
  }

  const product = new productModel({
    name,
    price,
    description,
    sku_quantity,
    status
  });
  db_connect_on_action(() => {
    return product
      .save()
      .then(() => {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            success: {
              id: product._id,
              name: product.name
            }
          })
        });
      })
      .then(() => {
        console.log(`${product._id} was added successfully`);
      })
      .catch(err =>
        callback(err, error.errorHandler(error.statusCode, error.msg))
      );
  });
};

module.exports.update = (event, context, callback) => {

  if (event.queryStringParameters) {
    var name = event.queryStringParameters.name;
    var price = event.queryStringParameters.price;
    var description = event.queryStringParameters.description;
    var sku_quantity = parseInt(event.queryStringParameters.sku_quantity);
    var status = event.queryStringParameters.status ? 1 : 0;
    

  }

  const product = {
    name:name,
    price:price,
    description:description,
    sku_quantity:sku_quantity,
    status:status
  };

  
  var id = event.pathParameters.id;
  db_connect_on_action(() => {
      productModel.findByIdAndUpdate(id, product)
      .then(() => {
        console.log(`${id} was updated`);
        callback(null, {
          statusCode: 200,
          body: JSON.stringify("done!")
        });
      })
      .catch(err =>
        callback(err, error.errorHandler(error.statusCode, error.msg))
      );
  });
};


module.exports.read = (event, context, callback) => {
  var id = event.queryStringParameters.id;
  db_connect_on_action(() => {
    productModel
      .find({ _id: id},(err,doc)=>{
        if(err){
          return err;
        }
        return doc;
      })
      .then((doc) => {
        console.log(doc);
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(doc)
        });
      })
      .catch(err =>
        callback(null, error.errorHandler(err.statusCode, err.msg))
      );
  });
};

module.exports.delete = (event, context, callback) => {
  var id = event.pathParameters.id;
  db_connect_on_action(() => {
    productModel
      .remove({ _id: id})
      .then(() => {
        console.log(`${id} was delete  successfully `);
        callback(null, {
          statusCode: 200,
          body: JSON.stringify("done!")
        });
      })
      .catch(err =>
        callback(err, error.errorHandler(error.statusCode, error.msg))
      );
  });
};



module.exports.search = (event, context, callback) => {
  var search_query = event.queryStringParameters.search
  db_connect_on_action(() => {
    productModel
      .search(
        {
          query_string:{
            query:`${search_query}`
          }
        },
        (err,docs)=>{
          if(err){
            throw err;
          }
          return docs;
        }
      )
      .then((doc) => {
        console.log(doc);
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(doc)
        });
      })
      .catch(err =>
        callback(null, error.errorHandler(err.statusCode, err.msg))
      );
  });
};

