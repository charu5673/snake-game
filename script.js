var direction="Right";
var head=[5,4];
var tail=[[5,4],[5,3],[5,2],[5,1],[5,0],[4,0],[4,1],[4,2],[3,2],[3,1],[3,0]];
var speedFlag=true;
let fruit=null;

let gridi=30;
let gridj=30;
let colFlag=false;
let wallFlag=false;
let flag=true;
let speed=400;

document.querySelector("#rows").addEventListener("input",(e)=>{
    if(e.target.value>=10&&e.target.value<=100)
    gridi=e.target.value;
});

document.querySelector("#columns").addEventListener("input",(e)=>{
    if(e.target.value>=10&&e.target.value<=100)
    gridj=e.target.value;
});

document.querySelector(".generate").addEventListener("click",()=>{
    generateGrid();
});

document.querySelector(".collison").addEventListener("click",(e)=>{
    if(e.target.textContent=="Collision mode")
    {
        colFlag=true;
        e.target.textContent="No collision mode";
    }
    else
    {
        colFlag=false;
        e.target.textContent="Collision mode";
    }
});

document.querySelector(".walls").addEventListener("click",(e)=>{
    if(e.target.textContent=="Blocked walls")
    {
        wallFlag=true;
        e.target.textContent="Unblocked walls";
    }
    else
    {
        wallFlag=false;
        e.target.textContent="Blocked walls";
    }
});

function generateGrid()
{
    head=[5,4];
    tail=[[5,4],[5,3],[5,2],[5,1],[5,0],[4,0],[4,1],[4,2],[3,2],[3,1],[3,0]];
    let d=document.querySelector(".outer_box");
    d.innerHTML="";
    for(var i=0;i<gridi;i++)
    {
        let r=document.createElement("div");
        r.classList.add("row",""+i);
        for(var j=0;j<gridj;j++)
        {
            let x=document.createElement("div");
            x.classList.add("box","i"+i,"j"+j);
            r.appendChild(x);
        }
        d.appendChild(r);
    }
    initSnek();

    newFruit();
}

const stylesheet = document.createElement('style');
document.head.appendChild(stylesheet);
stylesheet.textContent = ".snek {background-color: greenyellow;} .head {background-color: darkgreen; border-radius:100px}";

var color=document.querySelector(".color");

color.addEventListener("input",(e)=>{
    let color=e.target.value;
    let r=color.substring(1,3);
    r=parseInt("0x"+r);
    r=Math.max(0,r-50);
    let g=color.substring(3,5);
    g=parseInt("0x"+g);
    g=Math.max(0,g-50);
    let b=color.substring(5);
    b=parseInt("0x"+b);
    b=Math.max(0,b-50);
    color=`rgb(${r},${g},${b})`;
    stylesheet.textContent=`.snek {background-color: ${e.target.value}}
    .head {background-color: ${color}; border-radius:100px}`;
});

document.querySelector(".speed").addEventListener("click",(e)=>{
    if(e.target.textContent=="Constant speed")
    {
        speedFlag=false;
        e.target.textContent="Increasing speed";
    }
    else
    {
        speedFlag=true;
        e.target.textContent="Constant speed";
    }
});

document.querySelector(".reset").addEventListener("click",(e)=>{
    direction="Right";
speedFlag=true;
fruit=null;
flag=true;
speed=400;
document.querySelector(".speedUp").disabled=false;
generateGrid();
});

let tracker=0;


function newFruit()
{
    let i,j,c=0;
    do
    {
    i=Math.floor(Math.random()*gridi);
    j=Math.floor(Math.random()*gridj);
    c++;
    if(c==10000)
    {
        check();
        break;
    }
    }
    while(document.querySelector(query(i,j)).classList.contains("snek"))
    fruit=[i,j];
    document.querySelector(query(i,j)).classList.add("fruit");
}

function check()
{
    document.querySelectorAll(".row").forEach(a=>{
        a.childNodes.forEach(b=>{
            if(b.nodeName=="DIV")
            {if(!(b.classList.contains("snek")||b.classList.contains("fruit")))
                {
                    newFruit();
                    return;
                }
            }
        });
    });
    flag=false;
    alert("You win!");
}

