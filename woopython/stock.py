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

    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM taxer_stocks")
        rows = cursor.fetchall()
        return rows
    except Exception as e:
        print("Query error:", e)
        return None
    finally:
        if cursor:
            cursor.close()
        connection.close()


def update_amount_add(sales_total, stocks_id, connection):
    """Reduce stock quantity by the sold amount. Adjust column/logic as needed."""
    cursor = connection.cursor()
    try:
        cursor.execute(
            "UPDATE taxer_stocks SET amount = amount - %s WHERE id = %s",
            (sales_total, stocks_id)
        )
        connection.commit()
    finally:
        cursor.close()


def insert_sales(data):
    """
    Mirrors the Node.js logic:
    - filters out rows missing stocks_id
    - inserts each valid row into taxer_sales
    - updates stock amount per row
    Returns (result_dict, error) tuple.
    """
    connection = get_connection()
    if connection is None:
        return None, "Database connection failed"

    valid_rows = [
        row for row in data.get("sales", [])
        if row.get("stocks_id") is not None
    ]

    if not valid_rows:
        connection.close()
        return None, "No valid sales rows to insert"

    query = """
        INSERT INTO taxer_sales
        (transaction_id, stocks_id, sales_amount, sales_count, sales_item_type, sales_total, date)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    cursor = connection.cursor()
    last_insert_id = None

    try:
        for row in valid_rows:
            cursor.execute(query, (
                data.get("companyid"),
                row.get("stocks_id"),
                row.get("sales_amount"),
                row.get("sales_count"),
                row.get("sales_item_type"),
                row.get("sales_total"),
                data.get("date"),
            ))
            last_insert_id = cursor.lastrowid
            connection.commit()

            update_amount_add(row.get("sales_total"), row.get("stocks_id"), connection)

        return {"insertId": last_insert_id}, None

    except Exception as e:
        print("Insert error:", e)
        connection.rollback()
        return None, str(e)
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

    def do_POST(self):
        if self.path == "/sales":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)

            try:
                data = json.loads(body)
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid JSON body"}).encode())
                return

            result, error = insert_sales(data)

            if error:
                self.send_response(400 if error == "No valid sales rows to insert" else 500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": error}).encode())
                return

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        else:
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())


if __name__ == "__main__":
    server_address = ("", 5000)
    httpd = HTTPServer(server_address, RequestHandler)
    print("Server running on http://localhost:5000")
    httpd.serve_forever()