# ResearchlyAI Backend

This backend provides APIs for the ResearchlyAI research assistant application, now powered by PostgreSQL for data persistence.

## Features

- **Research Query API**: Search and retrieve research sources with advanced filtering
- **Source Interaction APIs**: Chat, mode switching, actions, and validation for research sources
- **User Analytics**: Track user searches, actions, and logs
- **Validation System**: AI response validation with confidence scoring
- **PostgreSQL Integration**: Robust data persistence with connection pooling

## Database Schema

### Tables

1. **sources**: Research papers and articles
   - `id` (SERIAL PRIMARY KEY)
   - `title` (TEXT NOT NULL)
   - `authors` (JSONB) - Array of author names
   - `abstract` (TEXT)
   - `url` (TEXT)
   - `year` (INTEGER)
   - `field` (TEXT)
   - `type` (TEXT)
   - `created_at` (TIMESTAMP)

2. **user_searches**: User search history
   - `id` (SERIAL PRIMARY KEY)
   - `query` (TEXT NOT NULL)
   - `filters` (JSONB)
   - `timestamp` (TIMESTAMP)
   - `results_count` (INTEGER)

3. **user_logs**: User action logs
   - `id` (SERIAL PRIMARY KEY)
   - `actions` (JSONB NOT NULL)
   - `timestamp` (TIMESTAMP)

4. **validations**: AI response validations
   - `id` (SERIAL PRIMARY KEY)
   - `source_id` (INTEGER, REFERENCES sources(id))
   - `ai_response` (TEXT NOT NULL)
   - `constraints` (JSONB)
   - `confidence_score` (DECIMAL(3,2))
   - `flagged_inconsistencies` (JSONB)
   - `recommendations` (JSONB)
   - `timestamp` (TIMESTAMP)

## Setup

### Prerequisites

- Node.js 16+
- Python 3.8+
- PostgreSQL 12+

### Installation

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**:
   ```bash
   # Create database and tables
   python setup_db.py
   ```

   Or manually:
   ```sql
   CREATE DATABASE researchly;
   -- Tables will be created automatically when the service starts
   ```

4. **Configure environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=researchly
   ```

## Running the Server

### Development Mode

```bash
# Start the test server
node test-server.js
```

The server will run on `http://localhost:3002`

### API Endpoints

#### Health Check
- `GET /health` - Server health status

#### Research APIs
- `POST /api/research/query` - Search research sources
  ```json
  {
    "query": "machine learning",
    "filters": {
      "year": 2024,
      "field": "computer science"
    }
  }
  ```

#### Source APIs
- `POST /api/source/:sourceId/chat` - Chat with a source
- `POST /api/source/:sourceId/mode` - Change interaction mode
- `POST /api/source/:sourceId/action` - Perform actions on source
- `POST /api/source/:sourceId/validate` - Validate AI responses

#### User Analytics
- `POST /api/user/log` - Log user actions

#### Other
- `POST /api/report/feedback` - Generate feedback on reports
- `GET /api/source/:sourceId/details` - Get source details
- `GET /api/docs` - API documentation

## Database Operations

The `DatabaseService` class provides the following operations:

- `create_sources_table()` - Initialize sources table
- `create_user_tables()` - Initialize user-related tables
- `insert_source(source)` - Add new research source
- `search_sources(query, filters)` - Search sources with filters
- `get_source_by_id(id)` - Retrieve source by ID
- `insert_user_search(search_data)` - Log user search
- `insert_user_log(actions)` - Log user actions
- `insert_validation(validation_data)` - Store validation results

## Testing

### Run API Tests

```bash
# Test with the provided test scripts
node test-apis.js
node test-new-apis.js
```

### Database Tests

```bash
# Test database operations
python test_database_service.py
```

## Deployment

1. Set up PostgreSQL database in production
2. Update environment variables for production database
3. Run database setup script
4. Deploy the Node.js application

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_USER` | postgres | Database username |
| `DB_PASSWORD` | password | Database password |
| `DB_NAME` | researchly | Database name |

## Error Handling

The APIs include comprehensive error handling with fallbacks to mock data when database operations fail, ensuring the service remains functional even during database issues.

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Update tests for new features
4. Document API changes

## License

[Add your license information here]
