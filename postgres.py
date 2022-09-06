import os
import psycopg2
counter=0
xname="tnz"
oname="lazoz"
winflag = "y"
turns = "x"
obox = []
xbox = []
gamewin = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
gameboard = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
]


def xo(answer):
    global winflag
    global turns
    global counter
    if winflag == "y":
        if turns == "x":
            if answer / 3 < 1:
                if gameboard[0][answer % 3] != "x" and gameboard[0][answer % 3] != "o":
                    gameboard[0][answer % 3] = turns
                    counter=counter+1
                else:
                    return -1
            elif answer / 3 < 2:
                if gameboard[1][answer % 3] != "x" and gameboard[1][answer % 3] != "o":
                    gameboard[1][answer % 3] = turns
                    counter = counter + 1
                else:
                    return -1
            else:
                if gameboard[2][answer % 3] != "x" and gameboard[2][answer % 3] != "o":
                    gameboard[2][answer % 3] = turns
                    counter = counter + 1
                else:
                    return -1
            turns = "o"
            xbox.append(answer)
        else:
            if answer / 3 < 1:
                if gameboard[0][answer % 3] != "x" and gameboard[0][answer % 3] != "o":
                    gameboard[0][answer % 3] = turns
                    counter = counter + 1
                else:
                    return -1
            elif answer / 3 < 2:
                if gameboard[1][answer % 3] != "x" and gameboard[1][answer % 3] != "o":
                    gameboard[1][answer % 3] = turns
                    counter = counter + 1
                else:
                    return -1
            else:
                if gameboard[2][answer % 3] != "x" and gameboard[2][answer % 3] != "o":
                    gameboard[2][answer % 3] = turns
                    counter = counter + 1
                else:
                    return -1
            turns = "x"
            obox.append(answer)
        gamecheck()


def gamecheck():
    global winflag
    if len(xbox) >= 3 or len(obox) >= 3:
        for i in range(8):
            boxcounter = 0
            for j in range(3):
                for k in range(len(xbox)):
                    if xbox[k]==gamewin[i][j]:
                        boxcounter = boxcounter + 1
            if boxcounter == 3:
                winflag = "x"
                break
        for i in range(8):
            boxcounter = 0
            for j in range(3):
                for k in range(len(obox)):
                    if obox[k]==gamewin[i][j]:
                        boxcounter = boxcounter + 1
            if boxcounter == 3:
                winflag = "o"
                break


def printBoard():
    os.system('clear')
    print('\n' +
          ' ' + str(gameboard[0][0]) + ' | ' + str(gameboard[0][1]) + ' | ' + str(gameboard[0][2]) + '\n' +
          ' ---------\n' +
          ' ' + str(gameboard[1][0]) + ' | ' + str(gameboard[1][1]) + ' | ' + str(gameboard[1][2]) + '\n' +
          ' ---------\n' +
          ' ' + str(gameboard[2][0]) + ' | ' + str(gameboard[2][1]) + ' | ' + str(gameboard[2][2]) + '\n')


def main():
    global xname,oname,counter,winflag
    xname=input("Player x name: ")
    oname=input("Player o name: ")
    printBoard()
    while winflag == "y":
        if counter>=9:
            winflag="tie"
            break
        else:
            answer = input('Player ' + turns + ' turn to play : ')
            if xo(int(answer)) == -1:
                printBoard()
                print("Invalid move")
            else:
                printBoard()
    if winflag == "x":
        print("Player x wins")
    elif winflag=="o":
        print("Player o wins")
    else:
        print("Tie")
    insert()


def insert():
    dsn = "host={} dbname={} user={} password={}".format("127.0.0.1", "xo_game_py", "postgres", "test123")
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    # cur.execute('''CREATE TABLE game
    #           (
    #             "id" SERIAL,
    #              "x_name" VARCHAR(100) NOT NULL,
    #              "o_name" VARCHAR(100) NOT NULL,
    #             "x_moves" VARCHAR(100) NOT NULL,
    #              "o_moves" VARCHAR(100) NOT NULL,
    #              "winner" VARCHAR(100) NOT NULL,
    #              PRIMARY KEY ("id")
    #          );''')
    # print("Table created successfully")
    #
    # conn.commit()
    # conn.close()
    # cur.execute("INSERT INTO game (x_name, o_name, x_moves, o_moves, winner) VALUES ('tnz', 'lazoz', '012', '34', 'y' )");
    cur.execute("INSERT INTO game (x_name, o_name, x_moves, o_moves, winner) VALUES(%s,%s,%s,%s,%s)",(xname,oname,xbox,obox,winflag))
    conn.commit()
    print("game created successfully")
    conn.close()
main()
