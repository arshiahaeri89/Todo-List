from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import enum
import config

app = Flask(__name__)

db = SQLAlchemy(app)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DB_URI

class Status(enum.Enum):
    DONE = 'DONE'
    UNDONE = 'UNDONE'
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.Enum(Status), nullable=False)
    tasks = db.relationship('Task', backref='user_id')

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    status = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

with app.app_context():
    db.create_all()

def add_task():
    pass

def get_tasks():
    pass

def edit_task():
    pass

def remove_task():
    pass

if __name__ == '__main__':
    app.run()
