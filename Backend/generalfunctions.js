var request = require('request');
const axios=require('axios')
const lodash=require('lodash');

//var sendmsg = require('./gallaboxaxiosapi').sendmsg;
var pdid = 'eb6671f0-0d02-11ef-8a8d-ff32f7921072';
var pdbaseurl = 'https://api.pipedrive.com/v1/';
var pdngrokurl = 'https://6875-14-142-185-30.ngrok-free.app'
var temp=[]
var notdone=false
var pdapikey = ' 7`';
let gbapisecret='8a896a2ded454623a718c9f38bd4ad00'
let gbapikey='663b3f3afbab3448983cc9f7'
let gbaccid='6638894604bb90bce6292346'
let gbchannelId='663889b8493544375c7dae67'
const gbmsgurl='https://server.gallabox.com/devapi/messages/whatsapp'
let dealchanges=['Change in deal stage',
                'Change in price',
                'Change in expected close date',
                'Change in owner of the deal',
                'Change in no. of participants',
                'When a deal is won',
                'When a deal is lost',
                'When a deal is reopened']
let dealfields=[
    'email_messages_count',
    'cc_email',
    'channel',
    'products_count',
    'acv_currency',
    'next_activity_date',
    'b4cf475203a7ce21f9812be81efb3117206ac722',
    'acv',
    'next_activity_type',
    'local_close_date',
    'next_activity_duration',
    'id',
    'person_id',
    'creator_user_id',
    'expected_close_date',
    'owner_name',
    'arr_currency',
    'participants_count',
    'stage_id',
    'probability',
    'undone_activities_count',
    'active',
    'local_lost_date',
    'person_name',
    'last_activity_date',
    'close_time',
    'org_hidden',
    'next_activity_id',
    'weighted_value_currency',
    'local_won_date',
    'stage_order_nr',
    'next_activity_subject',
    'rotten_time',
    'user_id',
    'visible_to',
    'org_id',
    'notes_count',
    'next_activity_time',
    'channel_id',
    'formatted_value',
    'status',
    'formatted_weighted_value',
    'mrr_currency',
    'first_won_time',
    'origin',
    'last_outgoing_mail_time',
    'origin_id',
    'title',
    'last_activity_id',
    'update_time',
    'activities_count',
    'pipeline_id',
    'lost_time',
    'currency',
    '372d73b8b6a18d21d4d6cddd929553c5d47eb1cf',
    'weighted_value',
    'org_name',
    'value',
    'person_hidden',
    'next_activity_note',
    'arr',
    'files_count',
    'last_incoming_mail_time',
    'label',
    'mrr',
    'lost_reason',
    'deleted',
    'won_time',
    'followers_count',
    'stage_change_time',
    'add_time',
    'done_activities_count'
  ];
let mappings={
    welcome_basic_template:{
        1:{
            customer_name: 'name',
            order_id:'order_id'
        },
        2:{
            customer_name: 'prevsub',
            prevsub: 'prevsub',
            newsub: 'newsub'
        },
        3:{
            customer_name: 'prevtype',
            prevtype: 'prevtype',
            newtype: 'newtype'
        },
        4:{
            customer_name: 'currdate'
        },
        5:{
            customer_name: 'status'
        },
        6:{
            customer_name:'deal_formatted_value'
        },
        7:{
            customer_name:'product_name'
        }
    },
    basic_order_template:{
        1:{
            order_id:'prevstage',
            prevstage: 'prevstage',
            currstage: 'currstage'
    }},
}

async function setCredentials(temp){
    pdapikey=temp.PDapikey
    gbapikey=temp.GBapikey
    gbapisecret=temp.GBapisecret
    gbaccid=temp.GBaccid
}
async function createwebhook(webhookurl){
    let res=await axios({
        method: 'post',
        url: pdbaseurl + 'webhooks',
        headers: {
            'x-api-token': pdapikey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data:{
            "subscription_url": pdngrokurl,
            'event_action': "*",
            "event_object": "*",
            "version": "1.0"
          },
    }
    )
    //console.log(res.data)
    return res.data
}

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
    return res
}
//getwhatsapptemplates()

async function getvariablesofatemplate(id){
    let res=axios({
        method: 'get',
        url:`https://server.gallabox.com/devapi/accounts/${gbaccid}/whatsappTemplates/${id}`,
        headers: {
            'apiSecret': gbapisecret,
            'apiKey': gbapikey,
            'Content-type': 'application/json'
        },
        transformResponse: [function (data) {
            var parsedBody = JSON.parse(data);
            res=parsedBody.variables
            //console.log(res)
            return res
          }]
    }
    );
    return res
}
getvariablesofatemplate('663889b843209f78c262cd27');
async function getdealvalues(body){
    let lime=[]
    for(i in body){
        lime.push(i)
    }
    console.log(lime);
}

