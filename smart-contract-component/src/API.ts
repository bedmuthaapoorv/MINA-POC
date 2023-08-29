import express, {json} from 'express' 
import bodyParser from 'body-parser';
import register from './Register.js';
const app = express();

app.use(json())
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3000;

// app.get('/', async (req, res) => {
//     res.json({ status: true, message: "Our node.js app works" })
// });

app.post('/authenticationMethods', async (req, res) => {
    let data = req.body;
    // res.send(JSON.stringify(data));
    res.send(await register(data));
})

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));