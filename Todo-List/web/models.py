from app import db
import enum

class Status(enum.Enum):
    """ an enumerator for task status field """
    DONE = 'DONE'
    UNDONE = 'UNDONE'

class User(db.Model):
    """ User model """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    token = db.Column(db.String(48), unique=True, nullable=False)

    def __repr__(self):
        return f'<User "{self.username}">'

class Task(db.Model):
    """ Task model """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    desc = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum(Status), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Task "{self.title}">'