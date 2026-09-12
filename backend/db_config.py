import os
from urllib.parse import unquote, urlparse


def _env(*names, default=""):
    for name in names:
        value = os.environ.get(name)
        if value is not None and str(value).strip() != "":
            return str(value).strip()
    return default


def _settings_from_mysql_url(url):
    raw = str(url or "").strip()
    if not raw:
        return None

    if raw.startswith("mysql+pymysql://"):
        raw = f"mysql://{raw[len('mysql+pymysql://'):]}"
    elif not raw.startswith("mysql://"):
        return None

    parsed = urlparse(raw)
    database = (parsed.path or "/").lstrip("/")
    if not parsed.hostname or not database:
        return None

    return {
        "host": parsed.hostname,
        "port": parsed.port or 3306,
        "user": unquote(parsed.username or "root"),
        "password": unquote(parsed.password or ""),
        "database": database,
    }


def get_db_settings():
    mysql_url = _env("MYSQL_URL", "DATABASE_URL", "MYSQL_PUBLIC_URL")
    from_url = _settings_from_mysql_url(mysql_url)
    if from_url:
        return from_url

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

    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    # ให้ dev บน localhost เรียก API cloud ได้ — ใช้บัญชีเดียวกับมือถือ/Vercel
    for local_origin in ("http://localhost:3000", "http://127.0.0.1:3000"):
        if local_origin not in origins:
            origins.append(local_origin)
    return origins
