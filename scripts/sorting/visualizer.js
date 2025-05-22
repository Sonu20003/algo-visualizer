const container = document.getElementById(`container`);
const blockCount = 8;
const delay = 1000;
const rootStyles = getComputedStyle(document.documentElement);
const og_color = '#C43EF9FF';

//BubbleSort code:

async function bubbleSort(){
    document.documentElement.style.setProperty('--minHeight','500px');
    createArray(blockCount);
    const blocks = container.children;
    const ogColor = blocks[0].style.borderColor;
    
    for(let i=0; i<blockCount; i++){
        for(let j=0; j<blockCount-i-1; j++){
            const block1 = blocks[j];
            const block2 = blocks[j+1];
            block1.style.borderColor='#e74c3c';
            block2.style.borderColor='#e74c3c';
            await new Promise(resolve => setTimeout(resolve, 1000));

            if(parseInt(block1.textContent) > parseInt(block2.textContent)){
                swap(block1,block2);
                await new Promise(resolve => setTimeout(resolve, 2000));

            }
            block1.style.borderColor=ogColor;
            block2.style.borderColor=ogColor;
            
        }
    }
}

function createArray(blockCount){
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    for(let i=0; i<blockCount; i++){
        const value = Math.floor(Math.random()*100)+10;
        const block = document.createElement(`span`);
        block.textContent = value;
        block.setAttribute("id", `span0${i}`);
        container.appendChild(block);
    }
}

async function swap(div1, div2) {
    document.documentElement.style.setProperty('--swapDist','60px');
    div1.classList.add("slideInRight");
    div2.classList.add("slideInLeft");
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const temp = div1.textContent;
    div1.textContent = div2.textContent;
    div2.textContent = temp;
    div1.classList.remove("slideInRight");
    div2.classList.remove("slideInLeft");   
}
export {bubbleSort};


//selectionSort Exclusive Code:

function createArraySlc(){
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    for(let i=0; i<blockCount; i++){
        const val = Math.floor(Math.random()*100)+10;
        const block = document.createElement(`span`);
        const value = document.createElement(`div`);
        value.textContent=val;
        const index = document.createElement(`div`);
        index.style.color = "#adff2f";
        index.textContent=i;
        block.setAttribute("id", `span${i}`);
        container.appendChild(block);
        block.appendChild(value);
        block.appendChild(index);

    }
}

async function selectionSort(){
    document.documentElement.style.setProperty('--minHeight','200px');

    createArraySlc();
    const block = document.createElement(`span`);
    block.textContent = "Min";
    block.setAttribute("id", "min");
    container.appendChild(document.createElement("br"));
    container.appendChild(block);


    const blocks = container.children;
    const ogColor = blocks[0].style.borderColor;
    
    for(let i=0; i<blockCount; i++){
        let min = i;
        let block1 = blocks[min];
        let slide=0;

        block1.style.borderColor = `#e74c3c`;

        await new Promise(resolve => setTimeout(resolve, 500));
        slide = slidePixels(i);
        document.documentElement.style.setProperty('--minSlide',`${slide}px`);

        const textBlock = document.querySelector(`#span${i} > div:nth-child(2)`);

        textBlock.classList.add("newMinimum");
        await new Promise(resolve => setTimeout(resolve, 1800));
        block.textContent = parseInt(i);
        await new Promise(resolve => setTimeout(resolve, 201));
        textBlock.classList.remove("newMinimum");
        let minimum = blocks[i].textContent.slice(0,-1);

        for(let j=i+1; j<blockCount; j++){
            
            let block2 = blocks[j];
            block2.style.borderColor = `#0000ff`;
            await new Promise(resolve => setTimeout(resolve, 500));
            const textBlockj = document.querySelector(`#span${j} > div:nth-child(2)`);


            if(minimum > parseInt(block2.textContent.slice(0,-1))){

                minimum = block2.textContent.slice(0,-1);
                
                //pixels setter:
                slide = slidePixels(j);
                document.documentElement.style.setProperty('--minSlide',`${slide}px`);
                //animations: 
                textBlockj.classList.add("newMinimum");
                await new Promise(resolve => setTimeout(resolve, 1800));
                block.textContent = parseInt(textBlockj.textContent);
                await new Promise(resolve => setTimeout(resolve, 201));
                textBlockj.classList.remove("newMinimum");
                //coding part
                min = j;
            }
            block2.style.borderColor = ogColor;
        }

       if(min !== i){
            //swapAnimation
            const element1 = document.querySelector(`#span${i} > div:nth-child(1)`);
            const element2 = document.querySelector(`#span${min} > div:nth-child(1)`);
            
            swapAnimation(element1, element2, (min-i)*60,"whiteSmoke");
            await new Promise(resolve => setTimeout(resolve, 2000));

            
            const temp = parseInt(document.getElementById(`span${min}`).childNodes[0].textContent);
            document.getElementById(`span${min}`).childNodes[0].textContent = parseInt(document.getElementById(`span${i}`).childNodes[0].textContent);
            document.getElementById(`span${i}`).childNodes[0].textContent = temp;
            await new Promise(resolve => setTimeout(resolve, 500));

        }       
        block1.style.borderColor = ogColor;
    }

}
async function swapAnimation(element1 , element2, pixNo, og){

    document.documentElement.style.setProperty('--swapDist',`${pixNo}px`);
    element1.style.color = "#ffff00";
    element2.style.color = "#ffff00";

    element1.classList.add("slideInRight");
    element2.classList.add("slideInLeft");
    await new Promise(resolve => setTimeout(resolve, 2000));

    element1.style.color = og;
    element2.style.color = og;

    element1.classList.remove("slideInRight");
    element2.classList.remove("slideInLeft");
    
}

