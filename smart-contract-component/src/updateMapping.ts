import * as fs from 'fs';

function updateMapping(user2publicKey: String, appKey: String){
    let nextUUID=getNextUUID();
    let obj={
        "publicKey": user2publicKey,
        "UUID": nextUUID,
        "appPublicKey": appKey
    }

    // mapping code
    const jsonString = fs.readFileSync('./src/Mapping.json', 'utf-8');
    const jsonData=JSON.parse(jsonString);
    // to be continued
    jsonData[nextUUID]=obj;
    jsonData["length"]=nextUUID+1;
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
    return jsonData["length"];
}
function getCredFromMapping(uuid: any){
    const jsonString = fs.readFileSync('./src/Mapping.json', 'utf-8');
    const jsonData=JSON.parse(jsonString);
    let data=jsonData[uuid];
    return data;
}
// console.log(getNextUUID());
export {getNextUUID, getCredFromMapping};
export default updateMapping;