import sqlite3

def create_database():
    try:
        # 데이터베이스 파일 생성
        with sqlite3.connect("database.db") as con:
            cur = con.cursor()

            # students 테이블 생성
            cur.execute('''
                CREATE TABLE IF NOT EXISTS student (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    studentnum TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            ''')

            # attendance 테이블 생성
            cur.execute('''
                CREATE TABLE IF NOT EXISTS attendance (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student INTEGER NOT NULL,
                    time DATETIME NOT NULL,
                    attendanceStatus TEXT NOT NULL,
                    FOREIGN KEY(student) REFERENCES students(id)
                );
            ''')

            cur.execute('''
                CREATE TABLE IF NOT EXISTS attitude (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student INTEGER NOT NULL,
                    time DATETIME NOT NULL,
                    attitude BOOLEAN NOT NULL,
                    FOREIGN KEY(student) REFERENCES students(id)
                );
            ''')

            
            print("Database and tables created successfully!")
            con.close()
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    create_database()
