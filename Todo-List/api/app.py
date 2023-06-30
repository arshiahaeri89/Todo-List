from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import enum
import config

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DB_URI

db = SQLAlchemy(app)

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

@app.route('/get_tasks', methods=['POST'])
def get_tasks():
    username = request.form['username'] # TODO: in error handling handle this with key_error
    user = User.query.filter_by(username=username)
    if user:
        tasks_list = []
        for task in user.tasks:
            task_dict = {
                'task_title': task.title,
                'task_desc': task.desc,
                'task_status': task.status,
                'task_start_date': task.start_date,
                'task_end_date': task.end_date
            }
            
            tasks_list.append(task_dict)
        
        data = {
            'status': 'ok',
            'tasks': tasks_list
        }
    else:
        data = {
            'status': 'not found'
        }

    return jsonify(data)


def edit_task():
    pass

def remove_task():
    pass

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']
    user = User(username=username, password=password)
    db.session.add(user)
    db.commit()

    data = {
        'status': 'ok'
    }

    return jsonify(data)


if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
