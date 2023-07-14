from flask import Flask, request, jsonify, render_template, flash
from flask_sqlalchemy import SQLAlchemy
import enum
import datetime
import random
import string
import config

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DB_URI
app.config['SECRET_KEY'] = config.SECRET_KEY

db = SQLAlchemy(app)

class Status(enum.Enum):
    DONE = 'DONE'
    UNDONE = 'UNDONE'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    token = db.Column(db.String(48), unique=True, nullable=False)

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

random_str = lambda N: ''.join(
    random.SystemRandom().choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(N))


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks/add', methods=['POST'])
def add_task():
    try:
        token = request.form['token']
        title = request.form['task_title']
        desc = request.form['task_desc']
        status = request.form['task_status']
        start_date = request.form['task_start_date']
        end_date = request.form['task_end_date']

        user = User.query.filter_by(token=token).first()
        if user:
            start_date_datetime = datetime.datetime.strptime(
                start_date, config.DATETIME_FORMAT)
            
            end_date_datetime = datetime.datetime.strptime(
                end_date, config.DATETIME_FORMAT)
            
            task = Task(title=title, desc=desc, status=status, start_date=start_date_datetime, end_date=end_date_datetime, user_id=user.id)
            db.session.add(task)
            db.session.commit()

            data = {
                'status': 'ok'
            }
        else:
            data = {
                'status': 'not found'
            }
    
    except Exception as e:
        data = {
            'status': 'error',
            'exception': str(e)
        }
    return jsonify(data)



@app.route('/q/tasks/', methods=['POST'])
def get_tasks():
    try:
        token = request.form['token']
        username = request.form['username']
        user = User.query.filter_by(username=username, token=token).first()
        
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
    except Exception as e:
        data = {
            'status': 'error',
            'exception': str(e)
        }

    return jsonify(data)


@app.route('/tasks/edit', methods=['POST'])
def edit_task():
    try:
        token = request.form['token']
        title = request.form['task_title']
        desc = request.form['task_desc']
        status = request.form['task_status']
        start_date = request.form['task_start_date']
        end_date = request.form['task_end_date']
        task_id = request.form['task_id']

        user = User.query.filter_by(token=token)
        if user:
            task = Task.query.get(task_id)
            if task:
                start_date_datetime = datetime.datetime.strptime(
                    start_date, config.DATETIME_FORMAT)
                
                end_date_datetime = datetime.datetime.strptime(
                    end_date, config.DATETIME_FORMAT)
                
                task.title = title
                task.desc = desc
                task.status = status
                task.start_date = start_date_datetime
                task.end_date = end_date_datetime
                
                db.session.commit()

                data = {
                    'status': 'ok'
                }
            else:
                data = {
                    'status': 'not found'
                }
        else:
            data = {
                'status': 'not found'
            }
    except Exception as e:
        data = {
            'status': 'error',
            'exception': str(e)
        }
    return jsonify(data)

@app.route('/tasks/remove', methods=['POST'])
def remove_task():
    try:
        token = request.form['token']
        task_id = request.form['task_id']

        user = User.query.filter_by(token=token)
        if user:
            task = Task.query.get(task_id)
            if task:
                db.session.delete(task)
                db.session.commit()

                data = {
                    'status': 'ok'
                }
            else:
                data = {
                    'status': 'not found'
                }
        else:
            data = {
                'status': 'not found'
            }
    except Exception as e:
        data = {
            'status': 'error',
            'exception': str(e)
        }
    return jsonify(data)

@app.route('/account/register', methods=['GET', 'POST'])
def register():
    try:
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']

            if User.query.filter_by(username=username).first():
                flash('این نام کاربری قبلا ثبت شده')
            else:
                token = random_str(48)
                user = User(username=username, password=password, token=token)
                db.session.add(user)
                db.session.commit()
                flash(f'عملیات با موفقیت انجام شد. توکن شما:  {token}')
    except Exception as e:
        flash('خطایی رخ داد. بعدا دوباره امتحان کنید')
    
    return render_template('register.html')


@app.route('/account/login', methods=['POST'])
def login():
    try:
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            data = {
                'status': 'ok',
                'token': user.token
            }
        else:
            data = {
                'status': 'not found'
            }
    except Exception as e:
        data = {
            'status': 'error',
            'exception': str(e)
        }

    return jsonify(data)


if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
