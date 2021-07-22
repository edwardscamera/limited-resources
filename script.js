const CANVAS = document.querySelector("#chungus");
const CTX = CANVAS.getContext("2d");

let targetLength = 0;

let energyMade = 0;
let waterMade = 0;
let fireMade = 0;

let initcombo = 1;

const adv = [
    "hold left click and drag to look around",
    "click the middle of the spheres to charge them",
    "hold right click to push the spheres",
    "push charged spheres together to create new spheres",
    "two of the same sphere can be pushed together",
    "try and get all of the combinations",
    "have fun. you are god!"
].map(i => ({
    "text": i,
    "y": -100,
    "ytarget": -100,
    "flag": false,
}));

let advnum = 0;

images = {
    "energy": null,
    "water": null,
    "fire": null,
};

bookoflife = [
    {
        input: ["energy", "energy"],
        text: "life",
        delay: 10,
    },
    {
        input: ["energy", "fire"],
        text: "really hot fire",
        delay: 10,
    },
    {
        input: ["energy", "water"],
        text: "really water-y water",
        delay: 10,
    },
    {
        input: ["water", "life"],
        text: "fish",
        delay: 12,
    },
    {
        input: ["water", "water"],
        text: "ocean",
        delay: 16,
    },
    {
        input: ["ocean", "life"],
        text: "coral",
        delay: 20,
    },
    {
        input: ["fire", "water"],
        text: "earth",
        delay: 5,
    },
    {
        input: ["earth", "water"],
        text: "oil",
        delay: 10,
    },
    {
        input: ["life", "life"],
        text: "human",
        delay: 60,
    },
    {
        input: ["human", "human"],
        text: "civilization",
        delay: 120,
    },
    {
        input: ["civilization", "oil"],
        text: "capitalism",
        delay: 80,
    },
    {
        input: ["human", "capitalism"],
        text: "jeff bezos",
        delay: 80,
    },
    {
        input: ["fire", "ocean"],
        text: "global warming",
        delay: 0.25,
    },
    {
        input: ["fire", "human"],
        text: "death",
        delay: 70,
    },
    {
        input: ["global warming", "human"],
        text: "end of days",
        delay: 0.01,
    },
    {
        input: ["death", "capitalism"],
        text: "communism",
        delay: 80,
    },
    {
        input: ["death", "communism"],
        text: "capitalism",
        delay: 80,
    },
    {
        input: ["communism", "human"],
        text: "joseph stalin",
        delay: 80,
    },
    {
        input: ["capitalism", "energy"],
        text: "technology",
        delay: 90,
    },
    {
        input: ["technology", "death"],
        text: "artificial intelligence",
        delay: 180,
    },
    {
        input: ["artificial intelligence", "civilization"],
        text: "death",
        delay: 70,
    },
    {
        input: ["water", "death"],
        text: "waterboarding",
        delay: 15,
    },
    {
        input: ["waterboarding", "human"],
        text: "death",
        delay: 70,
    },
    {
        input: ["death", "life"],
        text: "ghost",
        delay: 0.01,
    },
    {
        input: ["human", "technology"],
        text: "memes",
        delay: 0.01,
    },
    {
        input: ["memes", "ocean"],
        text: "astronaut in the ocean",
        delay: 0.01,
    },
    {
        input: ["memes", "technology"],
        text: "patrick star",
        delay: 0.01,
    },
    {
        input: ["memes", "death"],
        text: "harambe",
        delay: 0.01,
    },
    {
        input: ["memes", "oil"],
        text: "the united states of america",
        delay: 0.01,
    },
];
for (let i = 0; i < bookoflife.length; i++) {
    bookoflife[i].unlocked = false;
    images[bookoflife[i].text] = null;
}
Object.keys(images).forEach(i => {
    images[i] = Object.assign(
        document.createElement("img"),
        { src: `${i}.png` }
    );
});

const tree_objects = [
    {
        x: 0,
        y: 0,
        xvel: 0,
        yvel: 0,
        text: "energy",
        delay: 1,
        seconds: 0,
        activated: false,
        activatedTimer: 0,
        shaded: false,
        charged: false,
        images: [],
    },
];

/*
for (let i = 0; i < Object.keys(images).length; i++) {
    tree_objects.push({
        x: i * 150,
        y: 500,
        xvel: 0,
        yvel: 0,
        text: Object.keys(images)[i],
        delay: 1,
        seconds: 0,
        activated: false,
        activatedTimer: 0,
        shaded: false,
        charged: false,
        images: [{
            rot: 4,
            rev: 4,
            rotspeed: 4,
            revspeed: 4,
            outward: 60,
        }],
    });
}
*/


