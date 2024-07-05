const express = require('express');
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/authmiddleware')

app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser())


app.set('view engine' , 'ejs');

// database connection
const dbURI = 'mongodb+srv://node_prac:1234567890@cluster0.tko8tvq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbURI,{useNewUrlParser:true, useUnifiedTopology:true})
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


app.get('*',checkUser)
app.get('/' ,(req,res) => { res.render('home' )} )
app.get('/smoothies',requireAuth, (req, res) => { res.render('smootheis') } )
app.use(authRoutes);

