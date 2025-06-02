const { getcontactdetails, sendmsg, getparticipants, getstage, getdealdeatils, getproduct, getsubscriptions } = require("./generalfunctions");
const axios=require('axios')
let templates={
    multiplechange: "welcome_basic_template",
    stagechange: "basic_order_template",
    pricechange: "welcome_basic_template",
    editdate: "welcome_basic_template",
    changeperson: "welcome_basic_template",
    participantupdate:"welcome_basic_template",
    won:"welcome_basic_template",
    lost:"welcome_basic_template",
    reopen:"welcome_basic_template"
}
async function multiplechangedeal(current,template_name,mapping){
    getparticipants(current.id).then(res=>mulchangedeal(current,res,template_name,mapping));
}

async function mulchangedeal(current,participants,template_name,mapping){
    for(i in participants){
        getcontactdetails(i).then(res=>(adddealdetails(current,res,template_name,mapping)))
    }
}

async function adddealdetails(current,contact,template_name,mapping){  
    //console.log(contact)
    for(i in contact){
        getdealdeatils(current.id).then(res=>combinedealandcontact(res,contact[i],template_name,mapping));
    }
    
    
}
async function combinedealandcontact(deal,contact,template_name,mapping){
    //console.log(deal.data)
    for(j in deal.data){
        let temp='deal_'+j
        contact[temp]=deal.data[j]
    }       
    //console.log('newdealcontact')
    //console.log(contact)
    newcontact=[]
    newcontact.push(contact)
    sendmsg(newcontact,template_name,mapping)
}

async function changeperson(id){
    let numbers
    getcontactdetails(id).then(res=>(sendmsg(res,templates.changeperson,1)));
    
}
async function changestage(id,prevstageid,currentstageid){
    getcontactdetails(id).then(res=>(sendstageprev(res,prevstageid,currentstageid)))
}

async function sendstageprev(res,prevstageid,currentstageid){
    let temp=res;
    getstage(prevstageid).then(res=>(
        sendstagecurr(temp,currentstageid,res)
    ))
    
}
async function sendstagecurr(res,currentstageid,prevstage){
    let temp=res
    getstage(currentstageid).then(res=>(combinestages(temp,prevstage,res)))
}
async function combinestages(res,prevstage,currstage){
    let temp=res
    for(i in temp){
        temp[i]['prevstage']=prevstage
        temp[i]['currstage']=currstage
    }
    console.log(temp);
    sendmsg(temp,templates.stagechange,1)
}
async function participantschange(id){
    getparticipants(id).then(res=>(sendparticipants(res)))
}
async function sendparticipants(list){
    for(i in list){
        getcontactdetails(i).then(res=>(sendmsg(res,templates.participantupdate,1)))
    }
}

async function changeclosedate(currdate,prevdate,dealid){
    getparticipants(dealid).then(res=>(senddate(res,currdate,prevdate)))
}

async function senddate(participants,currdate,prevdate){
    for(i in participants){
        getcontactdetails(i).then(res=>(combinedateparti(res,currdate,prevdate)))
    }
}

async function combinedateparti(contact,currdate,prevdate){
    for(i in contact){
        contact[i]['currdate']=currdate
        contact[i]['prevdate']=prevdate  
    }
   sendmsg(contact,templates.editdate,4)
}

async function openfilter(body){
    getcontactdetails(body.current.person_id).then(res=>sendopenfilter(body,res))

}

async function wonfilter(body){
   getparticipants(body.current.id).then(res=>sendwonstatus(res,body.current.status))
}

async function lostfilter(body){
    getcontactdetails(body.current.person_id).then(res=>sendlostfilter(body,res))

}
async function sendopenfilter(body,contact){
    for(i in contact){
        contact[i]['status']=body.current.status
    }
    sendmsg(contact,templates.reopen,5)
       
}
async function sendwonstatus(list,status){
    for(i in list){
        getcontactdetails(i).then(res=>(sendwonfinal(res,status)))
    }
}
async function sendwonfinal(contact,status){
    for(i in contact){
        contact[i]['status']=status
    }
    sendmsg(contact,templates.won,5)
}

async function sendlostfilter(body,contact){
    for(i in contact){
        contact[i]['status']=body.current.status
        contact[i]['reason']=body.current['lost_reason']
    }
    sendmsg(contact,templates.lost,5)
    
}

async function sendsubscript(body){
    getcontactdetails(body.current.person_id).then(res=>combsubscript(body,res))
}


async function combsubscript(body,contact){
    getsubscriptions(body.current.id).then(res=>(combproduct(body,res,contact)))
}

async function combproduct(body,subscriptions,contact){
    getproduct(body.current.id).then(res=>sendrevenuemsg(res,subscriptions,contact))
}

async function sendrevenuemsg(products,subscriptions,contact){
    for(j in contact){
        for(i in subscriptions){
            contact[j][i]=subscriptions[i]
        }
        for(i in products){
            contact[j][i]=products[i]
        }
    }
    //console.log(products)
    sendmsg(contact,templates.pricechange,7);
}


exports.sendsubscript=sendsubscript
exports.openfilter=openfilter
exports.wonfilter=wonfilter
exports.lostfilter=lostfilter
exports.changeclosedate=changeclosedate
exports.multiplechangedeal=multiplechangedeal
exports.changestage=changestage
exports.changeperson=changeperson
exports.participantschange=participantschange