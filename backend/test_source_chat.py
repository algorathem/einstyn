import requests
import json

def test_source_chat_api():
    # First, let's get a source ID from the database
    import sqlite3
    import os

    db_path = os.path.join('researchly.db')
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute('SELECT id, title FROM sources LIMIT 1')
        row = cur.fetchone()
        conn.close()
        
        if row:
            source_id = row[0]
            title = row[1]
            print(f"Testing with source ID: {source_id} - {title}")
            
            # Test the chat API
            url = f"http://localhost:3000/api/source/{source_id}/chat"
            headers = {"Content-Type": "application/json"}
            
            test_cases = [
                {"message": "Summarize the main findings", "mode": "summary"},
                {"message": "Explain the methodology", "mode": "explanation"},
                {"message": "How can I implement this", "mode": "implementation"}
            ]
            
            for i, test_data in enumerate(test_cases, 1):
                print(f"\n--- Test Case {i}: {test_data['mode'].upper()} ---")
                print(f"Request: {json.dumps(test_data, indent=2)}")
                
                try:
                    response = requests.post(url, json=test_data, headers=headers, timeout=30)
                    
                    print(f"Status: {response.status_code}")
                    
                    if response.status_code == 200:
                        result = response.json()
                        print("Response keys:", list(result.keys()))
                        print("Mode:", result.get('mode'))
                        print("Source info:", result.get('source', {}))
                        print("AI Response (first 200 chars):")
                        ai_response = result.get('response', '')
                        print(ai_response[:200] + "..." if len(ai_response) > 200 else ai_response)
                    else:
                        print("Error response:", response.text)
                        
                except Exception as e:
                    print(f"Request failed: {e}")
                    
                print("-" * 50)
        else:
            print("No sources found in database")
    else:
        print("Database not found")

if __name__ == "__main__":
    test_source_chat_api()