import sqlite3
from sqlite3 import Error


def openConnection(_dbFile):
    print("++++++++++++++++++++++++++++++++++")
    print("Open database: ", _dbFile)

    conn = None
    try:
        conn = sqlite3.connect(_dbFile)
        print("success")
    except Error as e:
        print(e)

    print("++++++++++++++++++++++++++++++++++")

    return conn


def closeConnection(_conn, _dbFile):
    print("++++++++++++++++++++++++++++++++++")
    print("Close database: ", _dbFile)

    try:
        _conn.close()
        print("success")
    except Error as e:
        print(e)

    print("++++++++++++++++++++++++++++++++++")


current_semester = 27
# These keys map to the instructor's id in the database (ie sungjin's id is 8)
requests = {
    # Sungjin Im
    8: [

    ],

    # Hyeran Jeon
    9: [
        {"student": "Abhilasha Dave",
            "percentage": 0.5,     "courses": [140]},
    ],

    # Marcelo Kallmann
    10: [
        {"student": "Ritesh Sharma",              "percentage": 0.5,     "courses": [
            '<span class="prevent">185</span>', 165, 24, 22, 100, 30, 20]},
        {"student": "Xiumin Shang",               "percentage": 0.5,
            "courses": [21, 20, 22, 30, 31, 24]},
        {"student": "Maryam Khazaei Pool",        "percentage": 0.5,
            "courses": [100, 30, 5, 165, 31, 15, 20, 21, 22, 179]},
    ],

    # Shawn Newsam
    13: [
        {"student": "Haolin Liang",               "percentage": 0.5,
            "courses": [22, 20, 21, 15, 30, 100, 120, 165]},
        {"student": "Yuxin Tian",                 "percentage": 0.5,
            "courses": [15, 22, 20, 21, 30, '<span class="prevent">185</span>']},
    ],

    # Dong Li
    12: [
        {"student": "Wenqian Dong",               "percentage": 0.5,
            "courses": [179, 20, 21, 15]},
        {"student": "Shuangyan Yang",
            "percentage": 0.5,     "courses": [20, 21, 15]},
        {"student": "Jie Liu",                    "percentage": 0.5,
            "courses": [179, 20, 21, 15]},
    ],

    # Ming-Hsuan Yang
    18: [
        {"student": "Chieh Lin",              	  "percentage": 0.5,     "courses": [
            5, 20, 21, 22, 140, 30, 165, 15, 31, '<span class="prevent">185</span>']},
        {"student": "Hsin-Ping Huang",            "percentage": 0.5,
            "courses": [5, 15, 21, 31, 120, 140, '<span class="prevent">185</span>', 22, 30, 20]},
        {"student": "Yi-Wen Chen",                "percentage": 0.5,
            "courses": ['<b class="ensure">185</b>', 15,  31, 21, 140, 120, 5, 179, 22, 5]},
        {"student": "Chun-Han Yao",               "percentage": 0.5,     "courses": [
            '<b class="ensure">185</b>', 20, 21, 22, 5, 15, 30, 100, 120, 160, 165, 24, 140, 179]},
        {"student": "Taihong Xiao",               "percentage": 0.5,     "courses": [
            15, 21, 5, 20, 22, 100, 165, 30, 31, '<span class="prevent">185</span>']},
    ],

    # Miguel Carreira-Perpinan
    3: [
        {"student": "Magzhan Gabidolla",          "percentage": 0.5,
            "courses": [179, 100, 165, 31, 30]},
        {"student": "Yerlan Idelbayev",           "percentage": 0.5,
            "courses": [100, 30, 120, 22]},
    ],

    # Wan Du
    7: [
        {"student": "Zehao Li",       		      "percentage": 0.5,
            "courses": [30, 22, 5, 165]},
        {"student": "Xianzhong Ding",             "percentage": 0.5,
            "courses": [30, 22, 20, 15, 24]},
        {"student": "Kang Yang",                  "percentage": 0.5,
            "courses": [21, 20, 22, 5]},

    ],

    # Stefano Carpin
    2: [
        {"student": "Carlos Diaz Alvarenga",      "percentage": 0.5,
            "courses": [5, 15, 20, 21, 22, 24, 30, 100]},
        {"student": "Lorenzo Booth",              "percentage": 0.5,
            "courses": [5, 15, 20, 21, 22, 24, 30]}
    ],

    # Mukesh Singhal
    17: [
        {"student": "Pooya Tavallali",            "percentage": 0.5,
            "courses": [31, 140, 15, 30, 150, 160]},
        {"student": "Nasit Sony",                 "percentage": 0.5,
            "courses": [30, 100, 15, 31, '<span class="prevent">185</span>']},
        {"student": "Azar Alizadeh",              "percentage": 0.5,
            "courses": [5, 20, 22, 30, 31, 165]},
        {"student": "Zhixun He",                  "percentage": 0.5,
            "courses": ['0 (Any available course)']},
    ],

    # Angelo Kyrilov
    11: [],

    # Alberto Cerpa
    4: [
        {"student": "Hamid Rajabi",               "percentage": 0.5,
            "courses": [160, 20, 21, 30, 31, 120]},
        {"student": "Jothi P. S. Sundaram",       "percentage": 0.5,
            "courses": [15, 20, 21, 30, 31, 120]}
    ],

    # Shijia Pan
    15: [
        {"student": "Shubham Rohal",
            "percentage": 0.25,     "courses": [160]},
        {"student": "Shubham Rohal",
            "percentage": 0.25,     "courses": [100]}
    ],

    # Florin Rusu
    16: [

    ],

    # David Noelle
    14: [

    ],

    # Santosh Chandrasekhar
    5: [

    ],

    # YangQuan Chen
    6: [

    ],

    # Ahmed Sabbir Arif
    1: [
        {"student": "Ghazal Zand",                "percentage": 0.5,     "courses": [
            20, 21, 30, 179, '<span class="prevent">185</span>', 100, 24, 165]},
        {"student": "Yuan Ren",                   "percentage": 0.5,
            "courses": [30, 100, 120]},
    ],

    # Hua Hunag
    19: [

    ],
    # Xiaoyi Lu
    20: [

    ],
    # Pengfei Su
    21: [

    ]
}