function slidePixels(indici){
    let mid = Math.floor((blockCount-1) / 2);
    let pixels = 0;

    if (blockCount % 2 == 0) {
        pixels = 30;
        if (mid == indici-1) {return -pixels;}
            else if (mid == indici) {return pixels;} 
            else {
            pixels = pixels + Math.abs((mid - indici) * 60);
            if (indici < mid) {return pixels;} 
            else {return -(pixels - 60);}
        }
    } else {
        
        if (mid == indici) { return 0;} 
        else {
            pixels = pixels + Math.abs((mid - indici) * 60);
            if (indici < mid) { return pixels;}
             else { return -pixels;}
        }
    }
}
export {selectionSort};


// InsertionSort code: 

async function insertionSort(){
    document.documentElement.style.setProperty('--minHeight','500px');
    createArray(blockCount);
    const blocks = container.children;
    const ogColor = blocks[0].style.borderColor;
    let j=0;
    let shifts=0;
    for(let i=1; i<blockCount; i++){

        j = i-1;
        shifts=0;
        let block1 = blocks[i];
        block1.style.borderColor = "#e74c3c";
        blocks[j].style.borderColor = "#0000ff";
        block1.classList.add("dragDown");
        await new Promise(resolve => setTimeout(resolve, 1500));


        while(j>=0 && parseInt(block1.textContent) < parseInt(blocks[j].textContent)){
            blocks[j].style.borderColor = "#0000ff";
            blocks[j].classList.add("shiftRight");
            await new Promise(resolve => setTimeout(resolve, 1000));
            blocks[j].style.borderColor = ogColor;
            j--;
            shifts++;
        }
        if(j>=0){ blocks[j].style.borderColor = ogColor; }

        shifts = shifts * 60;
        document.documentElement.style.setProperty('--x',`${shifts}px`);
        block1.classList.add("restingPosition");
        await new Promise(resolve => setTimeout(resolve, 2000));

        j=0;
        while(j<blockCount){
            blocks[j].classList.remove("shiftRight");
            j++;
        }
        block1.classList.remove("dragDown");
        block1.classList.remove("restingPosition");
        block1.style.borderColor = ogColor;

        //actual sorting algorithm: start
        j=i-1;
        let key = parseInt(block1.textContent);
        while(j>=0 && key < parseInt(blocks[j].textContent)){
            blocks[j+1].textContent = blocks[j].textContent;
            j--;
        }
        blocks[j+1].textContent = key;
    }
}
export {insertionSort};






// MergeSort Code #_*%##k

function generateArray(blockCount){
    let array = [];
    for(let i=0; i<blockCount; i++){
        let random_val = Math.floor(Math.random()*100)+10;
        array.push(random_val);
    }
    return array;
}
function createArrayMS(arr, level){
    for(let i=0; i<arr.length; i++){
        const block = document.createElement(`span`);
        const value = document.createElement(`div`);
        value.textContent=arr[i];
        value.setAttribute("id", `text${level}${position}`);
        value.classList.add("merge-blocks");
        block.setAttribute("id", `span${level}${position}`);
        block.appendChild(value);
        container.appendChild(block);
        position = (position+1)%blockCount;
    }
}


