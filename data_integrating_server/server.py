from flask import Flask, jsonify, request
import sqlite3 as sql
from AttendanceEnum import AttendanceStatus


app = Flask(__name__)


@app.route('/savestudent/',methods=['POST'])
def saveStudent():
    try:
        data = request.json
        name=data.get('name')
        num=data.get('studentnum')
        with sql.connect('database.db') as con:
            cur = con.cursor()
            cur.execute('''
                    INSERT INTO student (name, studentnum) VALUES (?, ?)
                ''', (name, num))
            con.commit()
        return jsonify({"status": "success", "message": "Record success"})
    except Exception as e:
        print(e)
        con.rollback()
        return jsonify({"status": "fail", "error": str(e)})

@app.route('/saveattendance/', methods=['POST'])
def saveAttendance():
    if request.method=="POST":
        try:
            attendance=request.json
            studentId=attendance.get('id')
            time=attendance.get('time')
            isAttendance=attendance.get('isAttendance')
            if isAttendance not in [e.value for e in AttendanceStatus]:
                return jsonify({"status": "fail", "message": "Invalid status value. Allowed values: 출석, 결석, 출튀"}), 400
            with sql.connect("database.db") as con:
                cur = con.cursor()
                cur.execute("INSERT INTO attendance (student,time,isAttendance) VALUES (?,?,?)",(studentId,time,isAttendance) )
            
                con.commit() 
        except Exception as e:
            print(e)
            con.rollback()
            return jsonify({"status": "fail", "error": str(e)})
        finally:
            con.close()
            return jsonify({"status": "success", "message": "Record success"})


@app.route('/saveattitude/',methods=['POST'])
def saveAttitude():
    try:
        data = request.json
        studentId= data.get('student')
        time=data.get('time')
        attitude=data.get('attitude')
        with sql.connect('database.db') as con:
            cur = con.cursor()
            cur.execute('''
                    INSERT INTO attitude (student, time, attitude) VALUES (?, ?, ?)
                ''', (studentId, time, attitude))
            con.commit()
        return jsonify({"status": "success", "message": "Record success"})
    except Exception as e:
        print(e)
        con.rollback()
        return jsonify({"status": "fail", "error": str(e)})
        
@app.route('/attitude/<int:student_id>/', methods=['GET'])
def getAttitude(student_id):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('''
                SELECT attitude FROM attitude WHERE student = ?  ORDER BY time DESC LIMIT 1
            ''', (student_id,))
            rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)})

@app.route('/studentlist/', methods=['GET'])
def getStudentList():
    try:
        with sql.connect("database.db") as con:
            con.row_factory = sql.Row
            cur = con.cursor()
            cur.execute('''
                SELECT * FROM student OREDER BY name DESC
            ''')
            rows = cur.fetchall()
            result =[dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)})
    

@app.route('/attdencelist/<int:student_id>/', methods=['GET'])
def getAttendenceList(student_id):
    try:
        with sql.connect("database.db") as con:
            con.row_factory = sql.Row
            cur = con.cursor()
            cur.execute('''
                SELECT * FROM attendence WHERE student = ? ORDER BY time DESC
            ''', (student_id,))
            rows = cur.fetchall()

            result =[dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)})

@app.route('/attitudelist/<int:student_id>/', methods=['GET'])
def getAttitudeList(student_id):
    try:
        with sql.connect("database.db") as con:
            con.row_factory = sql.Row
            cur = con.cursor()
            cur.execute('''
                SELECT * FROM attitude WHERE student = ? ORDER BY time DESC
            ''', (student_id,))
            rows = cur.fetchall()
            result =[dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)})

app.run(port=5001, debug=True)