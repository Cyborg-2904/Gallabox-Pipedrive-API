const { getcontactdetails, sendmsg } = require("./generalfunctions");

let templates={
    newactivity: "basic_order_template",
    subjectchange: "welcome_basic_template",
    typechange: "welcome_basic_template",
    dealchange: "welcome_basic_template",
    participantupdate: "welcome_basic_template",
    headnumberchange:"welcome_basic_template",
    duedatetimechange:"welcome_basic_template",
    activitydone:"welcome_basic_template",
    durationchange:"welcome_basic_template",
    busy:"welcome_basic_template",
    free:"welcome_basic_template",
    locationchange:"welcome_basic_template",
}
function subjectchange(body){
    let temp=body.current.participants;
    //console.log(temp)
    let people;
    for(i in temp){
        //console.log(temp[i].person_id)
        getcontactdetails(temp[i].person_id).then(res=>subjectsend(body.previous.subject,body.current.subject,res))
    }
}
function subjectsend(prevsub,newsub,contact){
    for(i in contact){
        contact[i]['prevsub']=prevsub
        contact[i]['newsub']=newsub
    }
    sendmsg(contact,templates.subjectchange,2);
}

function typechange(body){
    let temp=body.current.participants;
    let people;
    for(i in temp){
        getcontactdetails(temp[i].person_id).then(res=>typesend(body.previous.type_name,body.current.type_name,res))
    }
}
function typesend(prevtype,newtype,contact){
    for(i in contact){
        contact[i]['prevtype']=prevtype
        contact[i]['newtype']=newtype
    }
    sendmsg(contact,templates.typechange,3)
}

function activitydone(body){
    let temp=body.current.participants;
    let people;
    for(i in temp){
        getcontactdetails(temp[i].person_id).then(res=>sendmsg(res,templates.activitydone,1))
    }
}

exports.activitydone=activitydone
exports.typechange=typechange
exports.subjectchange=subjectchange