import os
from urllib.parse import unquote
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from howlongtobeatpy import HowLongToBeat
import uvicorn

app = FastAPI()

# --- Configuração do CORS ---
# Permite que qualquer frontend (Angular, React, etc.) chame esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, você pode restringir para o domínio do seu app
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, OPTIONS, etc.
    allow_headers=["*"],  # Permite qualquer header
)
# -----------------------------

@app.api_route("/", methods=["GET", "HEAD"])
def health_check():
    return {"status": "ok", "service": "HLTB Scraper"}

@app.get("/search")
async def search_game(name: str):
    """
    Busca jogos no HowLongToBeat pelo nome.
    Retorna uma lista de resultados com tempos em minutos.
    """
    try:
        # Decodifica URL encoded chars (%20 -> space) caso chegue codificado
        name_clean = unquote(name)
        
        print(f"Requisição Original: '{name}' | Buscando por: '{name_clean}'")

        results = await HowLongToBeat().async_search(name_clean)
        
        if results is None or len(results) == 0:
            print(f"Nenhum resultado encontrado para: {name_clean}")
            return []

        response_data = []
        for game in results:
            # Lógica resiliente para pegar os atributos corretos
            main_story = getattr(game, "main_story", getattr(game, "gameplay_main", 0))
            main_extra = getattr(game, "main_extra", getattr(game, "gameplay_main_extra", 0))
            completionist = getattr(game, "completionist", getattr(game, "gameplay_completionist", 0))
            
            # Garante que não seja None
            main_story = main_story if main_story else 0
            main_extra = main_extra if main_extra else 0
            completionist = completionist if completionist else 0

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
        print(f"Erro ao buscar no HLTB: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)