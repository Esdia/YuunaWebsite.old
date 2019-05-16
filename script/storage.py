import asyncio
import redis
import os

database = None


async def refresh_redis():
    global database
    while True:
        redis_url = os.environ.get("REDIS_URL")
        if redis_url is not None:
            database = redis.Redis.from_url(redis_url, decode_responses=True)
        else:
            print('ERROR : No database URL provided')
        await asyncio.sleep(120)