def deleteNewAssignments(_conn):
    try:
        sql = """DELETE FROM Assignments WHERE semester_fk = ?"""
        args = [current_semester]
        _conn.execute(sql, args)
        _conn.commit()
    except Error as e:
        print(e)
        _conn.rollback()

# Populates the assignments table with all the requests made in semester=27 aka spring 2022


def populateAssignmentsTable(_conn):
    try:
        for instructor in requests:
            for request in requests[instructor]:
                faculty_fk = instructor
                semester_fk = current_semester
                percentage = request["percentage"]
                student_name = request["student"]
                finalized = 'NO'
                sql = """
                    INSERT INTO Assignments (faculty_fk, semester_fk, percentage, student_name, finalized)
                    VALUES (?, ?, ?, ?, ?)
                """
                args = [faculty_fk, semester_fk,
                        percentage, student_name, finalized]
                _conn.execute(sql, args)
        _conn.commit()
        print("Successfully populated Assignments table with new requests")
    except Error as e:
        _conn.rollback()
        print(e)


def determineCourseCategory(input):
    if type(input) == str:
        if "prevent" in input:
            return "prevent"
        if "ensure" in input:
            return "ensure"
        else:
            return "any"
    elif type(input) == int:
        return 'neutral'


def getCourseNumber(input):
    if type(input) == str:
        if "span" in input:
            output = input.split(">")[1]
            output = output.split("<")[0]
            return int(output)
        else:
            return 'ANY'
    elif type(input) == int:
        return input

# Not done. Populate Assignments with requests first then finish this function


def populateRequestedCoursesTable(_conn):
    try:
        cur = _conn.cursor()
        for instructor in requests:
            for request in requests[instructor]:
                cur.execute("""
                    SELECT * 
                    FROM Assignments 
                    WHERE faculty_fk = ?
                        AND semester_fk = ?
                        AND student_name = ?
                """, [instructor, current_semester, request["student"]])
                assignment = cur.fetchall()
                assignment_fk = assignment[0][0]
                rank = 1
                for course in request["courses"]:
                    category = determineCourseCategory(course)
                    course_number = getCourseNumber(course)
                    _conn.execute(f"""
                        INSERT INTO Requested_Courses (assignment_fk, course_number, rank, category)
                        VALUES (?, ?, ?, ?)
                    """, [assignment_fk, course_number, rank, category])
        _conn.commit()
    except Error as e:
        _conn.rollback()
        print(e)


def main():
    database = r"test.db"

    # Create db connection
    conn = openConnection(database)
    with conn:
        # populateAssignmentsTable(conn)
        # deleteNewAssignments(conn)
        populateRequestedCoursesTable(conn)

    closeConnection(conn, database)


if __name__ == '__main__':
    main()
