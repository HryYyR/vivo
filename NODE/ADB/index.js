const MongoClient = require('mongodb').MongoClient;
const Baseurl = 'mongodb://localhost:27017/';

// 查
const queryData = async (url, db, coll, query) => {
    return await new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, dbres) => {
            const dbo = dbres.db(db)
            dbo.collection(coll).find(query).toArray().then(res => {
                resolve(res)
            })
        })
    })
}

//   改
const upData = async (url, db, coll, query) => {

}

//   增1
const insertOneData = async (url, db, coll, query) => {
    return await new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, dbres) => {
            const dbo = dbres.db(db)
            dbo.collection(coll).insertOne(query, (err, data) => {
                if (err) throw err
                resolve(data)
            })
        })
    })

}
//   删1
const deleteData = async (url, db, coll, query) => {
    return await new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, dbres) => {
            const dbo = dbres.db(db)
            dbo.collection(coll).deleteOne(query, (err, data) => {
                if (err) throw err
                resolve(data)
            })
        })
    })
}

module.exports = {
    queryData,
    upData,
    insertOneData,
    deleteData,
    Baseurl,
}