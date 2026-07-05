import mysql.connector
from mysql.connector import Error

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

# Uncomment to test the free SQL DB instead:
# def get_connection():
#     try:
#         connection = mysql.connector.connect(
#             host="sql12.freesqldatabase.com",
#             user="sql12828730",
#             password="AMnpCaxEMU",
#             database="sql12828730"
#         )
#         return connection
#     except Error as err:
#         print("Database connection failed:", err)
#         return None