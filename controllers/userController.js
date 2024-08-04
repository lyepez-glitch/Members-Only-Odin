//
//



//
//
//

//






// }



// /

//
//

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