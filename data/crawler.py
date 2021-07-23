#使用selenium模擬使用者載入使js檔家載完成
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import bs4
import boto3

import mysql.connector
from mysql.connector import errors
from mysql.connector import pooling


#mysql db connection pool
dbconfig = {
    
}

class MySQLPool(object):
    """
    create a pool when connect mysql, which will decrease the time spent in 
    request connection, create connection and close connection.
    """
    def __init__(self, host="",
                port="", user="",
				password="", database="guitarchord", pool_name="mypool",
				pool_size=3):
        res = {}
        self._host = host
        self._port = port
        self._user = user
        self._password = password
        self._database = database

        res["host"] = self._host
        res["port"] = self._port
        res["user"] = self._user
        res["password"] = self._password
        res["database"] = self._database
        self.dbconfig = res
        self.pool = self.create_pool(pool_name=pool_name, pool_size=pool_size)

    def create_pool(self, pool_name="mypool", pool_size=5):
        """
        Create a connection pool, after created, the request of connecting 
        MySQL could get a connection from this pool instead of request to 
        create a connection.
        :param pool_name: the name of pool, default is "mypool"
        :param pool_size: the size of pool, default is 3
        :return: connection pool
        """
        pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name=pool_name,
            pool_size=pool_size,
            pool_reset_session=True,
            **self.dbconfig)
        return pool

    def close(self, conn, cursor):
        """
        A method used to close connection of mysql.
        :param conn: 
        :param cursor: 
        :return: 
        """
        cursor.close()
        conn.close()

    def execute(self, sql, args=None, commit=False):
        """
        Execute a sql, it could be with args and with out args. The usage is 
        similar with execute() function in module pymysql.
        :param sql: sql clause
        :param args: args need by sql clause
        :param commit: whether to commit
        :return: if commit, return None, else, return result
        """
        # get connection form connection pool instead of create one.
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        if args:
            cursor.execute(sql, args)
        else:
            cursor.execute(sql)
        if commit is True:
            conn.commit()
            self.close(conn, cursor)
            return None
        else:
            res = cursor.fetchall()
            self.close(conn, cursor)
            return res

    def executemany(self, sql, args, commit=False):
        """
        Execute with many args. Similar with executemany() function in pymysql.
        args should be a sequence.
        :param sql: sql clause
        :param args: args
        :param commit: commit or not.
        :return: if commit, return None, else, return result
        """
        # get connection form connection pool instead of create one.
        conn = self.pool.get_connection()
        cursor = conn.cursor()
        cursor.executemany(sql, args)
        if commit is True:
            conn.commit()
            self.close(conn, cursor)
            return None
        else:
            res = cursor.fetchall()
            self.close(conn, cursor)
            return res

def simulateUser(url):
    #取消網頁載入時的彈出視窗
    options = Options()
    options.add_argument("--disable-notifications")
    #建立webdriver obj
    chrome = webdriver.Chrome("./chromedriver",chrome_options=options)
    chrome.get(url)
    time.sleep(1)
    #透過bs4解碼
    soup = bs4.BeautifulSoup(chrome.page_source,"html.parser")
    #關閉瀏覽器
    chrome.quit()
    
    return soup

