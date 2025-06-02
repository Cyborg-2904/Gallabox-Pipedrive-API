async function getwhatsapptemplates(){
    let res=axios({
        method: 'get',
        url:`https://server.gallabox.com/devapi/accounts/${gbaccid}/whatsappTemplates`,
        headers: {
            'apiSecret': gbapisecret,
            'apiKey': gbapikey,
            'Content-type': 'application/json'
        },
        transformResponse: [function (data) {
            var parsedBody = JSON.parse(data);
            let res={};
            for(i in parsedBody){
                res[parsedBody[i].name]=parsedBody[i].id;
            }
            console.log(res)
            return res
          }]
    }
    );
    return res.data
}