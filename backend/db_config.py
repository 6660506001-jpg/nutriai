import os


def _env(*names, default=""):
    for name in names:
        value = os.environ.get(name)
        if value is not None and str(value).strip() != "":
            return str(value).strip()
    return default


def get_db_settings():
    return {
        "host": _env("DB_HOST", "MYSQLHOST", "MYSQL_HOST", default="localhost"),
        "port": int(_env("DB_PORT", "MYSQLPORT", "MYSQL_PORT", default="3306") or "3306"),
        "user": _env("DB_USER", "MYSQLUSER", "MYSQL_USER", default="root"),
        "password": _env("DB_PASSWORD", "MYSQLPASSWORD", "MYSQL_PASSWORD", default="1234"),
        "database": _env("DB_NAME", "MYSQLDATABASE", "MYSQL_DATABASE", default="nutrition_db"),
    }


def get_cors_origins():
    raw = _env("FRONTEND_URL", "CORS_ORIGINS")
    if not raw:
        return ["*"]
    return [origin.strip() for origin in raw.split(",") if origin.strip()]
