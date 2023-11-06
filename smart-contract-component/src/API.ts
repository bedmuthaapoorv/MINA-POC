import express, {json} from 'express' 
import bodyParser from 'body-parser';
import register, {authenticate} from './Register.js';
import fs from 'fs'
const app = express();

app.use(json())
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3000;

// app.get('/', async (req, res) => {
//     res.json({ status: true, message: "Our node.js app works" })
// });

const outputLog = fs.createWriteStream('./log.txt');
const consoler = new console.Console(outputLog);

app.post('/authenticationMethods', async (req, res) => {
    let data = req.body;
    // res.send(JSON.stringify(data));
    // console.log(data["method"])
    consoler.log(data["method"])
     if(data["method"]===0){
        // console.log("registration begins at verifier");
        consoler.log("registration begins at verifier");
        res.send(await register(data));
     }
     if(data["method"]===1){
//        console.log("authentication begins");
        consoler.log("authentication begins");
        res.send(await authenticate(data));
     }
    //res.send(data)

})

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));