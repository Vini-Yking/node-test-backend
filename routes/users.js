const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

let users = readUsersFromFile()

const CONTENT = 'Content-Type'
const APPLICATION = 'application/json'

function getUsers(req, res) {
    res.statusCode = 200;
    res.setHeader(CONTENT, APPLICATION);
    res.end(JSON.stringify({ users }))
}

function createUser(req, res) {
    let body = ''
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const data = JSON.parse(body)
        if (data.name) {
            const newUser = {
                id: randomUUID(), name: data.name 
            }
            users.push(newUser);
            writeUsersToFile(users)
            setDataRes(res, 201, { message: `User ${data.name} created` })
        } else {
            setDataRes(res, 400, { error: `Name required` })
        }
    })
}

function deleteUser(req, res) {
    const userId = req.url.split('/').pop();
    const userIndex = users.findIndex(user => user.id === userId )
    
    if (userIndex !== -1) {
        const deleteUser = users.splice(userIndex , 1)
        writeUsersToFile(users);
        setDataRes(res,200, { message: `User ${deleteUser[0].name} deleted` })
    } else {
        setDataRes(res, 404 , {error : 'Not Found' })
    }
}

function readUsersFromFile() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function writeUsersToFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function setDataRes(res, statusCode,end) {
    res.statusCode = statusCode
    res.setHeader(CONTENT, APPLICATION)
    res.end(JSON.stringify(end));
}
module.exports = {
    'GET /users': getUsers,
    'POST /users': createUser,
    'DELETE /users/:id': deleteUser
};