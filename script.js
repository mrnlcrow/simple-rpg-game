
let xp=0;
let health=100;
let gold=50;
let currentWeapon=0; //stores the index of the weapon
let fighting;
let monsterHealth;
let inventory=["stick"];

const button1=document.querySelector('#button1');
const button2=document.querySelector('#button2');
const button3=document.querySelector('#button3');
const text=document.querySelector('#text');
const xpText=document.querySelector('#xpText');
const healthText=document.querySelector('#healthText');
const goldText=document.querySelector('#goldText');
const monsterStats=document.querySelector('#monsterStats');
const monsterNameText=document.querySelector('#monsterName');
const monsterHealthText=document.querySelector('#monsterHealth');
const bgImage=document.querySelector('#gameimage');

// Array of Objects
const weapons=[
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters=[
    {
        name: "slime",
        level: 2,
        health:15
    },
    {
        name: "fanged beast",
        level: 20,
        health:60
    },
    {
        name: "dragon",
        level: 20,
        health:300
    }
];


const locations=[
    {
        name:"town square",
        "button text":["Go to store","Go to cave","Fight dragon"] , //".." here because of space
        "button functions":[goStore,goCave,fightDragon],
        text:"You are in the town square.",
        image:"url('images/square.png')"
    },
    {
        name:"store",
        "button text":["Buy 10 health (10 gold)","Buy weapon (30 gold)","Go to town square"] , //".." here because of space
        "button functions":[buyHealth,buyWeapon,goTown],
        text:"You entered the store.",
        image:"url('images/store.jpg')"
    },
    {
        name:"cave",
        "button text":["Fight Slime","Fight Beast","Go to town square"] , //".." here because of space
        "button functions":[fightSlime,fightBeast,goTown],
        text:"You entered the cave. You see some monsters",
        image:"url('images/cave.png')"
    },
    {
        name:"fight",
        "button text":["Attack","Dodge","Run"] , 
        "button functions":[attack,dodge,goTown],
        text:"You are fighting a monster.",
        image:""
    },
    {
        name:"kill monster",
        "button text":["Go to town square","Go to town square","Go to town square"] , 
        "button functions":[goTown,goTown,easterEgg],
        text:'The monster screams, "ARG!" as it dies. You gain Experience points and find gold.',
        image:''
    },
    {
        name:"lose",
        "button text":["Replay!","Replay!!!","Replay!!!!!"] , 
        "button functions":[restart,restart,restart],
        text:"You die. 💀",
        image:"url('images/death.gif')"
    },
    {
        name:"win",
        "button text":["Replay!","Replay!!!","Replay!!!!!"] , 
        "button functions":[restart,restart,restart],
        text:"YOU DEFEATED THE DRAGON. YOU WIN THE GAME!🎉",
        image:"url('images/win.gif')"
    },
    {
        name:"easter egg",
        "button text":["2","8","Go to town square"] , 
        "button functions":[pickTwo,pickEight,goTown],
        text:"Easter egg: Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win."
        ,
        image:"url('images/easteregg.gif')"
    }

];


button1.onclick=goStore;  // Is different from 'goStore()'
button2.onclick=goCave;
button3.onclick=fightDragon;

function update(location){ //Here, 'location'  is an object
    monsterStats.style.display="none";
    button1.innerText=location["button text"][0];
    button2.innerText=location["button text"][1];
    button3.innerText=location["button text"][2];
    button1.onclick=location["button functions"][0]; 
    button2.onclick=location["button functions"][1];
    button3.onclick=location["button functions"][2];
    text.innerText=location.text; // Because of one word key of the object OR simply, location["text"] also, innerHTML used here (locations[7])
    bgImage.style.backgroundImage=location.image;
}

function goTown(){
    update(locations[0]);

}

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}


function buyHealth(){
    if(gold >= 10){
        gold-=10;
        health+=10;
        healthText.innerText=health;   //or you can use .innerHTML, the diff. is that innerHTML could also insert HTML elements using "<b>"+health+"</b>"
        goldText.innerText=gold;
    }else{
        text.innerText="You do not have enough gold to buy health.";
    }
                        
}

