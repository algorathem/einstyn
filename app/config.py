from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # API Keys
    openai_api_key: str
    firecrawl_api_key: str

    # Redis
    redis_url: str = "redis://localhost:6379"

    # OpenAI
    openai_model: str = "gpt-4o"

    # Firecrawl
    firecrawl_concurrency_limit: int = 2
    firecrawl_batch_delay_ms: int = 2000

    # App
    app_name: str = "AI Deep Research Agent"
    debug: bool = False

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()