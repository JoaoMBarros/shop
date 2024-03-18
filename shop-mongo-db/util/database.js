const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb+srv://joao:lECi55T9DuX2XRaz@cluster0.ao6qwlj.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

let _db;

async function run() {
    try{
        await client.connect();
        _db = client.db();
        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

function getDb() {
    if (_db) {
        return _db;
    }
    throw "No database found!";
}

exports.run = run;
exports.getDb = getDb;