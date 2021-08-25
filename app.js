const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useUnifiedTopology: true,useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

//////////////////////////////////////////request targeting atrticle ///////////////////////////////////////////////////////

app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }

  });
})
.post(function(req,res){

   const newAtricle = new Article({
     title:req.body.title,
     content:req.body.content
   });
   newAtricle.save(function(err){
     if(!err){
       res.send("succesfully added a new article");
     }else{
       res.send(err);
     }
   });

})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("All items are deleted");
    }
    else{
      res.send(err);
    }
  });

});

//////////////////////////////////////////request targeting specific atrticle ///////////////////////////////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("There is no such article");
    }
  })
})
.put(function(req,res){
  Article.update(
     {title:req.params.articleTitle},
     {
       title: req.body.title,
       content: req.body.content
     },
     {overwrite:true},
     function(err){
       if(!err){
         res.send("requested changes done");
       }
       else{
         res.send("Not a valid request to update");
       }
     }
  )
})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("the patch process is done");
      }
      else{
        res.send(err);
      }
    }
  )
})
.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("seccusfully deleted the article")
      }
      else{
        res.send(err);
      }
    }
  )
});




app.listen(3000,function(){
  console.log("The server is started on port 3000");
})
