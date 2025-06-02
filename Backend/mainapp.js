const http=require('http');
const express=require('express');
const cors = require("cors");
const { findupdate, createwebhook, getdealvalues, getwhatsapptemplates, getvariablesofatemplate,dealchanges,dealfields, setCredentials } = require("./generalfunctions");
const { changeperson, participantschange, changestage, multiplechangedeal, changeclosedate, openfilter, lostfilter, wonfilter, sendsubscript } = require('./dealfunctions');
const { subjectchange, typechange, activitydone } = require('./activityfunctions');
const { template } = require('lodash');
const app=express()
const myserver=http.createServer(app)
app.use(express.json())
let changes={
    dealcreate: 'added.deal',
    dealupdate: 'updated.deal',
    activitynew:'added.activity',
    activityupdate: 'updated.activity'
}
changelist=['person_id','participants_count','stage_id','value','expected_close_date','status']
let fieldstomap={}
var pdapikey = 'e6c73e4bf4213b43d1505af7de3cf9d98982de41';
let gbapisecret='8a896a2ded454623a718c9f38bd4ad00'
let gbapikey='663b3f3afbab3448983cc9f7'
let gbaccid='6638894604bb90bce6292346'
//createwebhook()
function dealfunction(body){
    let temp=findupdate(body);
    console.log(temp);
    let rem;
    for(i in fieldstomap){
        if(temp.includes(i)){
            multiplechangedeal(body.current,fieldstomap[i].template,fieldstomap[i].mapping)
            break;
        }
    }
    /*
        if(temp.includes(changelist[i])){
            rem=changelist[i]
            changelist.splice(i,1)
            break;
        }
    }
    
    for(i in changelist){
        if(temp.includes(changelist[i])){
            multiplechangedeal(body.current)
            return;
        }
    }
    changelist.push(rem)

    if(temp.includes('person_id')){
        changeperson(body.current.person_id)
    }
    if(temp.includes('participants_count')){
        participantschange(body.current.id)
    }
    if(temp.includes('stage_id')){
        changestage(body.current.person_id,body.current.stage_id,body.previous.stage_id)
    }
    if(temp.includes('expected_close_date')){
        changeclosedate(body.current.expected_close_date,body.previous.expected_close_date,body.current.id)
    }
    if(temp.includes('status')){
        if (body['current'].status == "open"){
            openfilter(body);
            //call function to send message
        }
        else if (body['current'].status == "lost"){
            //call function to send message
            console.log("lost");
            lostfilter(body);
        }
        else{
            //call function to send message
            console.log("won");
            wonfilter(body);
        }
    }
    if(temp.includes('value')){
        sendsubscript(body)
    }*/
}
function activityfunction(body){
    let temp=findupdate(body);
    console.log(temp);
    if(temp.includes('subject')){
        subjectchange(body);
    }
    if(temp.includes('type_name')){
        typechange(body);
    }
    if(temp.includes('done')){
        activitydone(body);
    }
}

app.post('/',function(req,res){
    console.log('new change')
    res.status(200).send(req.body)
    //console.log(req.body.event)
    if(changes.dealcreate.localeCompare(req.body.event)==0){
        console.log('deal created')
        multiplechangedeal(req.body.current)
    }else if(changes.dealupdate.localeCompare(req.body.event)==0){
        getdealvalues(req.body.current)
        dealfunction(req.body)
    }else if(changes.activityupdate.localeCompare(req.body.event)==0){
        activityfunction(req.body)
        //console.log(req.body.current.participants)
        let temp=findupdate(req.body)
        console.log(temp)
    }
    
})

myserver.listen(69,function(){
    console.log('listening')
})

//----------------------------API APP------------------------------------//


/*stagechange: "basic_order_template",
pricechange: "welcome_basic_template",
editdate: "welcome_basic_template",
changeperson: "welcome_basic_template",
participantupdate:"welcome_basic_template",
won:"welcome_basic_template",
lost:"welcome_basic_template",
reopen:"welcome_basic_template" */
const api=express()
const corsOptions = {
  origin: "http://localhost:3000",
};
api.use(cors(corsOptions));
const server2=http.createServer(api)
api.use(express.json())

api.get('/templates',function(req,res1){
    temp=getwhatsapptemplates().then(res=>res1.status(200).send(res.data))
})

api.get('/templates/:id',function(req,res1){
    temp=getvariablesofatemplate(`${req.params.id}`).then(res=>res1.status(200).send(res.data))
})
api.get('/deal/actions',function(req,res1){
   res1.status(200).send(dealchanges)
})

api.get('/deal/fields',function(req,res1){
    res1.status(200).send(dealfields)
 })

api.post('/addAutomation',function(req,res){
    res.status(200).send(req.body)
    //console.log(req.body)
    let temp=req.body
    fieldstomap[temp.changefield]={
        template:temp.template,
        mapping: temp.mappings
    }
    console.log(fieldstomap)

})

api.post('/addCredentials',function(req,res){
    res.status(200).send(req.body)
    let temp=req.body;
    setCredentials(temp);
})
server2.listen(420,function(){
    console.log('api started')
})
exports.pdapikey=pdapikey
exports.gbaccid=gbaccid
exports.gbapikey=gbapikey
exports.gbapisecret=gbapisecret