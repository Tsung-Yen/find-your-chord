#使用selenium模擬使用者載入使js檔家載完成
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import bs4
import boto3

import mysql.connector
from mysql.connector import errors
from mysql.connector import pooling
import os 
from dotenv import load_dotenv
load_dotenv()

#mysql db connection pool
dbconfig = {
    "host":os.getenv("DB_HOST"),
	"user":os.getenv("DB_USER"),
	"password":os.getenv("DB_PASSWORD"),
	"database":os.getenv("DB_NAME")
}

class MySQLPool(object):
    """
    create a pool when connect mysql, which will decrease the time spent in 
    request connection, create connection and close connection.
    """
    def __init__(self, host=os.getenv("DB_HOST"),
                port="3306", user=os.getenv("DB_USER"),
				password=os.getenv("DB_PASSWORD"), database=os.getenv("DB_NAME"), pool_name="mypool",
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
    
]
chordName = []
chordList = []
finalChordName = []

#獲得所有和弦的分類及連結    
chordLabelRoot = simulateUser("https://jguitar.com/chorddictionary.jsp")
allData = chordLabelRoot.find_all("li")
for i in range(26,len(allData)):
    chordType.append("https://jguitar.com"+allData[i].a["href"])

#過濾多餘的標題名稱(重複的標題)
del chordType[12] #7th                  #check
del chordType[27] #6th                  #check
del chordType[32] #9th                  #check
del chordType[42] #11th                 #check
del chordType[47] #13th                 #check
del chordType[51] #7th+Sispended+2nd    #check
del chordType[61] #5th                  #check


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
    name.append(i.replace("#","%23").replace("#","%23").replace("+","aug").replace("+","aug"))


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


