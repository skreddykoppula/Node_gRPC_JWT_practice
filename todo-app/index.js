const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const csrf = require('tiny-csrf');
const cookieParser = require('cookie-parser')
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");


const TodoList = require('./models/TodoModel');
const connect = require('./database/connectDB');
const users = require('./models/UserModel')

app.use(bodyParser.json())
app.use(express.urlencoded({extended: false})); 
app.use(cookieParser("shh! some secret string"));
app.use(csrf("qwertyuioplkjhgfdsazxcvbnm123456",["POST","PUT","DELETE"]));

app.use(session({
    secret: "my-secrey-key-1234567890",
    cookie: {
        maxAge: 24*60*60*1000 //24hrs
    }
}))

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));
app.set("views", path.join(__dirname, "views"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.messages = req.flash();
    next();
  });

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password,done) => {
    users.findOne({email: username, password: password})
        .then((user) => {
            if(user){
                return done(null,user);
            }
            else{
                return done(null, false, { message: "Invalid credantials" });
            }
            
        }) .catch((error) => {
            return done(null, error);
        })  
}))

passport.serializeUser((user,done) => {
    console.log("serializing user in session",user._id);
    done(null, user._id)
})

passport.deserializeUser((id,done) => {
    users.findById(id)
        .then(user => {
            done(null,user)
        })
        .catch( error => {
            done(error, null)
        })
})

;(async () => {
    try {
      await connect(); 
    } catch (error) {
      console.error("Error:", error);
    }
  })();


app.get('/', async (req, res) => {
    res.render('index',{
        csrfToken : req.csrfToken()
    });   
})


app.get('/signup', (req, res) => {
    res.render('signup',{csrfToken : req.csrfToken()})
})


app.get('/login', (req, res) => {
    res.render('login',{csrfToken : req.csrfToken()}    )
})

app.post(
    "/session",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    function (request, response) {
      response.redirect("/todos");
    }
  );


app.get('/signout',(req, res,next) => {
    req.logout((error) => {
        if(error) { return next(error); }
        res.redirect('/');
    })
})


app.post('/users',async (req, res) => {

    if (req.body.email.length == 0) {
        req.flash("error", "Email can not be empty");
        return res.redirect("/signup");
      }
      if (req.body.firstName.length == 0) {
        req.flash("error", "First name can not be empty");
        return res.redirect("/signup");
      }
      if (req.body.password.length == 0) {
        req.flash("error", "Password can not be empty");
        return res.redirect("/signup");
      }

    try {
        const user = await users.addUser({
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "password": req.body.password
        })
        req.login(user, (err) => { 
            if(err){
                return console.log("Failied in login",err)
            }
            req.flash("success", "Sign up successful");
            res.redirect('/todos')
        })
    } catch (error){
        console.log("Failed in adding user",error);
        req.flash("error", "User Already Exist with this mail");
        return res.status(422).json(error);
    }
})


app.get('/todos', connectEnsureLogin.ensureLoggedIn() ,async (req, res) => {
    try {
        const allTodos = await TodoList.getAllTodos(req.user._id); 
        const overdue = await TodoList.overdue(req.user._id);
        const dueToday = await TodoList.dueToday(req.user._id);
        const dueLater = await TodoList.dueLater(req.user._id);
        const completedItems = await TodoList.completedItems(req.user._id);

        if(req.accepts('html')) {
            res.render('todos',{
                allTodos,
                overdue,
                dueToday,
                dueLater,
                completedItems,
                csrfToken : req.csrfToken()
            });
        }
        else{
            res.json({
                overdue,
                dueToday,
                dueLater,
            });
        }        
    } catch (error) {
        console.log("Failed in retreving todo",error);
        return res.status(422).json(error);
    }
    
})

app.post('/todos', connectEnsureLogin.ensureLoggedIn() , async (req, res) => {
    if (req.body.dueDate.length == 0) {
        req.flash("error", "Date can not be empty");
        return res.redirect("/todos");
      }
      if (req.body.title.length == 0) {
        req.flash("error", "Title can not be empty");
        return res.redirect("/todos");
      } else if (req.body.title.length < 5) {
        req.flash("error", "Title should be atleat 5 character in length");
        return res.redirect("/todos");
      }
    try{
        await TodoList.addTodo({
            "title": req.body.title, 
            "dueDate": req.body.dueDate,
            "userId": req.user._id
        })
        return res.redirect("/todos");
    } catch (error){
        console.log("Failed in adding todo",error);
        return res.status(422).json(error);
    }
})

app.put('/todos/:id', connectEnsureLogin.ensureLoggedIn() , async (req, res) => {
    const todo = await TodoList.findById(req.params.id);
    try{
        const updatedTodo = await todo.setCompletionStatus();
        return res.json(updatedTodo);
    } catch (error) {
        console.log("Failed in updating todo",error);
        return res.status(422).json(error);
    }
})

app.delete('/todos/:id', connectEnsureLogin.ensureLoggedIn() , async (req, res) => {
    const todo = await TodoList.findById(req.params.id);
    try{
        const deleteTodo = await todo.deleteTodo(req.user._id);
        return res.json(deleteTodo);
    } catch (error) {
        console.log("Failed in deleting todo",error);
        return res.status(422).json(error);
    }
})

app.listen(5000, (error) => {
    if(error) console.log(error);
    console.log("Listening to port 5000");
})