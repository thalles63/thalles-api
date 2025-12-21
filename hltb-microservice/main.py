import os
from urllib.parse import unquote
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from howlongtobeatpy import HowLongToBeat
from mangum import Mangum

app = FastAPI()


@app.api_route("/", methods=["GET", "HEAD"])
def health_check():
    return {"status": "ok", "service": "HLTB Scraper"}

@app.get("/search")
async def search_game(name: str):
    try:
        name_clean = unquote(name)
        results = await HowLongToBeat().async_search(name_clean)
        
        if results is None or len(results) == 0:
            return []

        response_data = []
        for game in results:
            main_story = getattr(game, "main_story", getattr(game, "gameplay_main", 0)) or 0
            main_extra = getattr(game, "main_extra", getattr(game, "gameplay_main_extra", 0)) or 0
            completionist = getattr(game, "completionist", getattr(game, "gameplay_completionist", 0)) or 0

            response_data.append({
                "id": game.game_id,
                "name": game.game_name,
                "image": game.game_image_url,
                "times": {
                    "mainStory": round(main_story * 60),
                    "mainExtras": round(main_extra * 60),
                    "completionist": round(completionist * 60)
                }
            })
        return response_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_handler():
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return Mangum(app, lifespan="off")

handler = get_handler()
