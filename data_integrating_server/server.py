from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3 as sql
from AttendanceEnum import AttendanceStatus


app = Flask(__name__)


@app.route('/student',methods=['POST'])
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
        return jsonify({"status": "fail", "error": str(e)}), 500

@app.route('/attendance', methods=['POST'])
def saveAttendance():
    if request.method=="POST":
        try:
            attendance = request.json
            studentId = attendance.get('student')
            time = attendance.get('time')
            attendanceStatus = attendance.get('attendanceStatus')
            if attendanceStatus not in [e.value for e in AttendanceStatus]:
                return jsonify({"status": "fail", "message": "Invalid status value. Allowed values: 출석, 결석, 대출, 출튀"}), 400
            with sql.connect("database.db") as con:
                cur = con.cursor()
                cur.execute("INSERT INTO attendance (student,time,attendanceStatus) VALUES (?,?,?)",(studentId,time,attendanceStatus) )
            
                con.commit() 
        except Exception as e:
            print(e)
            con.rollback()
            return jsonify({"status": "fail", "error": str(e)}), 500

        return jsonify({"status": "success", "message": "Record success"})


@app.route('/attitude',methods=['POST'])
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
    except Exception as e:
        print(e)
        return jsonify({"status": "fail", "error": str(e)}), 500


    return jsonify({"status": "success", "message": "Record success"})
        
@app.route('/attitudes/<int:student_id>/latest', methods=['GET'])
def getAttitude(student_id):
    try:
        with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute('''
                SELECT attitude FROM attitude WHERE student = ?  ORDER BY time DESC LIMIT 1
            ''', (student_id,))
            rows = cur.fetchone()
        return jsonify({
            "result": rows[0]
        })
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)}), 500


@app.route('/students', methods=['GET'])
def getStudentList():
    try:
        with sql.connect("database.db") as con:
            con.row_factory = sql.Row
            cur = con.cursor()
            cur.execute('''
                SELECT * FROM student ORDER BY name DESC
            ''')
            rows = cur.fetchall()
            result =[dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)}), 500

    

@app.route('/attendances/<int:student_id>', methods=['GET'])
def getAttendenceList(student_id):
    try:
        with sql.connect("database.db") as con:
            con.row_factory = sql.Row
            cur = con.cursor()
            cur.execute('''
                SELECT * FROM attendance WHERE student = ? ORDER BY time DESC
            ''', (student_id,))
            rows = cur.fetchall()

            result =[dict(row) for row in rows]
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)}), 500


@app.route('/attitudes/<int:student_id>', methods=['GET'])
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
        print("시바")
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "fail", "error": str(e)}), 500


CORS(app)
app.run(host='0.0.0.0', port=5001, debug=True);