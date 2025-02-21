
function display(){
    console.log("Hii there");
}

async function createDelay(ms){
    return new Promise((response)=>{
        setTimeout(()=>{response(true)}, ms)
    })
}

async function run(){
    await createDelay(5000);
    display();
}
console.log("start");
run().then();