from flask import Flask, render_template, request, jsonify
import pandas as pd
from nba_api.stats.endpoints import playergamelog

# Mock dictionary to map player names to IDs
PLAYER_IDS = {
    "LeBron James": "2544",
    "Kevin Durant": "201142",
    "Stephen Curry": "201939",
}

app = Flask(__name__)

def fetch_player_stats(player_name):
    # Find player ID
    player_id = PLAYER_IDS.get(player_name)
    if not player_id:
        return {"error": "Player not found"}

    # Fetch stats using NBA API
    gamelog = playergamelog.PlayerGameLog(player_id=player_id, season='2024')
    game_data = gamelog.get_data_frames()[0]
    return game_data  # Return as a DataFrame

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/player-stats', methods=['POST'])
def player_stats():
    player_name = request.form.get('player_name')
    if not player_name:
        return jsonify({"error": "Player name is required"}), 400

    game_data = fetch_player_stats(player_name)
    if isinstance(game_data, dict) and "error" in game_data:
        return jsonify(game_data), 404

    # Convert DataFrame to HTML
    game_data_html = game_data.to_html(classes="table table-striped", index=False)
    return render_template('player_stats.html', player_name=player_name, game_data_html=game_data_html)

if __name__ == '__main__':
    app.run(debug=True)
