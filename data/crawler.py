#使用selenium模擬使用者載入使js檔家載完成
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import bs4
import boto3
import mysql.connector

#mysql db
mydb = mysql.connector.connect(
    
)
mycursor = mydb.cursor() 


def simulateUser(url):
    #取消網頁載入時的彈出視窗
    options = Options()
    options.add_argument("--disable-notifications")
    #建立webdriver obj
    chrome = webdriver.Chrome("./chromedriver",chrome_options=options)
    chrome.get(url)
    time.sleep(2)
    #透過bs4解碼
    soup = bs4.BeautifulSoup(chrome.page_source,"html.parser")
    #關閉瀏覽器
    chrome.quit()
    
    return soup

chordType = []
chordDicName = []
typeName = []
chordName = []
chordList = []
finalChordName = []

#獲得所有和弦的分類及連結    
chordLabelRoot = simulateUser("https://jguitar.com/chorddictionary.jsp")
allData = chordLabelRoot.find_all("li")
for i in range(26,len(allData)):
    chordType.append("https://jguitar.com"+allData[i].a["href"])
    chordDicName.append(allData[i].text)


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



for num in range(len(name)):
    url = "https://jguitar.com/chordsearch?chordsearch="+name[num]
    majorRoot =  simulateUser(url)
    majorImage = majorRoot.find_all("img",class_="img-responsive")
    majorQuickSound = majorRoot.find_all("a",class_="audio strum down")
    majorSlowSound = majorRoot.find_all("a",class_="audio strum downarpeggio")
    for i in range(len(majorImage)):
        chordFlag = typeName[num]
        chord = majorImage[i]["alt"].replace(" chord","").replace("M","maj")
        image = "https://jguitar.com"+majorImage[i]["src"]
        quickSound = "https://jguitar.com"+majorQuickSound[i]["href"]
        slowSound = "https://jguitar.com"+majorSlowSound[i]["href"]

        sql = "insert into chordlibrary (type,chord,image,quicksound,slowsound) values(%s,%s,%s,%s,%s)"
        val = (chordFlag,chord,image,quickSound,slowSound)
        mycursor.execute(sql,val)
        mydb.commit()


