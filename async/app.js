console.log("start" );

getMember('promise: ')
    .then(member => getArticles(member))
    .then(articles => console.log('promise: ',articles))
    .catch(err => console.log(err.message));

(async ()=>{
    try{
        let member = await getMember('async: ');
        let articles = await getArticles(member);
        console.log('async: ',articles);
    }
    catch(err){
        console.log(err.message);
    }
})()

function getMember(system) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const member = "member1";
            console.log(system,member)
            resolve(member);
            reject(new Error("error getMember"));
        }, 2000)
    })
}

function getArticles(member){
    return new Promise ((resolve,reject) => {
        setTimeout(() => {
            resolve([1,2,3]);
            reject(new Error("error getArticles"));
        }, 1500);
    })
}

console.log("end" );