const { json } = require("express");
const http = require('http');
const express = require("express");
const { request } = require("http");
const path = require("path");
const fs = require('fs');
const app = express();
const { MongoClient } = require("mongodb");
require("./src/db/conn");

const Complaint = require("./src/models/complaint");

const { isValidObjectId } = require("mongoose");
const assert = require("assert");
const { dirname } = require("path");

const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.set('view engine', 'html');

const static_path = path.join(__dirname, "../");
app.use(express.static(static_path))


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/data', function (req, res) {
  res.sendFile(__dirname + '/views/view.html')
})

app.get('/edit.html', function (req, res) {
  res.sendFile(__dirname + '/views/edit.html')
})


// product update api
app.post("/edit", async (req, res) => {
  try {
    const updateDocument = async (_id) => {
      try {
        const result = await Complaint.findByIdAndUpdate({ _id }, {
          $set: {
            title: req.body.title,
            discription: req.body.discription,
            created_by: req.body.created_by,
            completed_by: req.body.completed_by,
            datetime: req.body.datetime,
            status: req.body.status
          }
        }, {
          new: true,
          useFindAndModify: false
        });
        res.redirect("/")
        console.log("Updated");
      }
      catch (err) {
        console.log("error");
      }
    }
    updateDocument(req.body.id);
  }
  catch (error) {
    console.log("error");
  }
})

// product delete api
app.post("/delete", async (req, res) => {
  try {
    const deleteDocument = async (_id) => {
      try {
        const result = await Complaint.findByIdAndDelete({ _id });
        res.redirect("/find")
        console.log("Updated");
      }
      catch (err) {
        console.log("error 6 ne");
      }
    }
    deleteDocument(req.body.id);
  }
  catch (error) {
    console.log("aato error ni 6");
  }
})

// product create api
let updateId = 0;
app.post("/complaint", async (req, res) => {
  try {
    const complaintDetail = new Complaint({
      id: updateId,
      title: req.body.title,
      discription: req.body.discription,
      created_by: req.body.created_by,
      completed_by: req.body.completed_by,
      datetime: req.body.datetime,
      status: req.body.status
    })
    const complainted = await complaintDetail.save();
    res.redirect("/");
  }
  catch (error) {
    res.redirect("/")
  }
  updateId = updateId + 1;

  fs.appendFile('crud.txt', req.body.id, function (err) {
    if (err) throw err;
    fs.appendFile('crud.txt', req.body.title, function (err) {
      if (err) throw err;
      fs.appendFile('crud.txt', req.body.discription, function (err) {
        if (err) throw err;
        fs.appendFile('crud.txt', req.body.created_by, function (err) {
          if (err) throw err;
          fs.appendFile('crud.txt', req.body.completed_by, function (err) {
            if (err) throw err;
            fs.appendFile('crud.txt', req.body.datetime, function (err) {
              if (err) throw err;
              fs.appendFile('crud.txt', req.body.status, function (err) {
                if (err) throw err;
              });
            });
          });
        });
      });
    });
    console.log('Saved!');
  });
});

// product read api
app.get("/find", async (req, res) => {
  var url = "mongodb://localhost:27017/crud2";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("crud2");
    dbo.collection("complaints").find().toArray(function (err, result) {
      if (err) throw err;
      db.close();
      res.send(result);
      res.sendFile('/view.html',{root: __dirname + '/views'}, function(){
        try {
          var data = fs.readFileSync('crud.txt', '');
          console.log(data.toString());
          res.end();
        } catch (e) {
          console.log('Error:', e.stack);
        }
      });
    });
  });

});


app.listen(port, () => {
  console.log('server is running now');
})