const camera = {
    x: window.innerWidth / -2,
    y: window.innerHeight / -2,
    velx: 0,
    vely: 0,
    mouseDown: false,
    rightDown: false,
    mouseX: 0,
    mouseY: 0,
}

const inv = {};

window.onresize = () => {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
};
const update = () => {
    CTX.fillStyle = "#ffffff";
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

    camera.velx *= 0.9;
    camera.vely *= 0.9;
    camera.x += camera.velx;
    camera.y += camera.vely;

    for (let i = 0; i < tree_objects.length; i++) {
        if (Math.sqrt(
            (tree_objects[i].x - camera.x - camera.mouseX) ** 2 + (tree_objects[i].y - camera.y - camera.mouseY) ** 2
        ) < 15) {
            tree_objects[i].shaded = true;
        } else {
            tree_objects[i].shaded = false;
        }

        tree_objects[i].x += tree_objects[i].xvel;
        tree_objects[i].y += tree_objects[i].yvel;
        tree_objects[i].xvel *= 0.95;
        tree_objects[i].yvel *= 0.95;

        CTX.fillStyle = tree_objects[i].shaded && !tree_objects[i].activated && !tree_objects[i].charged ? "#555555" : "#000000";
        CTX.beginPath();
        CTX.arc(tree_objects[i].x - camera.x, tree_objects[i].y - camera.y, 10 + Math.sin(tree_objects[i].activatedTimer / 20), 0, 2 * Math.PI);
        CTX.fill();

        CTX.strokeStyle = "#000000";
        CTX.beginPath();
        CTX.arc(tree_objects[i].x - camera.x, tree_objects[i].y - camera.y, 100, 0, 2 * Math.PI);
        CTX.stroke();

        let greenVal = Math.round(tree_objects[i].seconds / tree_objects[i].delay * 256).toString(16);
        CTX.strokeStyle = `#00${greenVal}00`;
        CTX.lineWidth = 10;
        CTX.beginPath();
        if (tree_objects[i].charged) {
            CTX.strokeStyle = `#00ff00`;
            CTX.arc(tree_objects[i].x - camera.x, tree_objects[i].y - camera.y, 100, 0, Math.PI * 2);
        } else {
            CTX.arc(tree_objects[i].x - camera.x, tree_objects[i].y - camera.y, 100, -Math.PI / 2, tree_objects[i].seconds / tree_objects[i].delay * (Math.PI * 2) - Math.PI / 2);
        }
        CTX.stroke();
        CTX.lineWidth = 1;

        CTX.fillStyle = "#000000";
        CTX.font = "20px Verdana";
        CTX.fillText(tree_objects[i].text, tree_objects[i].x - camera.x - CTX.measureText(tree_objects[i].text).width / 2, tree_objects[i].y - camera.y - 120);

        for (let img = 0; img < tree_objects[i].images.length; img++) {
            CTX.save();
            CTX.translate(
                tree_objects[i].x - camera.x + (Math.cos(tree_objects[i].images[img].rev * Math.PI / 180) * tree_objects[i].images[img].outward),
                tree_objects[i].y - camera.y + (Math.sin(tree_objects[i].images[img].rev * Math.PI / 180) * tree_objects[i].images[img].outward),
            );
            CTX.rotate(tree_objects[i].images[img].rot * Math.PI / 180)
            CTX.drawImage(
                images[tree_objects[i].text],
                -25, -25,
                50, 50);
            CTX.restore();
            tree_objects[i].images[img].rot += tree_objects[i].images[img].rotspeed;
            tree_objects[i].images[img].rev += tree_objects[i].images[img].revspeed;
            tree_objects[i].images[img].rot %= 360;
            tree_objects[i].images[img].rev %= 360;
        };

        if (tree_objects[i].activated) {
            tree_objects[i].activatedTimer++;
            tree_objects[i].seconds += 1 / 60;
            if (tree_objects[i].seconds > tree_objects[i].delay) {
                neg = Math.round(Math.random());
                if (neg === 0) neg--;
                tree_objects[i].images.push({
                    rotspeed: Math.random() * 5 * neg,
                    revspeed: Math.random() * 5,
                    rot: Math.random() * 360,
                    rev: Math.random() * 360,
                    outward: Math.random() * 60 + 40,
                });
                Object.assign(tree_objects[i], {
                    activated: false,
                    activatedTimer: 0,
                    seconds: 0,
                    charged: true
                });
                if (tree_objects[i].text === "energy") {
                    energyMade++;
                    if (energyMade === 1) {
                        tree_objects.push({
                            x: tree_objects[i].x,
                            y: camera.y - 100,
                            xvel: 0,
                            yvel: 30,
                            text: tree_objects[i].text,
                            delay: 1,
                            seconds: 0,
                            activated: false,
                            activatedTimer: 0,
                            shaded: false,
                            images: [],
                        });
                        tree_objects.push({
                            x: -300,
                            y: camera.y + window.innerHeight + 100,
                            xvel: 0,
                            yvel: -25,
                            text: "fire",
                            delay: 5,
                            seconds: 0,
                            activated: false,
                            activatedTimer: 0,
                            shaded: false,
                            charged: false,
                            images: [],
                        });
                        tree_objects.push({
                            x: 300,
                            y: camera.y + window.innerHeight + 100,
                            xvel: 0,
                            yvel: -25,
                            text: "water",
                            delay: 5,
                            seconds: 0,
                            activated: false,
                            activatedTimer: 0,
                            shaded: false,
                            charged: false,
                            images: [],
                        });
                        initcombo += 2;
                        if (!adv[1].flag) {
                            adv[1].flag = true;
                            advnum++;
                        }
                    }
                }
                if (tree_objects[i].text === "fire") {
                    fireMade++;
                    if (fireMade === 1) tree_objects.push({
                        x: tree_objects[i].x,
                        y: camera.y - 100,
                        xvel: 0,
                        yvel: 30,
                        text: tree_objects[i].text,
                        delay: 5,
                        seconds: 0,
                        activated: false,
                        activatedTimer: 0,
                        shaded: false,
                        images: [],
                    });
                }
                if (tree_objects[i].text === "water") {
                    waterMade++;
                    if (waterMade === 1) tree_objects.push({
                        x: tree_objects[i].x,
                        y: camera.y - 100,
                        xvel: 0,
                        yvel: 30,
                        text: tree_objects[i].text,
                        delay: 5,
                        seconds: 0,
                        activated: false,
                        activatedTimer: 0,
                        shaded: false,
                        images: [],
                    });
                }

                if (!inv.hasOwnProperty(tree_objects[i].text)) inv[tree_objects[i].text] = 1;
                else inv[tree_objects[i].text] += 1;
                updateAdd();
            }
        }
        else tree_objects[i].activatedTimer = 0;
    };

    items = Object.keys(inv);


    let totals = {};
    tree_objects.forEach(e => {
        if (!totals.hasOwnProperty(e.text)) totals[e.text] = 0;
        totals[e.text]++;
    });
    let charged = {};
    tree_objects.forEach(e => {
        if (!charged.hasOwnProperty(e.text)) charged[e.text] = 0;
        if (e.charged) charged[e.text]++;
    });

    for (let i = 0; i < items.length; i++) {
        if (inv[items[i]] === 0) delete inv[items[i]];
    }

    targetLength += (Object.keys(totals).length - targetLength) / 10;

    for (let i = 0; i < Object.keys(totals).length; i++) {
        let ij = Object.keys(totals)[i];
        if (camera.mouseX > 20 && camera.mouseX < 20 + CTX.measureText(`${charged[ij]}/${totals[ij]} | ${ij}`).width &&
            camera.mouseY > window.innerHeight - (targetLength - (i)) * 21 - 21 && camera.mouseY < window.innerHeight - (targetLength - (i)) * 21) {
            CTX.fillStyle = "#00ff00";
            if (camera.mouseDown) {
                tree_objects.forEach(j => {
                    if (j.text === ij) {
                        camera.x = j.x - window.innerWidth / 2;
                        camera.y = j.y - window.innerHeight / 2;
                    }
                });
            }
        } else {
            CTX.fillStyle = "#000000";
        }
        CTX.fillText(`${charged[ij]}/${totals[ij]} | ${ij}`, 20, window.innerHeight - (targetLength - (i)) * 21);
    };

    unlocked = bookoflife.filter(i => i.unlocked).length;
    CTX.fillStyle = "#000000";
    CTX.fillText(`${unlocked + initcombo}/${bookoflife.length + 3} combinations`, window.innerWidth - 21 - CTX.measureText(`${unlocked + 3}/${bookoflife.length + 3} combinations`).width, window.innerHeight - 21);

    if (camera.rightDown) {
        for (let i = 0; i < tree_objects.length; i++) {
            if (Math.sqrt(
                (tree_objects[i].x - camera.x - camera.mouseX) ** 2 + (tree_objects[i].y - camera.y - camera.mouseY) ** 2
            ) < 100) {
                let dist = Math.sqrt((tree_objects[i].x - camera.x - camera.mouseX) ** 2 + (tree_objects[i].y - camera.y - camera.mouseY) ** 2);
                let deg = Math.atan2(tree_objects[i].y - camera.y - camera.mouseY, tree_objects[i].x - camera.x - camera.mouseX) + Math.PI;
                if (dist > 90) while (Math.sqrt(
                    (tree_objects[i].x - camera.x - camera.mouseX) ** 2 + (tree_objects[i].y - camera.y - camera.mouseY) ** 2
                ) < 100) {
                    tree_objects[i].x -= Math.cos(deg);
                    tree_objects[i].y -= Math.sin(deg);
                }
                tree_objects[i].xvel -= Math.min((Math.cos(deg) * (100 - dist)) / 4, 5);
                tree_objects[i].yvel -= Math.min((Math.sin(deg) * (100 - dist)) / 4, 5);

                if (!adv[2].flag) {
                    adv[2].flag = true;
                    advnum++;
                }
            }
        };
    }
    for (let i = 0; i < tree_objects.length; i++) {
        for (let j = 0; j < tree_objects.length; j++) {

            if (i !== j) {
                if (Math.sqrt(
                    (tree_objects[i].x - tree_objects[j].x) ** 2 + (tree_objects[i].y - tree_objects[j].y) ** 2
                ) < 200) {

                    if (tree_objects[i].charged && tree_objects[j].charged) {
                        let inputs = [tree_objects[i].text, tree_objects[j].text];
                        for (let k = 0; k < bookoflife.length; k++) {
                            if (arraysEqual(bookoflife[k].input, inputs) || arraysEqual(bookoflife[k].input, inputs.reverse())) {
                                tree_objects[i].charged = false;
                                tree_objects[j].charged = false;
                                inv[inputs[0]]--;
                                inv[inputs[1]]--;
                                tree_objects.push({
                                    x: camera.x + window.innerWidth / 2,
                                    y: camera.y - 100,
                                    xvel: 0,
                                    yvel: 20,
                                    text: bookoflife[k].text,
                                    delay: bookoflife[k].delay,
                                    seconds: 0,
                                    activated: false,
                                    activatedTimer: 0,
                                    shaded: false,
                                    charged: false,
                                    images: [],
                                });
                                if (!adv[3].flag) {
                                    adv[3].flag = true;
                                    advnum++;
                                    setTimeout(() => {
                                        advnum++;
                                    }, 5 * 1000);
                                    setTimeout(() => {
                                        advnum++;
                                    }, 10 * 1000);
                                    setTimeout(() => {
                                        advnum++;
                                    }, 15 * 1000);
                                }
                                if (!bookoflife[k].unlocked) bookoflife[k].unlocked = true;
                                updateAdd();
                                return;
                            }
                        }
                    }



                    let dist = Math.sqrt((tree_objects[i].x - tree_objects[j].x) ** 2 + (tree_objects[i].y - tree_objects[j].y) ** 2);
                    let deg = Math.atan2(tree_objects[i].y - tree_objects[j].y, tree_objects[i].x - tree_objects[j].x) + Math.PI;
                    tree_objects[i].xvel -= (Math.cos(deg) * (200 - dist)) / 4;
                    tree_objects[i].yvel -= (Math.sin(deg) * (200 - dist)) / 4;
                }
            }
        }
    };

    for (let i = 0; i < adv.length; i++) {
        CTX.fillStyle = "#000000";
        CTX.fillText(adv[i].text, window.innerWidth / 2 - CTX.measureText(adv[i].text).width / 2, adv[i].y);
        adv[i].y += (adv[i].ytarget - adv[i].y) / 10;
        adv[i].ytarget = i === advnum ? 100 : -100;
    };
};

