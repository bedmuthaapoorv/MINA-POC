import * as fs from 'fs';

function updateMapping(user2publicKey: String, appKey: String){
    let obj={
        "publicKey": user2publicKey,
        "UUID": 1,
        "appPublicKey": appKey
    }

    // mapping code
    const jsonString = fs.readFileSync('./src/Mapping.json', 'utf-8');
    const jsonData=JSON.parse(jsonString);
    // to be continued
    jsonData["entries"].push(obj);
    const data=JSON.stringify(jsonData)
    // console.log(data)
    fs.writeFileSync("./src/Mapping.json", data, {
        flag: 'w'
    })
}

// updateMapping("1","1");

function getNextUUID(){
    const jsonString = fs.readFileSync('./src/Mapping.json', 'utf-8');
    const jsonData=JSON.parse(jsonString);
    // to be continued
    return jsonData["entries"].length;
}

// console.log(getNextUUID());
export {getNextUUID};
export default updateMapping;