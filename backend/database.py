import mysql.connector

from db_config import get_db_settings


def get_db_connection():
    settings = get_db_settings()
    try:
        return mysql.connector.connect(
            host=settings["host"],
            port=settings["port"],
            user=settings["user"],
            password=settings["password"],
            database=settings["database"],
        )
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None
