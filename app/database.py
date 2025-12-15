import redis
from .config import settings

redis_client = redis.from_url(settings.redis_url)

async def get_redis():
    return redis_client