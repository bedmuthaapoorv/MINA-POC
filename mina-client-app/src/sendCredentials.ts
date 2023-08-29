import * as fs from 'fs';

async function sendCreds(data: Object){
    let response=null;
    await fetch('http://localhost:3000/authenticationMethods',{
    method:"POST",
    body: JSON.stringify(
        data
    ),
    
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then(async (res)=>{
        await res.json().then(async (res)=>{
            response=JSON.stringify(res);
        })
    })
    //console.log(response);
    return response;
}

// sendCreds({
//     "name":"apoorv"
// })

function storeCert(data: string){
        // mapping code
        // const jsonString = fs.readFileSync('./src/Mapping.json', 'utf-8');
        // const jsonData=JSON.parse(jsonString);
        // to be continued
        // jsonData["entries"].push(obj);
        // const data=JSON.stringify(jsonData)
        // console.log(data)
        fs.writeFileSync("./src/Certificate.json", data, {
            flag: 'w'
        })
}

function isRegistered(){
    return fs.existsSync('./src/Certificate.json');
}

export {storeCert, isRegistered};
export default sendCreds;
