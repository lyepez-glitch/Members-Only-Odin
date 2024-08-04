// async function createUserGet(req, res) {
//     //sanitize and validate
//     //  firstName
//     //  lastName
//     //  username
//     //  password

//     res.render('signUp', {});
// }
// async function createUserPost(req, res) {
//     //sanitize and validate
//     //  firstName
//     //  lastName
//     //  username
//     //  password

//     const lengthErr = "must be between 1 and 20 characters.";

//     const validateFirstName = [
//         body("firstName", "Must be a valid name")
//         .trim()
//         .notEmpty()
//         .withMessage("First name can't be empty")
//         .isAlpha()
//         .withMessage("Name must only contain alphabet letters.")
//         .isLength({ min: 1, max: 20 }).withMessage(`First name ${lengthErr}`),
//     ];

//     const validateLastName = [
//         body("lastName", "Must be a valid last name")
//         .trim()
//         .notEmpty()
//         .withMessage("Last name can't be empty")
//         .isAlpha()
//         .withMessage("Name must only contain alphabet letters.")

//     ];
//     const validateUsername = [
//         body("userName", "Must be a valid username")
//         .trim()
//         .notEmpty()
//         .withMessage("User name can't be empty")
//         .isAlpha()
//         .withMessage("User name must only contain alphabet letters.")

//     ];
//     const validatePassword = [
//         body("password", "Must be a valid password")
//         .trim()
//         .notEmpty()
//         .withMessage("Password can't be empty")
//         res.redirect("/");

//     ];

// [
//     body("admin", "Must be a valid date.")
//     .optional({ values: "falsy" })
//     .isISO8601() // Enforce a YYYY-MM-DD format.
// ];






// }
// async function createUserGet(req, res) {
//     //sanitize and validate
//     //  firstName
//     //  lastName
//     //  username
//     //  password

//     res.render('signUp', {});
// }

// }


// // const asyncHandler = require("express-async-handler");

// // exports.userUpdateGet = asyncHandler(async (req, res, next) => {});
// // exports.userUpdatePost = asyncHandler(async (req, res, next) => {});

// exports.createUserPost = [
//         validateFirstName,
//         validateLastName,
//         validateUserName,
//         validatePassword,

//         asyncHandler(async(req, res) => {
//                 const errors = validationResult(req);
//                 if (!errors.isEmpty()) {
//                     return res.status(400).render("users", {
//                         title: "User List",
//                         errors: errors.array(),
//                         res.redirect("/")
//                     });
//                 }
//             ]

//             module.exports = {
//                 createUserGet
//             };
// app.post(
//   '/create-user',
//   body('password').isLength({ min: 5 }),
//   body('confirm-password').custom((value, { req }) => {
//     return value === req.body.password;
//   }),
//   (req, res) => {
//     // Handle request
//   },
// );

// import { param } from 'express-validator';
// import { ObjectId } from 'mongodb';

// app.post(
//   '/user/:id',
//   param('id').customSanitizer(value => ObjectId(value)),
//   (req, res) => {
//     // req.params.id is an ObjectId now
//   },
// );
const pool = require('../db/pool');
async function createUserGet(req, res) {
    res.render('signUp', {});
}

async function createUserPost(req, res, next) {
    const { fname, lname, email, password, admin } = req.body;
    bcrypt.hash(password, 10, async(err, hashedPassword) => {
        if (err) {
            next(err);
        }
        qry = `INSERT INTO users(firstName,lastName,username,password,admin)
     VALUES ($1,$2,$3,$4) RETURNING id;`

        const insertedUser = await client.query(qry, [fname, lname, email, hashedPassword, admin]);

    });

}

async function createMemberGet(req, res) {
    console.log('req.query id', req.query.id);
    res.render('memberStatus', { id: req.query.id });

};

async function createMemberPost(req, res) {
    const { secret } = req.body;
    console.log('req body', req.body, secret, process.env.SECRET)
    const { id } = req.query;
    console.log('id is', id)
    if (secret === process.env.SECRET) {
        let qry = `UPDATE users
               SET memberStatus = $1
               WHERE id=$2;`
        const result = await pool.query(qry, [true, id]);

        qry = `select * from users
        WHERE id=$1;`
        const rows = await pool.query(qry, [id]);
        console.log('result', result, 'rows', rows, id)
        res.redirect('/');
    }

};



module.exports = {
    createUserGet,
    createUserPost,
    createMemberGet,
    createMemberPost
}