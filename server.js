var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');

var config={
  user:'gagireddykumarswamy',
  database:'gagireddykumarswamy',
  host:'db.imad.hasura-app.io',
  port:'5432',
  password:process.env.DB_PASSWORD
  
 };

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var articalOne = {
    title:'artical one',
    heading:'artical one',
    date:'aug 7th 2017',
    content:`                <p>
                    artical one paragraph is here and we are serving the request
                </p>
                <p>
                    artical one paragraph is here and we are serving the request
                </p>
                <p>
                    artical one paragraph is here and we are serving the request
                </p>`
    
    
};

function createTemplate(data){
var title=data.title;
var heading=data.heading;
var date=data.date;
var content=data.content;

var htmlTemplate = 
  `<html>
    <head>
        <title>
        ${title}
        </title>
        <meta name="viewpart" content="width=device-width,initial-scale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="container">
            <div>
                <a href="/">home</a>
            </div>
            <hr/>
            <div>
                <h3>${heading}</h3>
            </div>
            <div>
                ${date.toDateString()}
            </div>
            <div>
                ${content}
            </div>
        </div>
    </body>
</html>`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool=new Pool(config);
app.get('/test-db',function(req,res){
   pool.query('select * from test',function(err,result){
      if(err){
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
    
});

var counter = 0;
app.get('/counter',function(req,res){
   counter = counter+1;
   res.send(counter.toString());
});

app.get('/articals/:articalName',function(req,res){
    
    pool.query("select * from artical where title=$1",[req.params.articalName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length === 0){
                res.status(404).send("artical not found");
            }else{
                var articalData=result.rows[0];
                res.send(createTemplate(articalData));
            }
        }
        
    } );
    
});

function hash(input,salt){
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join("$");
}

app.get('/hash/:input',function(req,res){
    
    var hashedString=hash(req.params.input,'this-is-random-string');
    res.send(hashedString);
});

app.post('/create-user',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    
    var salt=crypto.randomBytes(128).toString('hex');
    var dbstring=hash(password,salt);
    pool.query('insert into "user" (username,password) values ($1,$2)',[username,dbstring],function(err,result){
        
        if(err){
          res.status(500).send(err.toString());
      } else {
          res.send("user successfully created"+ username);
      }
    });
    
});

app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    
    pool.query('select * from "user" where username = $1',[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length === 0){
                res.status(403).send('username and pasword not valid');
            }else{
                var dbString=result.rows[0].password;
                var salt=dbString.split('$')[2];
                var hashedPassword=hash(password,salt);
                if(hashedPassword === dbString){
                    res.send('credentials are correct');
                }else{
                    res.status(403).send('username and password invalid');
                }
                
            }
        }
        
    });
    
});

app.get('/artical-tw0',function(req,res){
   res.sendFile(path.join(__dirname,'ui','artical-two.html')); 
});

app.get('/ui/main.js',function(req,res){
  res.sendFile(path.join(__dirname,'ui','main.js'));  
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
var names=[];
app.get('/submit-name',function(req,res){
   var name=req.query.name;
   
   names.push(name);
    res.send(JSON.stringify(names));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