let position=0;
function split(array) {

    const queue = [];
    queue.push(array);
    let level = 0;
    while(queue.length > 0){
        let len = queue.length;
        while(len > 0){
            let arr = queue[0];
            if(!arr) return;
            container.appendChild(document.createTextNode('   ㅤ  '));
            createArrayMS(arr, level);
            container.appendChild(document.createTextNode('   ㅤ  '));
            queue.shift();
            divide_array(arr, queue);
            len--;
        }
        level++;
        container.appendChild(document.createElement('br'));
    }
}
function divide_array(arr, queue){
    if(arr.length === 1)
        return;

    let leftArray=[],rightArray=[];
    let i=0, mid = arr.length/2;
    while(i < arr.length){
        if(i < mid)
            leftArray.push(arr[i]);
        else
            rightArray.push(arr[i]);
        i++;
    }
    queue.push(leftArray);
    queue.push(rightArray);
}

async function level2animations(start) {
    return new Promise(resolve => {
        let parent_node = [];
        parent_node.push(document.getElementById(`span2${start}`));
        parent_node.push(document.getElementById(`span2${start + 1}`));

        const leftChild = document.getElementById(`span3${start}`);
        const rightChild = document.getElementById(`span3${start + 1}`);

        parent_node[0].classList.add('glow-border');
        leftChild.style.borderColor = 'red';
        rightChild.style.borderColor = 'blue';

        const x1 = document.getElementById(`text3${start}`),
            x2 = document.getElementById(`text3${start + 1}`);

        if (+x1.textContent <= +x2.textContent) {
            let rect1 = parent_node[0].getBoundingClientRect();
            let rect2 = leftChild.getBoundingClientRect();
            let dist = rect1.left - rect2.left;
            document.documentElement.style.setProperty('--mergeSlide', `${dist}px`);
            x1.classList.add('mergeRestingPlace');

            // First timeout, return a promise
            setTimeout(() => {
                x1.classList.remove('mergeRestingPlace');
                parent_node[0].classList.remove('glow-border');
                parent_node[1].classList.add('glow-border');

                rect1 = parent_node[1].getBoundingClientRect();
                rect2 = rightChild.getBoundingClientRect();
                dist = rect1.left - rect2.left;
                document.documentElement.style.setProperty('--mergeSlide', `${dist}px`);
                x2.classList.add('mergeRestingPlace');

                // Second timeout, return a promise
                setTimeout(() => {
                    x2.classList.remove('mergeRestingPlace');
                    parent_node[1].classList.remove('glow-border');
                    leftChild.style.borderColor = og_color;
                    rightChild.style.borderColor = og_color;
                    resolve(); // Resolve the promise when animation ends
                }, 2000);
            }, 2000);

        } else {
            let rect1 = parent_node[0].getBoundingClientRect();
            let rect2 = rightChild.getBoundingClientRect();
            let dist = rect1.left - rect2.left;
            document.documentElement.style.setProperty('--mergeSlide', `${dist}px`);
            x2.classList.add('mergeRestingPlace');

            // First timeout, return a promise
            setTimeout(() => {
                document.getElementById(`text2${start}`).textContent = x2.textContent;
                x2.classList.remove('mergeRestingPlace');
                parent_node[0].classList.remove('glow-border');
                parent_node[1].classList.add('glow-border');

                rect1 = parent_node[1].getBoundingClientRect();
                rect2 = leftChild.getBoundingClientRect();
                dist = rect1.left - rect2.left;
                document.documentElement.style.setProperty('--mergeSlide', `${dist}px`);
                x1.classList.add('mergeRestingPlace');

                // Second timeout, return a promise
                setTimeout(() => {
                    document.getElementById(`text2${start + 1}`).textContent = x1.textContent;
                    x1.classList.remove('mergeRestingPlace');
                    parent_node[1].classList.remove('glow-border');
                    leftChild.style.borderColor = og_color;
                    rightChild.style.borderColor = og_color;
                    resolve(); // Resolve the promise when animation ends
                }, 2000);
            }, 2000);
        }
    });
}


