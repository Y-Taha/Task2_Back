var xname;
var oname;
var winflag = "y";
var turns = "x";
var obox = [];
var xbox = [];
var gamewin = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
var gameboard = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
]
function isInt(value) {
    var x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}
function xo(answer) {
    if (winflag == "y") {
        if (turns == "x") {
            if (answer / 3 < 1) {
                if (gameboard[0][answer % 3] != "x" && gameboard[0][answer % 3] != "o") {
                    gameboard[0][answer % 3] = turns;
                } else {
                    return -1;
                }
            } else if (answer / 3 < 2) {
                if (gameboard[1][answer % 3] != "x" && gameboard[1][answer % 3] != "o") {
                    gameboard[1][answer % 3] = turns;
                } else {
                    return -1;
                }
            } else {
                if (gameboard[2][answer % 3] != "x" && gameboard[2][answer % 3] != "o") {
                    gameboard[2][answer % 3] = turns;
                } else {
                    return -1;
                }
            }
            turns = "o";
            xbox.push(answer);
        }
        else {
            if (answer / 3 < 1) {
                if (gameboard[0][answer % 3] != "x" && gameboard[0][answer % 3] != "o") {
                    gameboard[0][answer % 3] = turns;
                } else {
                    return-1;
                }
            } else if (answer / 3 < 2) {
                if (gameboard[1][answer % 3] != "x" && gameboard[1][answer % 3] != "o") {
                    gameboard[1][answer % 3] = turns;
                } else {
                    return -1;
                }
            } else {
                if (gameboard[2][answer % 3] != "x" && gameboard[2][answer % 3] != "o") {
                    gameboard[2][answer % 3] = turns;
                } else {
                    return -1;
                }
            }
            turns = "x";
            obox.push(answer);
        }
        gamecheck();
    }
}
function gamecheck() {
    if (xbox.length >= 3 || obox.length >= 3) {
        for (var i = 0; i < 8; i++) {
            var boxcounter = 0;
            for (var j = 0; j < 3; j++) {
                if (xbox.indexOf(gamewin[i][j]) != -1) {
                    boxcounter++;
                }
            }
            if (boxcounter == 3) {
                winflag = "x";
                break;
            }
        }
        for (var i = 0; i < 8; i++) {
            var boxcounter = 0;
            for (var j = 0; j < 3; j++) {
                if (obox.indexOf(gamewin[i][j]) != -1) {
                    boxcounter++;
                }
            }
            if (boxcounter == 3) {
                winflag = "o";
                break;
            }
        }
    }
}
function printBoard() {
    console.clear();
    console.log('\n' +
        ' ' + gameboard[0][0] + ' | ' + gameboard[0][1] + ' | ' + gameboard[0][2] + '\n' +
        ' ---------\n' +
        ' ' + gameboard[1][0] + ' | ' + gameboard[1][1] + ' | ' + gameboard[1][2] + '\n' +
        ' ---------\n' +
        ' ' + gameboard[2][0] + ' | ' + gameboard[2][1] + ' | ' + gameboard[2][2] + '\n');

}

function main() {
    var query = require('cli-interact').question;
    xname = query('Player x name: ');
    oname = query('Player o name: ');
    printBoard();
    while (winflag == "y") {
        var query = require('cli-interact').getInteger;
        var answer = query('Player ' + turns + ' turn to play : ');
        if(xo(answer)==-1){
            printBoard();
            console.log("Invalid move");
        }else{
            printBoard();
        }
    }
    if(winflag=="x"){
        console.log("Player x wins");
    }else{
        console.log("Player o wins");
    }
}
main();
insertDB();
function insertDB(){

    const { Client } = require('pg')
    const connectionString = 'postgresql://postgres:test123@127.0.0.1:5432/xo_game'
    const client = new Client({
      connectionString,
    })
    // const execute = async (query) => {
    //     try {
    //         await client.connect();     // gets connection
    //         await client.query(query);  // sends queries
    //         return true;
    //     } catch (error) {
    //         console.error(error.stack);
    //         return false;
    //     } finally {
    //         await client.end();         // closes connection
    //     }
    // };
    // const text = `
    //     CREATE TABLE IF NOT EXISTS "game" (
    //         "id" SERIAL,
    //         "x_name" VARCHAR(100) NOT NULL,
    //         "o_name" VARCHAR(100) NOT NULL,
    //         "x_moves" VARCHAR(100) NOT NULL,
    //         "o_moves" VARCHAR(100) NOT NULL,
    //         "winner" VARCHAR(100) NOT NULL,
    //         PRIMARY KEY ("id")
    //     );`;
    const insertGame = async () => {
        try {
            await client.connect();           // gets connection
            await client.query(
                `INSERT INTO "game" ("x_name", "o_name", "x_moves", "o_moves", "winner")  
                 VALUES ($1, $2, $3, $4, $5)`, [xname, oname,xbox,obox,winflag]); // sends queries
            return true;
        } catch (error) {
            console.error(error.stack);
            return false;
        } finally {
            await client.end();               // closes connection
        }
    };
    // execute(text).then(result => {
    //     if (result) {
    //         console.log('Table created');
    //     }
    // });
    insertGame().then(result => {
        if (result) {
            console.log('Game inserted');
        }
    });;
}