function sendCreds(data: Object){
    fetch('http://localhost:3000/authenticationMethods',{
    method:"POST",
    body: JSON.stringify(
        data
    ),
    
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then((res)=>{
    res.json().then((res)=>{
        console.log(JSON.stringify(res));
    })
    })
}

// sendCreds({
//     "name":"apoorv"
// })

export default sendCreds;