chordType = []
chordDicName = []
typeName = [
    "Major","Major","Major","Major","Major","Major","Major","Major","Major"
    ,"Major","Major","Major","Major","Major","Major","Major","Major",
    "Minor","Minor","Minor","Minor","Minor","Minor","Minor","Minor","Minor",
    "Minor","Minor","Minor","Minor","Minor","Minor","Minor","Minor",
    "Diminished","Diminished","Diminished","Diminished","Diminished","Diminished",
    "Diminished","Diminished","Diminished","Diminished","Diminished","Diminished",
    "Diminished","Diminished","Diminished","Diminished","Diminished",
    # "Augmented","Augmented","Augmented","Augmented","Augmented","Augmented","Augmented",
    # "Augmented","Augmented","Augmented","Augmented","Augmented","Augmented","Augmented",
    # "Augmented","Augmented","Augmented",
    "Suspended 2nd","Suspended 2nd","Suspended 2nd","Suspended 2nd","Suspended 2nd","Suspended 2nd",
    "Suspended 2nd","Suspended 2nd","Suspended 2nd","Suspended 2nd","Suspended 2nd",
    "Suspended 2nd","Suspended 2nd","Suspended 2nd","Suspended 2nd","Suspended 2nd","Suspended 2nd",
    "Suspended 4th","Suspended 4th","Suspended 4th","Suspended 4th","Suspended 4th",
    "Suspended 4th","Suspended 4th","Suspended 4th","Suspended 4th","Suspended 4th",
    "Suspended 4th","Suspended 4th","Suspended 4th","Suspended 4th","Suspended 4th",
    "Suspended 4th","Suspended 4th",
    "Major Flat 5th","Major Flat 5th","Major Flat 5th","Major Flat 5th","Major Flat 5th",
    "Major Flat 5th","Major Flat 5th","Major Flat 5th","Major Flat 5th","Major Flat 5th",
    "Major Flat 5th","Major Flat 5th","Major Flat 5th","Major Flat 5th","Major Flat 5th",
    "Major Flat 5th","Major Flat 5th",
    "Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th",
    "Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th",
    "Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th","Minor Sharp 5th",
    "Minor Sharp 5th","Minor Sharp 5th",
    "Minor Double Flat 5th","Minor Double Flat 5th","Minor Double Flat 5th","Minor Double Flat 5th",
    "Minor Double Flat 5th","Minor Double Flat 5th","Minor Double Flat 5th","Minor Double Flat 5th",
    "Minor Double Flat 5th","Minor Double Flat 5th","Minor Double Flat 5th","Minor Double Flat 5th",
    "Minor Double Flat 5th","Minor Double Flat 5th","Minor Double Flat 5th","Minor Double Flat 5th",
    "Minor Double Flat 5th",
    "Suspended 4th Sharp 5th","Suspended 4th Sharp 5th","Suspended 4th Sharp 5th","Suspended 4th Sharp 5th",
    "Suspended 4th Sharp 5th","Suspended 4th Sharp 5th","Suspended 4th Sharp 5th","Suspended 4th Sharp 5th",
    "Suspended 4th Sharp 5th","Suspended 4th Sharp 5th","Suspended 4th Sharp 5th","Suspended 4th Sharp 5th",
    "Suspended 4th Sharp 5th","Suspended 4th Sharp 5th","Suspended 4th Sharp 5th","Suspended 4th Sharp 5th",
    "Suspended 4th Sharp 5th",
    "Suspended 2nd Flat 5th","Suspended 2nd Flat 5th","Suspended 2nd Flat 5th","Suspended 2nd Flat 5th",
    "Suspended 2nd Flat 5th","Suspended 2nd Flat 5th","Suspended 2nd Flat 5th","Suspended 2nd Flat 5th",
    "Suspended 2nd Flat 5th","Suspended 2nd Flat 5th","Suspended 2nd Flat 5th","Suspended 2nd Flat 5th",
    "Suspended 2nd Flat 5th","Suspended 2nd Flat 5th","Suspended 2nd Flat 5th","Suspended 2nd Flat 5th",
    "Suspended 2nd Flat 5th",
    "Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th",
    "Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th",
    "Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th",
    "Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th","Suspended 2nd Sharp 5th",
    "Suspended 2nd Sharp 5th",
    "7th","7th","7th","7th","7th","7th","7th","7th","7th","7th","7th","7th","7th","7th","7th","7th","7th",
    "Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th",
    "Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th","Minor 7th",
    "Major 7th","Major 7th","Major 7th","Major 7th","Major 7th","Major 7th","Major 7th","Major 7th","Major 7th",
    "Major 7th","Major 7th","Major 7th","Major 7th","Major 7th","Major 7th","Major 7th","Major 7th",
    "Minor Major 7th","Minor Major 7th","Minor Major 7th","Minor Major 7th","Minor Major 7th","Minor Major 7th","Minor Major 7th",
    "Minor Major 7th","Minor Major 7th","Minor Major 7th","Minor Major 7th","Minor Major 7th","Minor Major 7th",
    "Minor Major 7th","Minor Major 7th","Minor Major 7th","Minor Major 7th",
    "Diminished 7th","Diminished 7th","Diminished 7th","Diminished 7th","Diminished 7th","Diminished 7th",
    "Diminished 7th","Diminished 7th","Diminished 7th","Diminished 7th","Diminished 7th","Diminished 7th",
    "Diminished 7th","Diminished 7th","Diminished 7th","Diminished 7th","Diminished 7th",
    # "Augmented 7th","Augmented 7th","Augmented 7th","Augmented 7th","Augmented 7th","Augmented 7th",
    # "Augmented 7th","Augmented 7th","Augmented 7th","Augmented 7th","Augmented 7th","Augmented 7th",
    # "Augmented 7th","Augmented 7th","Augmented 7th","Augmented 7th","Augmented 7th",
    # "Augmented Major 7th","Augmented Major 7th","Augmented Major 7th","Augmented Major 7th","Augmented Major 7th",
    # "Augmented Major 7th","Augmented Major 7th","Augmented Major 7th","Augmented Major 7th","Augmented Major 7th",
    # "Augmented Major 7th","Augmented Major 7th","Augmented Major 7th","Augmented Major 7th","Augmented Major 7th",
    # "Augmented Major 7th","Augmented Major 7th",
    "7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th",
    "7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th","7th Flat 5th",
    "7th Flat 5th",
    "Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th",
    "Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th",
    "Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th","Major 7th Flat 5th",
    "Major 7th Flat 5th","Major 7th Flat 5th",
    "Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th",
    "Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th",
    "Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th","Minor 7th Flat 5th",
    "Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th",
    "Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th",
    "Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th","Minor Major 7th Flat 5th",
    "Minor Major 7th Flat 5th","Minor Major 7th Flat 5th",
    "Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th",
    "Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th",
    "Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th",
    "Minor Major 7th Double Flat 5th","Minor Major 7th Double Flat 5th",
    "Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th",
    "Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th",
    "Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th","Minor 7th Sharp 5th",
    "Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th",
    "Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th",
    "Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th",
    "Minor Major 7th Sharp 5th","Minor Major 7th Sharp 5th",
    "7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th",
    "7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th","7th Flat 9th",
    "6th","6th","6th","6th","6th","6th","6th","6th","6th","6th","6th","6th","6th","6th","6th","6th","6th",
    "Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th",
    "Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th","Minor 6th",
    "6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th",
    "6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th","6th Flat 5th",
    "6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th",
    "6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th","6th Add 9th",
    "Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th",
    "Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th",
    "Minor 6th Add 9th","Minor 6th Add 9th","Minor 6th Add 9th",
    "9th","9th","9th","9th","9th","9th","9th","9th","9th","9th","9th","9th","9th","9th","9th","9th","9th",
    "Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th",
    "Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th","Minor 9th",
    "Major 9th","Major 9th","Major 9th","Major 9th","Major 9th","Major 9th","Major 9th","Major 9th","Major 9th",
    "Major 9th","Major 9th","Major 9th","Major 9th","Major 9th","Major 9th","Major 9th","Major 9th",
    "Minor Major 9th","Minor Major 9th","Minor Major 9th","Minor Major 9th","Minor Major 9th","Minor Major 9th","Minor Major 9th",
    "Minor Major 9th","Minor Major 9th","Minor Major 9th","Minor Major 9th","Minor Major 9th","Minor Major 9th","Minor Major 9th",
    "Minor Major 9th","Minor Major 9th","Minor Major 9th",
    "9th Flat 5th","9th Flat 5th","9th Flat 5th","9th Flat 5th","9th Flat 5th","9th Flat 5th","9th Flat 5th",
    "9th Flat 5th","9th Flat 5th","9th Flat 5th","9th Flat 5th","9th Flat 5th","9th Flat 5th","9th Flat 5th",
    "9th Flat 5th","9th Flat 5th","9th Flat 5th",
    # "Augmented 9th","Augmented 9th","Augmented 9th","Augmented 9th","Augmented 9th","Augmented 9th","Augmented 9th",
    # "Augmented 9th","Augmented 9th","Augmented 9th","Augmented 9th","Augmented 9th","Augmented 9th","Augmented 9th",
    # "Augmented 9th","Augmented 9th","Augmented 9th",
    "9th Suspended 4th","9th Suspended 4th","9th Suspended 4th","9th Suspended 4th","9th Suspended 4th","9th Suspended 4th",
    "9th Suspended 4th","9th Suspended 4th","9th Suspended 4th","9th Suspended 4th","9th Suspended 4th","9th Suspended 4th",
    "9th Suspended 4th","9th Suspended 4th","9th Suspended 4th","9th Suspended 4th","9th Suspended 4th",
    "7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th",
    "7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th","7th Sharp 9th",
    "7th Sharp 9th",
    "7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th",
    "7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th",
    "7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th",
    "7th Sharp 9th Flat 5th","7th Sharp 9th Flat 5th",
    # "Augmented Major 9th","Augmented Major 9th","Augmented Major 9th","Augmented Major 9th","Augmented Major 9th","Augmented Major 9th",
    # "Augmented Major 9th","Augmented Major 9th","Augmented Major 9th","Augmented Major 9th","Augmented Major 9th","Augmented Major 9th",
    # "Augmented Major 9th","Augmented Major 9th","Augmented Major 9th","Augmented Major 9th","Augmented Major 9th",
    "11th","11th","11th","11th","11th","11th","11th","11th","11th","11th","11th","11th","11th","11th","11th","11th","11th",
    "Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th",
    "Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th","Minor 11th",
    "Major 11th","Major 11th","Major 11th","Major 11th","Major 11th","Major 11th","Major 11th","Major 11th","Major 11th","Major 11th",
    "Major 11th","Major 11th","Major 11th","Major 11th","Major 11th","Major 11th","Major 11th",
    "Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th",
    "Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th","Minor Major 11th",
    "Minor Major 11th","Minor Major 11th",
    "Major Sharp 11th","Major Sharp 11th","Major Sharp 11th","Major Sharp 11th","Major Sharp 11th","Major Sharp 11th",
    "Major Sharp 11th","Major Sharp 11th","Major Sharp 11th","Major Sharp 11th","Major Sharp 11th","Major Sharp 11th",
    "Major Sharp 11th","Major Sharp 11th","Major Sharp 11th","Major Sharp 11th","Major Sharp 11th",
    "13th","13th","13th","13th","13th","13th","13th","13th","13th","13th","13th","13th","13th","13th","13th","13th","13th",
    "Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th",
    "Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th","Minor 13th",
    "Major 13th","Major 13th","Major 13th","Major 13th","Major 13th","Major 13th","Major 13th","Major 13th","Major 13th","Major 13th",
    "Major 13th","Major 13th","Major 13th","Major 13th","Major 13th","Major 13th",
    "Major 13th",
    "Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th",
    "Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th","Minor Major 13th",
    "Minor Major 13th",
    "7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd",
    "7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd",
    "7th Suspended 2nd","7th Suspended 2nd","7th Suspended 2nd",
    "Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd",
    "Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd",
    "Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd","Major 7th Suspended 2nd",
    "7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th",
    "7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th","7th Suspended 4th",
    "7th Suspended 4th",
    "Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th",
    "Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th",
    "Major 7th Suspended 4th","Major 7th Suspended 4th","Major 7th Suspended 4th",
    "7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th",
    "7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th",
    "7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th","7th Suspended 2nd Sharp 5th",
    "7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th",
    "7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th",
    "7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th","7th Suspended 4th Sharp 5th",
    "Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th",
    "Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th",
    "Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th","Major 7th Suspended 4th Sharp 5th",
    "Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th",
    "Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th",
    "Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th","Suspended 2nd Suspended 4th",
    "7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th",
    "7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th",
    "7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th","7th Suspended 2nd Suspended 4th",
    "Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th",
    "Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th",
    "Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th",
    "Major 7th Suspended 2nd Suspended 4th","Major 7th Suspended 2nd Suspended 4th",
    "5th","5th","5th","5th","5th","5th","5th","5th","5th","5th","5th","5th","5th","5th","5th","5th","5th",
    "Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th",
    "Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th","Major Add 9th"
]
chordName = []
chordList = []
finalChordName = []

