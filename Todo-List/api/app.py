from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import enum
import datetime
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
    password = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<User "{self.username}">'

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(Status), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Task "{self.title}">'


@app.route('/tasks/add', methods=['POST'])
def add_task():
    title = request.form['task_title'] # TODO: in error handling handle this with key_error
    desc = request.form['task_desc']
    status = request.form['task_status']
    start_date = request.form['task_start_date']
    end_date = request.form['task_end_date']
    user_id = int(request.form['user_id'])

    user = User.query.get(user_id)
    if user:
        start_date_datetime = datetime.datetime.strptime(
            start_date, config.DATETIME_FORMAT)
        
        end_date_datetime = datetime.datetime.strptime(
            end_date, config.DATETIME_FORMAT)
        
        task = Task(title=title, desc=desc, status=status, start_date=start_date_datetime, end_date=end_date_datetime, user_id=user_id)
        db.session.add(task)
        db.session.commit()

        data = {
            'status': 'ok'
        }
    else:
        data = {
            'status': 'not found'
        }
    return data



@app.route('/q/tasks/', methods=['POST'])
def get_tasks():
    username = request.form['username'] # TODO: in error handling handle this with key_error
    user = User.query.filter_by(username=username).first()
    if user:
        user_tasks = Task.query.filter_by(user_id=user.id)
        tasks_list = []

        for task in user_tasks:
            task_dict = {
                'task_title': task.title,
                'task_desc': task.desc,
                'task_status': task.status.name,
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

@app.route('/account/register', methods=['POST'])
def register():
    # TODO: in error handling handle this with key_error
    username = request.form['username'] # TODO: Handle When a User Exists and unique constraint failed 
    password = request.form['password']
    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()

    data = {
        'status': 'ok'
    }

    return jsonify(data)


@app.route('/account/login', methods=['POST'])
def login():
    # TODO: in error handling handle this with key_error
    username = request.form['username']
    password = request.form['password']
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        data = {
            'status': 'ok'
        }
    else:
        data = {
            'status': 'not found'
        }

    return jsonify(data)


if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