const updateAdd = () => {
    Array.from(document.getElementsByTagName("select")).forEach(select => {
        while (select.children.length > 0) select.children[0].remove();
        Object.keys(inv).forEach(i => {
            select.appendChild(Object.assign(document.createElement("option"), {
                innerHTML: i,
            }));
        });
    });
};

window.onmousedown = (evt) => {
    switch (evt.button) {
        case 0:
            let touched = false;

            for (let i = 0; i < tree_objects.length; i++) {
                if (Math.sqrt(
                    (tree_objects[i].x - camera.x - camera.mouseX) ** 2 + (tree_objects[i].y - camera.y - camera.mouseY) ** 2
                ) < 15 && !tree_objects[i].charged) {
                    tree_objects[i].activated = true;
                }
            };

            if (!touched) {
                camera.mouseDown = true;
                if (!adv[0].flag) {
                    adv[0].flag = true;
                    advnum++;
                }
            }
            break;
        case 2:
            camera.rightDown = true;
            break;

    }
}
window.onmouseup = () => {
    camera.mouseDown = false;
    camera.rightDown = false;
}

window.onmousemove = (evt) => {
    camera.mouseX = evt.clientX;
    camera.mouseY = evt.clientY;
    if (!camera.mouseDown) return;
    camera.velx -= evt.movementX / 8;
    camera.vely -= evt.movementY / 8;
}
window.onload = () => {
    window.onresize();
    setInterval(update, 1000 / 60);
};
const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;


    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

window.oncontextmenu = (evt) => evt.preventDefault();