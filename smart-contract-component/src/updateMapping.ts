import * as fs from 'fs';
import * as MappingJson from './Mapping.json'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function updateMapping(user2publicKey: String, appKey: String){
    let nextUUID=getNextUUID();
    console.log(nextUUID)
    let obj={
        "publicKey": user2publicKey,
        "UUID": nextUUID,
        "appPublicKey": appKey
    }

    // mapping code
    const jsonString = fs.readFileSync(__dirname+'\\Mapping.json', 'utf-8');
    const jsonData=JSON.parse(jsonString);
    // to be continued
    jsonData[nextUUID]=obj;
    jsonData["length"]=nextUUID+1;
    const data=JSON.stringify(jsonData)
    console.log(data)
    fs.writeFileSync(__dirname+'\\Mapping.json', data)
}

// updateMapping("1","1");

function getNextUUID(){
    console.log(process.cwd())
    const jsonString = fs.readFileSync(__dirname+'\\Mapping.json', 'utf-8');
    const jsonData=JSON.parse(jsonString);
    // to be continued
    return jsonData["length"];
}
function getCredFromMapping(uuid: any){
    const jsonString = fs.readFileSync(__dirname+'\\Mapping.json', 'utf-8');
    const jsonData=JSON.parse(jsonString);
    let data=jsonData[uuid];
    console.log(data);
    return data;
}
// console.log(getNextUUID());
export {getNextUUID, getCredFromMapping};
export default updateMapping;