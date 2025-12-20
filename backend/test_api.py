import requests
import json

def test_api():
    url = "http://localhost:3000/api/research/query"
    headers = {"Content-Type": "application/json"}

    # Test data
    test_data = {
        "query": "machine learning in healthcare",
        "filters": {
            "year": 2024,
            "field": "Computer Science"
        }
    }

    try:
        print("Testing API endpoint:", url)
        print("Request data:", json.dumps(test_data, indent=2))

        response = requests.post(url, json=test_data, headers=headers, timeout=30)

        print(f"\nResponse Status: {response.status_code}")
        print("Response Headers:", dict(response.headers))

        if response.status_code == 200:
            result = response.json()
            print("\nResponse Body:")
            print(json.dumps(result, indent=2))

            if "sources" in result:
                print(f"\n✓ Found {len(result['sources'])} sources")
                for i, source in enumerate(result['sources'][:2], 1):  # Show first 2
                    print(f"\nSource {i}:")
                    print(f"  Title: {source.get('title', 'N/A')}")
                    print(f"  Authors: {source.get('authors', [])}")
                    print(f"  Year: {source.get('year', 'N/A')}")
                    print(f"  Field: {source.get('field', 'N/A')}")
                    print(f"  URL: {source.get('url', 'N/A')}")
        else:
            print("Error response:", response.text)

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()