function buyWeapon(){
    if(currentWeapon < weapons.length - 1){
        if (gold >= 30){
            gold -= 30;
            currentWeapon++;
            goldText.innerText=gold;
            let newWeapon=weapons[currentWeapon].name;
            text.innerText="You now have a "+newWeapon+".";
            inventory.push(newWeapon);
            text.innerText+=" In your inventory you have: "+inventory;
        }else{
            text.innerText="You do not have enough gold to buy a weapon.";
        }
    }else{
        text.innerText="You already have the most powerful weapon!";
        button2.innerText="Sell weapon for 15 gold";
        button2.onclick=sellWeapon;
    }
}

function sellWeapon(){
    if (inventory.length>1){
        gold+=15;
        goldText.innerText=gold;
        let currentWeapon=inventory.shift();
        text.innerText="You sold a "+currentWeapon+".";
        text.innerText+=" In your inventory you have: "+inventory;
    }else{
        text.innerText="You are a warrior! You cannot sell your only weapon.";
    }
}

function fightSlime(){
    fighting=0; // Index for the monster
    goFight();
}

function fightBeast(){
    fighting=1;
    goFight();
}

function fightDragon(){
    bgImage.style.backgroundImage="url('images/dragon.gif')"
    fighting=2;
    goFight();
}

function goFight(){
    update(locations[3]);
    monsterHealth=monsters[fighting].health; // All 'monsterHealth' and 'monsters array' and 'fighting' are globally scoped
    monsterStats.style.display="block";
    monsterNameText.innerText=monsters[fighting].name;
    monsterHealthText.innerText=monsterHealth;
}

function attack(){
    text.innerText="The "+ monsters[fighting].name+" attacks.";
    text.innerText+= " You attack it with your "+ weapons[currentWeapon].name+".";
    if(isMonsterHit()){  //80 percent of the time it should hit
        health-=getMonsterAttackValue(monsters[fighting].level);
    }else{
        text.innerText+=" You Miss. ";
    }
    monsterHealth-= weapons[currentWeapon].power + Math.floor(Math.random()*xp)+1;
    healthText.innerText=health;
    monsterHealthText.innerText=monsterHealth;
    if (health<=0){
        lose();
    }
    else if(monsterHealth<=0){
        (fighting===2)? winGame() : defeatMonster();
    }
    if(Math.random<=.1 && inventory.length !== 1){// Won't break if there is only one weapon
        text.innerText=" Your "+ inventory.pop()+" breaks."; // Different from inventory.shift (first element and last element removal)
        currentWeapon--;
    }
}

function getMonsterAttackValue(level){
    let hit = (level * 5)-(Math.floor(Math.random()*xp));
    console.log(hit);
    return hit;
}

function isMonsterHit(){
    return Math.random() > .2  || health < 20;
}

function dodge(){
    text.innerHTML="You dodged the attack from "+monsters[fighting].name +".";
}

function defeatMonster(){
    gold+=Math.floor(monsters[fighting].level*6.7);   // Both 'gold' and 'xp' are globally scoped
    xp+=monsters[fighting].level;
    goldText.innerText=gold;
    xpText.innerText=xp;
    update(locations[4]);
}

function lose(){
    update(locations[5]);
}

function winGame(){
    update(locations[6]);
}

function restart(){
    location.reload();
}

function easterEgg(){
    update(locations[7]);
}
function pickTwo(){
    pick(2);
}
function pickEight(){
    pick(8);
}
function pick(guess){
    let numbers=[];
    while(numbers.length<10){
        numbers.push(Math.floor(Math.random()*11))
    }
    text.innerText="You picked "+guess+". Here are the random numbers:\n";
    for (let i = 0 ; i < 10 ; i ++){
        text.innerText+=numbers[i]+"\n";                             
    }
    if (numbers.indexOf(guess) !== -1){
        text.innerText+= "Right! You win 10 gold!";
        gold+=20;
        goldText.innerText=gold;
    }else{
        text.innerText+="Wrong! You lose 10 health!";
        health-=10
        healthText.innerHTML=health;
        if (health<=0){
            lose();
        }
    }
}