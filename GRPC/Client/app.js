const express = require('express');
const formController = require('./controller/formcontroller');
const bodyParser = require('body-parser');

app = express();
app.set('view engine', 'ejs')
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false})); 

app.get('/',async (req, res) => {
    res.render('home')
})


app.post('/id',formController.form_post)

app.listen(5000,(error) => {
    if(error) console.log(error);
    console.log("listening to port 5000")
})