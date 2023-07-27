import datetime

from flask import request, jsonify, render_template, flash

from app import app, db
from models import *
from helper import random_str
import config

@app.route('/')
def index():
    """ index page of website """
    return render_template('index.html'), 200

@app.route('/tasks/add', methods=['POST'])
def add_task():
    """ This function adds a task for a user. gets values from POST data """
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
            task = Task(title=title,
                        desc=desc,
                        status=status,
                        start_date=start_date_datetime,
                        end_date=end_date_datetime,
                        user_id=user.id)
            db.session.add(task)
            db.session.commit()

            data = {
                'status': 'ok'
            }

            return jsonify(data), 200
        else:
            data = {
                'status': 'not found'
            }

            return jsonify(data), 404
    except Exception as err:
        data = {
            'status': 'error',
            'exception': str(err)
        }

        return jsonify(data), 500



@app.route('/q/tasks/', methods=['POST'])
def get_tasks():
    """ This function returns all of a user tasks """
    try:
        token = request.form['token']
        user = User.query.filter_by(token=token).first()
        if user:
            user_tasks = Task.query.filter_by(user_id=user.id)
            tasks_list = []
            for task in user_tasks:
                task_dict = {
                    'task_id': task.id,
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

            return jsonify(data), 200
        else:
            data = {
                'status': 'not found'
            }

            return jsonify(data), 404
    except Exception as err:
        data = {
            'status': 'error',
            'exception': str(err)
        }

        return jsonify(data), 500


@app.route('/tasks/edit', methods=['POST'])
def edit_task():
    """ This function edit a task and gets values from POST """
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

                return jsonify(data), 200
            else:
                data = {
                    'status': 'not found'
                }

                return jsonify(data), 404
        else:
            data = {
                'status': 'not found'
            }

            return jsonify(data), 404
    except Exception as err:
        data = {
            'status': 'error',
            'exception': str(err)
        }

        return jsonify(data), 500

@app.route('/tasks/remove', methods=['POST'])
def remove_task():
    """ This function removes a task and get the id from POST """
    try:
        token = request.form['token']
        task_id = request.form['task_id']

        user = User.query.filter_by(token=token)
        if user:
            task = Task.query.get(int(task_id))
            if task:
                db.session.delete(task)
                db.session.commit()

                data = {
                    'status': 'ok'
                }

                return jsonify(data), 200
            else:
                data = {
                    'status': 'not found'
                }

                return jsonify(data), 404
        else:
            data = {
                'status': 'not found'
            }

            return jsonify(data), 404
    except Exception as err:
        data = {
            'status': 'error',
            'exception': str(err)
        }
        
        return jsonify(data), 500


@app.route('/q/stats', methods=['POST'])
def general_stats():
    try:
        token = request.form['token']
        user = User.query.filter_by(token=token).first()
        if user:
            tasks = Task.query.all()
            undone_tasks = 0
            done_tasks = 0
            for task in tasks:
                if task.status.name == 'UNDONE':
                    undone_tasks += 1
                elif task.status.name == 'DONE':
                    done_tasks += 1
            data = {
                'status': 'ok',
                'undone_tasks': undone_tasks,
                'done_tasks': done_tasks
            }

            return jsonify(data), 200
        else:
            data = {
                'status': 'not found'
            }

            return jsonify(data), 404
    except Exception as err:
        data = {
            'status': 'error',
            'exception': str(err)
        }
        
        return jsonify(data), 500


@app.route('/account/register', methods=['GET', 'POST'])
def register():
    """ Registering page and process """
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
    except Exception as err:
        flash('خطایی رخ داد. بعدا دوباره امتحان کنید'+f' {str(err)}')
    return render_template('register.html')


@app.route('/account/login', methods=['POST'])
def login():
    """ login a user and returns the token """
    try:
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            data = {
                'status': 'ok',
                'token': user.token
            }

            return jsonify(data), 200
        else:
            data = {
                'status': 'not found'
            }

            return jsonify(data), 404
    except Exception as err:
        data = {
            'status': 'error',
            'exception': str(err)
        }

        return jsonify(data), 500
