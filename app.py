# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pytrends.request import TrendReq

app = Flask(__name__)
CORS(app)

@app.route('/api/trends', methods=['GET'])
def get_trends():
    company = request.args.get('company')
    country = request.args.get('country', 'US')  # par défaut 'US'

    pytrends = TrendReq(hl='en-US', tz=360)
    pytrends.build_payload([company], geo=country)

    trends_data = pytrends.interest_over_time()

    if trends_data.empty:
        return jsonify({"error": "No data found"}), 404

    trends_json = trends_data.reset_index().to_json(orient='records')
    return trends_json

if __name__ == '__main__':
    app.run(debug=True)