#獲得所有和弦的分類及連結    
chordLabelRoot = simulateUser("https://jguitar.com/chorddictionary.jsp")
allData = chordLabelRoot.find_all("li")
for i in range(26,len(allData)):
    chordType.append("https://jguitar.com"+allData[i].a["href"])

del chordType[3:4]
del chordType[12]
del chordType[16:18]
del chordType[24]
del chordType[29]
del chordType[40]
del chordType[45]
del chordType[34]
del chordType[37]
del chordType[47]
del chordType[57]

#取得連結中的所有和弦
for x in range(len(chordType)):
    chordPartRoot = simulateUser(chordType[x])
    chordPartRoot = chordPartRoot.find_all("div",class_="col-sm-3 col-xs-5")
    for y in range(len(chordPartRoot)):
        chordName.append(chordPartRoot[y].text)
for i in range(len(chordName)):
    chordList.append((chordName[i].replace("\n","").replace(" chord\n","")))
for i in chordList:
    finalChordName.append(i.replace(" chord",""))


name = []
for i in finalChordName:
    name.append(i.replace("#","%23"))


pool = MySQLPool(**dbconfig)

for num in range(len(name)):
    url = "https://jguitar.com/chordsearch?chordsearch="+name[num]
    majorRoot =  simulateUser(url)
    majorImage = majorRoot.find_all("img",class_="img-responsive")
    majorQuickSound = majorRoot.find_all("a",class_="audio strum down")
    majorSlowSound = majorRoot.find_all("a",class_="audio strum downarpeggio")
    for i in range(len(majorImage)):
        chordFlag = typeName[num]
        chord = majorImage[i]["alt"].replace(" chord","").replace("M","maj").replace("#","sharp").replace("+","aug")
        image = "https://jguitar.com"+majorImage[i]["src"]
        quickSound = "https://jguitar.com"+majorQuickSound[i]["href"]
        slowSound = "https://jguitar.com"+majorSlowSound[i]["href"]

        sql = "insert into chordlibrary (type,chord,image,quicksound,slowsound) values(%s,%s,%s,%s,%s)"
        val = (chordFlag,chord,image,quickSound,slowSound)
        result = pool.execute(sql,val,commit=True)


