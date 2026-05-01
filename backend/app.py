import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from models import db
from routes import init_routes

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)

# Use Railway's DATABASE_URL; fallback to local sqlite for dev
database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///local.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
init_routes(app)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # This creates your tables on first run
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))