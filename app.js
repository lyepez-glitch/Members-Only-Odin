const express = require('express')

require('dotenv').config();
const { body, validationResult } = require("express-validator");
const { Pool } = require("pg");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const userRouter = require('./routes/userRouter');
const pool = require('./db/pool');
const bcrypt = require('bcryptjs');
const app = express()
const port = process.env.EPORT || 4000;
const path = require('path');
const bodyParser = require('body-parser')

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, "public")));
app.use("/users", userRouter);
const userController = require('./controllers/userController');
const messageController = require('./controllers/messageController');
const connectionStr = `postgresql://${process.env.ROLE}:${process.env.PASSWORD}@localhost:${process.env.PORT}/${process.env.DATABASE}`

// app.use(session({
//     store: new(require('connect-pg-simple')(session))({
//         // Insert connect-pg-simple options here
//         pool: pool,
//         tableName: 'session'
//     }),
//     secret: process.env.FOO_COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
//     // Insert express-session options here
// }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            console.log(47, username, password)
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = rows[0];
            console.log(50, user)
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            console.log('match', match, password, user.password)
            if (!match) {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" })
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", async(req, res) => {
    console.log('req user', req.user)
    const { rows } = await pool.query("SELECT * FROM messages", []);
    console.log('rows', rows)
    res.render("index", { user: req.user, messages: rows });

});

app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
app.get("/signUp", (req, res) => {
    res.render("signUp", {});
});
const lengthErr = "must be between 1 and 20 characters.";
const validateFirstName = [
    body("fname", "Must be a valid name")
    .trim()
    .notEmpty()
    .withMessage("First name can't be empty")
    .isAlpha()
    .withMessage("Name must only contain alphabet letters.")
    .isLength({ min: 1, max: 20 }).withMessage(`First name ${lengthErr}`),
];
const validateLastName = [
    body("lname", "Must be a valid last name")
    .trim()
    .notEmpty()
    .withMessage("Last name can't be empty")
    .isAlpha()
    .withMessage("Last Name must only contain alphabet letters.")

];
const validateUsername = [
    body("email", "Must be a valid username")
    .trim()
    .notEmpty()
    .withMessage("User name can't be empty")


];
const validatePassword = [
    body("password", "Must be a valid password")
    .trim()
    .notEmpty()
    .withMessage("Password can't be empty")


];
app.post("/signUp", validateFirstName, validateLastName, validateUsername, validatePassword, body('password').isLength({ min: 5 }), body('confirmPassword').custom((value, { req }) => {
    console.log('value', value, 'req.body.password', req.body.password)
    if (value !== req.body.password) {
        throw new Error("Passwords do not match");
    };
    return true;
}), async(req, res) => {
    // console.log("req body", req.body)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('errors', errors)
        return res.status(400).render("signUp", {
            title: "Create user",
            errors: errors.array(),
        });
    }



    let { fname, lname, email, password, confirmPassword, admin } = req.body;
    bcrypt.hash(password, 10, async(err, hashedPassword) => {
        // if err, do something
        // otherwise, store hashedPassword in DB
        let qry = `INSERT INTO users(firstName,lastName,username,password,admin,memberStatus)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;`
        if (admin === 'on') {
            admin = true;
        } else {
            admin = false;
        }
        const insertedUser = await pool.query(qry, [fname, lname, email, hashedPassword, admin, false]);
        console.log('insertedUser', insertedUser)
        res.redirect('/');

    });




});

app.get('/memberStatus', userController.createMemberGet);
app.post('/memberStatus', userController.createMemberPost);

app.get('/message', messageController.createMessageGet);
app.post('/message', messageController.createMessagePost);
app.get('/message/delete/:id', messageController.deleteMessageGet);

app.get("/log-in", (req, res) => {
    res.render("login", {});
})

app.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);












app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`)
})