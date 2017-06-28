from flask import Flask
from flask import render_template
import pandas as pd
from sqlalchemy import create_engine

app = Flask(__name__)
engine = create_engine("mysql://dbuser:dbpass@db/data")


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/data')
def get_data():
    query = "select * from Tickets"
    sessions = pd.read_sql_query(query, engine)
    sessions["PLCVersion"].fillna('Unknown', inplace=True)
    sessions["PLSVersion"].fillna('Unknown', inplace=True)
    return sessions.to_json(orient='records')

if __name__ == '__main__':
    app.run()