async function getdealdeatils(id){
    let res=await axios({
        method: 'get',
        url: pdbaseurl + 'deals/' + id,
        headers: {
            'x-api-token': pdapikey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        transformResponse: [function (data) {
            var parsedBody = JSON.parse(data);
            return parsedBody
          }],
    }
    )
    return res.data
}
async function getcontactdetails(id) {
    let res=await axios({
        method: 'get',
        url: pdbaseurl + 'persons/' + id,
        headers: {
            'x-api-token': pdapikey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        transformResponse: [function (data) {
            var parsedBody = JSON.parse(data);
            var numbers = [];
            var phones = parsedBody.data.phone;
            var i;
            for (i in phones) {
                numbers.push({ "name": parsedBody.data.name, "number": phones[i].value });
            }
            //console.log(numbers)
            //sendmsg(numbers)

            return numbers
          }],
    }
    )
    return res.data
}
//let summa=getcontactdetails(22).then(res=>console.log(res))
async function getstage(id){
    let res=await axios({
        method: 'get',
        url: pdbaseurl + 'stages/' + id ,
        headers: {
            'x-api-token': pdapikey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        transformResponse: [function (data) {
            var parsedBody = JSON.parse(data);
            
            //console.log(numbers)
            //sendmsg(numbers)
            //console.log(parsedBody.related_objects.person)
            //console.log(parsedBody.data)
            return parsedBody.data.name
          }],
    }
    )
    return res.data
}   

async function getparticipants(id){
    let res=await axios({
        method: 'get',
        url: pdbaseurl + 'deals/' + id +'/participants',
        headers: {
            'x-api-token': pdapikey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        transformResponse: [function (data) {
            var parsedBody = JSON.parse(data);
            
            //console.log(numbers)
            //sendmsg(numbers)
            //console.log(parsedBody.related_objects.person)
            return parsedBody.related_objects.person
          }],
    }
    )
    return res.data
}


async function getproduct(id){
    let res=await axios({
        method: 'get',
        url: pdbaseurl + '/deals/' + id+ '/products',
        headers: {
            'x-api-token': pdapikey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        transformResponse: [function (data) {
            var parsedBody = JSON.parse(data);
            //console.log(parsedBody.data)
            var object={};
            object['product_name']=parsedBody.data[0]['name'];
            object['product_order_nr']=parsedBody.data[0]['order_nr'];
            object['product_item_price']=parsedBody.data[0]['item_price'];
            object['product_quantity']=parsedBody.data[0]['quantity'];
            object['product_duration']=parsedBody.data[0]['duration'];
            object['product_duration_unit']=parsedBody.data[0]['duration_unit'];
            object['product_sum_formatted']=parsedBody.data[0]['sum_formatted'];
            object['product_comments']=parsedBody.data[0]['comments'];
            object['product_tax']=parsedBody.data[0]['tax'];
            object['product_discount']=parsedBody.data[0]['discount'];
            object['product_discount_type']=parsedBody.data[0]['discount_type'];
            object['product_billing_frequency']=parsedBody.data[0]['billing_frequency'];
            object['product_billing_frequency_cycles']=parsedBody.data[0]['billing_frequency_cycles'];
            object['product_billing_start_date']=parsedBody.data[0]['billing_start_date'];
            return object;}]
    }
    )
    return res.data

}

async function getsubscriptions(id){
    temp={};
    try {
        let res=await axios({
            method: 'get',
            url: pdbaseurl+'subscriptions/find/'+id,
            headers: {
                'x-api-token': pdapikey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            transformResponse: [function (data) {
                //console.log(data)
                var parsedData = JSON.parse(data);
                parsedBody=parsedData.data
                var object={};
                object['subscriptions_cycle_amount']=parsedBody['cycle_amount'];
                object['subscriptions_cycles_count']=parsedBody['cycles_count'];
                object['subscriptions_currency']=parsedBody['currency'];
                object['subscriptions_lifetime_value']=parsedBody['lifetime_value'];
                object['subscriptions_cadence_type']=parsedBody['cadence_type'];
                
                //sendmsg(numbers)
                //console.log(parsedBody.related_objects.person)
                return object;}]
        }
        )
        return res.data
    } catch (error) {
        return temp
    }
    

}
const sendmsg=(list,gbtemplatename,mapping)=>{
    //console.log(list)
    for(i in list){
        //console.log('91'+list[i].number);
        bodie={}
        //console.log(mapping)
        //console.log(list[i])
        
        for(jo in mapping){
            bodie[jo]=list[i]['deal_'+mapping[jo]]
        }
        console.log(bodie)
        
        const numo=`91${list[i].number}`;
        axios({
            method: 'post',
            url:gbmsgurl,
            data:{
                "channelId": `${gbchannelId}`,
                "channelType": "whatsapp",
                "recipient": {
                    "name": `${list[i].name}`,
                    "phone": numo
                },
                "whatsapp": {
                    "type": "template",
                    "template": {
                        "templateName": `${gbtemplatename}`,
                        "bodyValues": bodie
                    }
                }
            },
            headers: {
                'apiSecret': gbapisecret,
                'apiKey': gbapikey,
                'Content-type': 'application/json'
            }
        }
    )
    }
    
}

function getObjectDiff(obj1, obj2) {
    const diff = Object.keys(obj1).reduce((result, key) => {
        if (!obj2.hasOwnProperty(key)) {
            result.push(key);
        } else if (lodash.isEqual(obj1[key], obj2[key])) {
            const resultKeyIndex = result.indexOf(key);
            result.splice(resultKeyIndex, 1);
        }
        return result;
    }, Object.keys(obj2));

    return diff;
}
const findupdate=(dealobject)=>{
    let temp=getObjectDiff(dealobject.current,dealobject.previous,lodash.isEqual)
    return temp;
}

getstage(1)

exports.createwebhook=createwebhook
exports.getsubscriptions=getsubscriptions
exports.getproduct=getproduct
exports.findupdate=findupdate
exports.sendmsg=sendmsg
exports.getdealdeatils=getdealdeatils;
exports.getcontactdetails=getcontactdetails
exports.getparticipants=getparticipants
exports.getstage=getstage
exports.getdealvalues=getdealvalues
exports.getvariablesofatemplate=getvariablesofatemplate;
exports.getwhatsapptemplates=getwhatsapptemplates
exports.dealfields=dealfields
exports.dealchanges=dealchanges
exports.setCredentials=setCredentials