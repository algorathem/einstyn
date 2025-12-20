import sqlite3
import os

def check_database():
    db_path = 'researchly.db'
    if os.path.exists(db_path):
        print('✓ Database file exists:', db_path)
        print(f'File size: {os.path.getsize(db_path)} bytes')

        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        # Check tables
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cur.fetchall()
        print('Tables:', [t[0] for t in tables])

        # Check sources table
        if 'sources' in [t[0] for t in tables]:
            cur.execute('SELECT COUNT(*) FROM sources')
            count = cur.fetchone()[0]
            print(f'✓ Sources table has {count} records')

            if count > 0:
                cur.execute('SELECT id, title, authors, year, field, type FROM sources ORDER BY id DESC LIMIT 3')
                rows = cur.fetchall()
                print('Recent records:')
                for row in rows:
                    print(f'  ID: {row[0]}')
                    print(f'  Title: {row[1][:60]}...' if len(row[1]) > 60 else f'  Title: {row[1]}')
                    print(f'  Authors: {row[2]}')
                    print(f'  Year: {row[3]}, Field: {row[4]}, Type: {row[5]}')
                    print()

        conn.close()
    else:
        print('✗ Database file not found')

if __name__ == '__main__':
    check_database()