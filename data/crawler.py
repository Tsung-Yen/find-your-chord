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

    # chordSearch = chrome.find_element_by_id("chordsearch")
    # chordSearch.send_keys(chord)
    # chordSearch.submit()
    # time.sleep(2)
    return soup

chordDict = {
    "major":[],
        # "third":[],
        # "seventh":[],
        # "ninth":[],
        # "eleventh":[],
        # "thirteenth":[],
    "minor":{
        "third":[],
        "seventh":[],
        "ninth":[],
        "eleventh":[],
        "thirteenth":[]
    },
    "dominant":{
        "seventh":[],
        "ninth":[],
        "eleventh":[],
        "thirteenth":[]
    }
}
# major
CM = ["C","D","E","F","G","A","B"]
CM7 = ["CM7","DM7","EM7","FM7","GM7","AM7","BM7"]
CM9 = ["CM9","DM9","EM9","FM9","GM9","AM9","BM9"]
CM11 = ["CM11","DM11","EM11","FM11","GM11","AM11","BM11"]
CM13 = ["CM13","DM13","EM13","FM13","GM13","AM13","BM13"]
# minor
Cm = ["Cm","Dm","Em","Fm","Gm","Am","Bm"]
Cm7 = ["Cm7","Dm7","Em7","Fm7","Gm7","Am7","Bm7"]
Cm9 = ["Cm9","Dm9","Em9","Fm9","Gm9","Am9","Bm9"]
Cm11 = ["Cm11","Dm11","Em11","Fm11","Gm11","Am11","Bm11"]
Cm13 = ["Cm13","Dm13","Em13","Fm13","Gm13","Am13","Bm13"]
# dominant
C7 = ["C7","D7","E7","F7","G7","A7","B7"]
C9 = ["C9","D9","E9","F9","G9","A9","B9"]
C11 = ["C11","D11","E11","F11","G11","A11","B11"]
C13 = ["C13","D13","E13","F13","G13","A13","B13"]
# minorMajor
CmM7 = ["CmM7","DmM7","EmM7","FmM7","GmM7","AmM7","BmM7"]
CmM9 = ["CmM9","DmM9","EmM9","FmM9","GmM9","AmM9","BmM9"]
CmM11 = ["CmM11","DmM11","EmM11","FmM11","GmM11","AmM11","BmM11"]
CmM13 = ["CmM13","DmM13","EmM13","FmM13","GmM13","AmM13","BmM13"]
# dim
dim = ["Cdim","Ddim","Edim","Fdim","Gdim","Adim","Bdim"]
dim7 = ["Cdim7","Ddim7","Edim7","Fdim7","Gdim7","Adim7","Bdim7"]
dim9 = ["Cdim9","Ddim9","Edim9","Fdim9","Gdim9","Adim9","Bdim9"]
dim11 = ["Cdim11","Ddim11","Edim11","Fdim11","Gdim11","Adim11","Bdim11"]
dim13 = ["Cdim13","Ddim13","Edim13","Fdim13","Gdim13","Adim13","Bdim13"]
# add
add9 = ["Cadd9","Dadd9","Eadd9","Fadd9","Gadd9","Aadd9","Badd9"]
add11 = ["Cadd11","Dadd11","Eadd11","Fadd11","Gadd11","Aadd11","Badd11"]
add13 = ["Cadd13","Dadd13","Eadd13","Fadd13","Gadd13","Aadd13","Badd13"]
# sus
sus2 = ["Csus2","Dsus2","Esus2","Fsus2","Gsus2","Asus2","Bsus2"]
sus4 = ["Csus4","Dsus4","Esus4","Fsus4","Gsus4","Asus4","Bsus4"]
# 6
six = ["C6","D6","E6","F6","G6","A6","B6"]

# 分類
flag = ["major","major","major","major","major","minor","minor","minor","minor","minor",
"dominant","dominant","dominant","dominant","minorMajor","minorMajor","minorMajor","minorMajor",
"diminish","diminish","diminish","diminish","diminish","add","add","add","sus","sus","six"
]

chordList = [CM,CM7,CM9,CM11,CM13,Cm,Cm7,Cm9,Cm11,Cm13,C7,C9,C11,C13,CmM7,CmM9,CmM11,CmM13,
dim,dim7,dim9,dim11,dim13,add9,add11,add13,sus2,sus4,six]
    


for m in range(len(chordList)):
    for num in range(len(chordList[m])):
        url = "https://jguitar.com/chordsearch?chordsearch="+chordList[m][num]
        majorRoot =  simulateUser(url)
        majorImage = majorRoot.find_all("img",class_="img-responsive")
        majorQuickSound = majorRoot.find_all("a",class_="audio strum down")
        majorSlowSound = majorRoot.find_all("a",class_="audio strum downarpeggio")
        for i in range(len(majorImage)):
            chordFlag = flag[m]
            chord = majorImage[i]["alt"].replace(" chord","")
            image = "https://jguitar.com"+majorImage[i]["src"]
            quickSound = "https://jguitar.com"+majorQuickSound[i]["href"]
            slowSound = "https://jguitar.com"+majorSlowSound[i]["href"]

            sql = "insert into chordlibrary (type,chord,image,quicksound,slowsound) values(%s,%s,%s,%s,%s)"
            val = (chordFlag,chord,image,quickSound,slowSound)
            mycursor.execute(sql,val)
            mydb.commit()

           


