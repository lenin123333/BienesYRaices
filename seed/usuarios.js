import bcrypt from "bcrypt";

const usuarios=[
    {
        nombre: 'Lenin',
        email:'lenin123@gmail.com',
        confimado:1,
        password:bcrypt.hashSync('lenin1233',10)
    }
]

export default usuarios