const usersModel ={
    getAll:`
    SELECT
        *
    FROM
        users
    `,

    getByID:`
    SELECT
        *
    FROM
        users
    WHERE
        id=?
    `

};
module.exports=usersModel;