document.querySelector(".speedUp").addEventListener("click",(e)=>{
    if(speed>50)
    speed-=50;
    if(tracker>speed)
        tracker=0;
    if(speed<=50)
        e.target.disabled=true;
});

document.querySelector(".speedDown").addEventListener("click",(e)=>{
    speed+=50;
    if(tracker>speed)
        tracker=0;
    if(speed>=100)
        document.querySelector(".speedUp").disabled=false;
});

document.querySelector(".pause").addEventListener("click",(e)=>{
    if(e.target.textContent=="Pause")
    {
        flag=false;
        e.target.textContent="Play";
    }
    else
    {
        flag=true;
        e.target.textContent="Pause";
    }
});

generateGrid(100,100);

function query(i,j)
{
    let query=`.i${i}.j${j}`;
    return query;
}

function initSnek()
{
    document.querySelector(query(tail[0][0],tail[0][1])).classList.add("head");
    tail.forEach(a=>{
        if(!document.querySelector(query(a[0],a[1])).classList.contains("snek"))
        document.querySelector(query(a[0],a[1])).classList.add("snek");
    });
}

document.addEventListener("keydown",function(e)
{
    if(e.key.substring(0,5)=="Arrow")
    {
        if((!colFlag)||(!((direction=="Right"&&e.key.substring(5)=="Left")||(direction=="Left"&&e.key.substring(5)=="Right")||(direction=="Up"&&e.key.substring(5)=="Down")||(direction=="Down"&&e.key.substring(5)=="Up"))))
        {direction=e.key.substring(5);
        tracker=0;
        move();}
    }
    else if(e.code=="Space")
    {
        flag=!flag;
        if(flag)
            document.querySelector(".pause").textContent="Pause";
        else
        document.querySelector(".pause").textContent="Play";
    }
});

function move()
{
    let newHead=changeDir(head);
    if(newHead==null)
        {
            alert("You lose!");
            flag=false;
            return;
        }
    document.querySelector(query(newHead[0],newHead[1])).classList.add("snek");
    document.querySelector(query(newHead[0],newHead[1])).classList.add("head");
    document.querySelector(query(head[0],head[1])).classList.remove("head");
    if(colFlag)
    {
        for(var i=0;i<tail.length;i++)
        {
            if(newHead[0]==tail[i][0]&&newHead[1]==tail[i][1])
            {
                alert("You lose!");
                flag=false;
                return;
            }
        }
    }
    moveTail(newHead);
    head=newHead;
}

function moveTail(n)
{
    let disc=tail[tail.length-1];
    for(var i=tail.length-1;i>0;i--)
    {
        tail[i]=tail[i-1];
    }
    tail[0]=n;
    if(n[0]==fruit[0]&&n[1]==fruit[1])
    {
        document.querySelector(query(fruit[0],fruit[1])).classList.remove("fruit");
        newFruit();
        tail.push(disc);
        if(speed>50&&speedFlag)
        speed-=50;
    }
    else if(crossover(disc))
        document.querySelector(query(disc[0],disc[1])).classList.remove("snek");
}

function changeDir(h)
{
    if(direction=="Right")
    {
        if(h[1]==gridj-1&&wallFlag)
            return null;
        else if(h[1]==gridj-1)
            return [h[0],0];
        return [h[0],h[1]+1];
    }
    if(direction=="Left")
        {
            if(h[1]==0&&wallFlag)
                return null;
            else if(h[1]==0)
                return [h[0],gridj-1];
            return [h[0],h[1]-1];
        }
        if(direction=="Down")
            {
                if(h[0]==gridi-1&&wallFlag)
                    return null;
                else if(h[0]==gridi-1)
                    return [0,h[1]];
                return [h[0]+1,h[1]];
            }
            if(direction=="Up")
                {
                    if(h[0]==0&&wallFlag)
                        return null;
                    else if(h[0]==0)
                        return [gridi-1,h[1]];
                    return [h[0]-1,h[1]];
                }
}
setInterval(function(){
    if(flag)
    {
        if(tracker==speed)
        {
        move();
        tracker=0;
        }
    tracker+=50; 
    }
},50);

function crossover(a)
{
    for(var i=0;i<tail.length-1;i++)
    {
        if(tail[i][0]==a[0]&&tail[i][1]==a[1])
            return false;
    }
    return true;
}