async function upperLevelAnimations(start, level){
    return new Promise(async resolve => {
        const len = (level === 0) ? 8 : 4;
        const parent = [];
        const parent_arr = [];
        for (let i = start; i < (start + len); i++) {
            parent.push(document.getElementById(`span${level}${i}`));
            parent_arr.push(document.getElementById(`text${level}${i}`));
        }

        const left_child = [], right_child = [];
        const left_child_arr = [], right_child_arr = [];

        let mid = start + (len / 2);

        for (let i = start; i < (start + len); i++) {
            let cell = document.getElementById(`span${level+1}${i}`);
            let txt = document.getElementById(`text${level+1}${i}`);
            if (i < mid) {
                left_child.push(cell);
                left_child_arr.push(txt);
            } else {
                right_child.push(cell);
                right_child_arr.push(txt);
            }
        }


        let i = 0, li = 0, ri = 0;
        while (li < left_child.length && ri < right_child.length) {
            let par = parent[i];
            let rect1 = par.getBoundingClientRect();
            par.classList.add('glow-border');

            left_child[li].style.borderColor = 'red';
            right_child[ri].style.borderColor = 'blue';

            if (+left_child_arr[li].textContent <= +right_child_arr[ri].textContent) {
                let rect2 = left_child[li].getBoundingClientRect();
                let dist = rect1.left - rect2.left;

                document.documentElement.style.setProperty('--mergeSlide', `${dist}px`);
                left_child_arr[li].classList.add('mergeRestingPlace');

                await create_delay(2000);

                parent_arr[i].textContent = left_child_arr[li].textContent;
                left_child_arr[li].classList.remove('mergeRestingPlace');
                par.classList.remove('glow-border');
                left_child[li].style.borderColor = og_color;
                right_child[ri].style.borderColor = og_color;
                li++;
                i++;
            }
            else {
                let rect2 = right_child[ri].getBoundingClientRect();
                let dist = rect1.left - rect2.left;

                document.documentElement.style.setProperty('--mergeSlide', `${dist}px`);
                right_child_arr[ri].classList.add('mergeRestingPlace');

                await create_delay(2000);

                parent_arr[i].textContent = right_child_arr[ri].textContent;
                right_child_arr[ri].classList.remove('mergeRestingPlace');
                par.classList.remove('glow-border');
                left_child[li].style.borderColor = og_color;
                right_child[ri].style.borderColor = og_color;
                ri++;
                i++;
            }
        }

        while (li < left_child.length) {
            let rect1 = parent[i].getBoundingClientRect();
            let rect2 = left_child[li].getBoundingClientRect();
            let dist = rect1.left - rect2.left;
            parent[i].classList.add('glow-border');
            left_child[li].style.borderColor = 'red';

            document.documentElement.style.setProperty('--mergeSlide', `${dist}px`);
            left_child_arr[li].classList.add('mergeRestingPlace');

            await create_delay(2000);

            parent_arr[i].textContent = left_child_arr[li].textContent;
            left_child_arr[li].classList.remove('mergeRestingPlace');
            parent[i].classList.remove('glow-border');
            left_child[li].style.borderColor = og_color;
            li++;
            i++;
        }

        while (ri < right_child.length) {
            let rect1 = parent[i].getBoundingClientRect();
            let rect2 = right_child[ri].getBoundingClientRect();
            let dist = rect1.left - rect2.left;
            parent[i].classList.add('glow-border');
            right_child[ri].style.borderColor = 'blue';

            document.documentElement.style.setProperty('--mergeSlide', `${dist}px`);
            right_child_arr[ri].classList.add('mergeRestingPlace');

            await create_delay(2000);

            parent_arr[i].textContent = right_child_arr[ri].textContent;
            right_child_arr[ri].classList.remove('mergeRestingPlace');
            parent[i].classList.remove('glow-border');
            right_child[ri].style.borderColor = og_color;
            ri++;
            i++;
        }
        resolve();
    });
}

function create_delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function mergeSort()
{
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    document.documentElement.style.setProperty('--minHeight', '200px');
    const array = generateArray(blockCount);
    split(array);

    await level2animations(0);
    await level2animations(2);
    await upperLevelAnimations(0, 1);
    await level2animations(4);
    await level2animations(6);
    await upperLevelAnimations(4, 1);
    await upperLevelAnimations(0,0);
}

export {mergeSort};


// speed controls:

const dds = document.getElementById("dropdown-content-speed");
const dropdownToggle = document.getElementById("dropdown-toggle-speed");
const sl = document.getElementById("slow");
const av = document.getElementById("average");
const fs = document.getElementById("fast");

let speed = [];

function toggleDropdown() {
    if (getComputedStyle(dds).display === "none") {
        dds.style.display = "block";
        dropdownToggle.innerHTML = "Speed ▲";
    } else {
        dds.style.display = "none";
        dropdownToggle.innerHTML = "Speed ▼";
    }
}
function hideDropdown() {
    dds.style.display = "none";
    dropdownToggle.innerHTML = "Speed ▼";
}
dropdownToggle.addEventListener("click", toggleDropdown);

sl.onclick = () => {
    hideDropdown();
    dropdownToggle.innerHTML = "Slow ▼";
}
av.onclick = () => {
    hideDropdown();
    dropdownToggle.innerHTML = "Average ▼";
}
fs.onclick = () => {
    hideDropdown();
    dropdownToggle.innerHTML = "Fast ▼";
}


// end spc


// clear board
document.getElementById('clear').onclick = function clear_up(){
    location.reload();
}
