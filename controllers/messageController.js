const pool = require('../db/pool.js')


async function createMessageGet(req, res) {
    const { id } = req.query;
    res.render('message', { id });
}

async function createMessagePost(req, res) {
    const { text, title } = req.body;
    const { id } = req.query;
    const timestamp = new Date();
    // console.log(now);

    let qry = `select firstName,lastName from users where id = $1;`
    const userFound = await pool.query(qry, [id]);
    console.log('userFound', userFound, id)
    const name = userFound.rows[0].firstname + ' ' + userFound.rows[0].lastname;
    qry = `INSERT INTO messages(title,timestamp,text,user_id,createdBy)
     VALUES ($1,$2,$3,$4,$5);`
    await pool.query(qry, [title, timestamp, text, id, name]);

    res.redirect('/');

}
async function deleteMessageGet(req, res) {
    const { id } = req.params;
    let qry = `delete  from messages where id = $1;`
    await pool.query(qry, [id]);
    res.redirect('/');


}




module.exports = {
    createMessageGet,
    createMessagePost,
    deleteMessageGet

}