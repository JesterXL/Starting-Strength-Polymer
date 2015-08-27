var Promise = require('bluebird');

function Client()
{
    var client           = {};

    client.__MongoClient = null;
    client.__url         = 'mongodb://localhost:27017/mydb';
    client.__db            = null;

    Object.defineProperty(client, "db", {
        get: function()
        {
            return client.__db;
        }
    });

    client.connect = function()
    {
        return new Promise(function(resolve, reject)
        {
            console.log("MongoClient connect");
            client.__MongoClient = require('mongodb').MongoClient;
            client.__MongoClient.connect(client.__url, function(err, dbInstance)
            {
                if(err)
                {
                    console.error("err:", err);
                    reject(err);
                    return;
                }
                console.log("Connected correctly to server");
                // console.log(client.__MongoClient.db("startingstrength"))
                var newDB = dbInstance.db('startingstrength');
                client.__db = newDB;
                resolve();
            });
        }); 
    };

    client.close = function()
    {
        return new Promise(function(resolve, reject)
        {
            try
            {
                client.__db.close();
                resolve();
            }
            catch(err)
            {
                reject(err);
            }
        });
    };

    return client;
}

module.exports = Client;