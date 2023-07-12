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

    def __repr__(self):
        return f'<User "{self.username}">'

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    status = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref='tasks')

    def __repr__(self):
        return f'<Task "{self.title}">'

with app.app_context():
    db.create_all()

@app.route('/add_task', methods=['POST'])
def add_task():
    title = request.form['task_title']
    desc = request.form['task_desc']
    status = request.form['task_status']
    start_date = request.form['task_start_date']
    end_date = request.form['task_end_date']
    user_id = int(request.form['user_id'])

    user = User.query.get(user_id)
    task = Task(titile=title, desc=desc, status=status, start_date=start_date, end_date=end_date)
    user.tasks.append(task)

    db.session.add(task)
    db.session.commit()

    data = {
        'status': 'ok'
    }

    return data



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
    username = request.form['username'] # TODO: Handle When a User Exists and unique constraint failed 
    password = request.form['password']
    import pdb; pdb.set_trace()
    user = User(username=username, password=password)
    db.session.add(user)
    db.commit()

    data = {
        'status': 'ok'
    }

    return jsonify(data)


if __name__ == '__main__':
    app.run('0.0.0.0', 5000, debug=True)
