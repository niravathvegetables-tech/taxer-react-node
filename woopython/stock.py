import json
import mysql.connector
from mysql.connector import Error
from http.server import BaseHTTPRequestHandler, HTTPServer


def get_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="taxer-react-node"
        )
        if connection.is_connected():
            print("Connected to MySQL database.")
        return connection
    except Error as err:
        print("Database connection failed:", err)
        return None


def get_stock_data():
    connection = get_connection()
    if connection is None:
        return None

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM taxer_stocks")
        rows = cursor.fetchall()
        return rows
    except Exception as e:
        print("Query error:", e)
        return None
    finally:
        cursor.close()
        connection.close()


class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/getstock":
            rows = get_stock_data()

            if rows is None:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Error fetching data"}).encode())
                return

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(rows, default=str).encode())
        else:
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())


if __name__ == "__main__":
    server_address = ("", 5000)
    httpd = HTTPServer(server_address, RequestHandler)
    print("Server running on http://localhost:5000/getstock")
    httpd.serve_forever()