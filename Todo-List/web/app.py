from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

import config

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DB_URI
app.config['SECRET_KEY'] = config.SECRET_KEY
cors = CORS(app)

db = SQLAlchemy(app)

from models import *
from views import *


if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
