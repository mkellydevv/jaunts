from selenium import webdriver as wd
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from fake_useragent import UserAgent

import sys
import json
import pprint
import time
from pathlib import Path
import urllib.request


pp = pprint.PrettyPrinter(indent=4)

URL = "https://www.all" + "trails.com"
STATES = {
    "va": "virginia"
}

ua = UserAgent()
userAgent = ua.random
print("User Agent:", userAgent)

options = wd.ChromeOptions()
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)
options.add_argument("disable-blink-features=AutomationControlled")
options.add_argument("disable-extensions")
options.add_argument("disable-infobars")
options.add_argument("incognito")
options.add_argument(f"user-agent={userAgent}")
options.add_argument("window-size=1280,1440")

driver = wd.Chrome(
    executable_path='/usr/bin/chromedriver',
    options=options
)

driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

# Login to gain access to map data
def login(driver):
    if len(sys.argv) < 2:
        print("Login requires email and password as command line args")
        return

    # Navigate to main page and wait
    driver.get(URL)
    time.sleep(8)

    # Click on login button
    driver.find_element(By.XPATH, '//*[@id="responsive-navbar-nav"]/div[3]/div/div[2]/div').click()
    time.sleep(5)

    # Enter login info and submit
    driver.find_element(By.NAME, 'userEmail').send_keys(sys.argv[0])
    driver.find_element(By.NAME, 'userPassword').send_keys(sys.argv[1])
    driver.find_element(By.XPATH, '//*[@id="login-form"]/div/div/div[2]/form/input').click()
    time.sleep(10)

# Loads trail info from a state's info.txt file into a dict
def load_trail_info(state="virginia"):
    try:
        with open(f"./states/{state}/info.txt", 'r') as file:
            lines = file.readlines()
            dct = {}
            for line in lines:
                # Read lines from file and chop off \n char
                data = eval(line[:len(line)-1])
                dct[data["link"]] = data
            return dct
    except:
        return {}

# Load links from a state's links.txt file
def load_trail_links(state="virginia"):
    # Read lines from file and chop off \n char
    with open(f"./states/{state}/links.txt", 'r') as file:
        lines = file.readlines()
        for i, line in enumerate(lines):
            lines[i] = line[:len(line)-1]
        return lines

# Saves links to trails from a particular state to a text file
def scrape_trail_links(driver, state="virginia", amount=9):
    # Navigate to page
    driver.get(URL + "/us/" + state)
    btn = WebDriverWait(driver, 15) \
        .until(EC.presence_of_element_located((By.CLASS_NAME,"styles-module__button___1nuva")))

    # Load more trail cards onto the page
    i = 0
    while i < amount:
        btn.click()
        time.sleep(5)
        i += 1

    # Insert trail links into a list
    links = driver.find_elements_by_class_name("styles-module__link___12BPT")
    lst = []
    for link in links:
        lst.append(link.get_attribute("href") + "\n")

    # Write trail links to a file
    Path(f"./states/{state}").mkdir(parents=True, exist_ok=True)
    with open(f'./states/{state}/links.txt', 'w') as file:
        file.writelines(lst)

# Saves trail info from a list of trail links to a text file
def scrape_trail_info(driver, state="virginia", start_index=0, limit=1):
    # Load trail data from files
    links = load_trail_links(state)
    info = load_trail_info(state)

    i = start_index
    end = min(start_index + limit, len(links))
    while i < end:
        link = links[i]
        # Skip to next unscraped trail
        if link in info:
            print("skipped", i, info[link]["name"])
            i += 1
            end = min(end + 1, len(links))
            continue

        # Navigate to link and wait for safety
        driver.get(link)
        time.sleep(5)

        # Clean data before inserting into txt file
        length = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[1]/span[2]').text
        length = float(length.split(' ')[0])

        elevation_gain = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[2]/span[2]').text
        elevation_gain = int(elevation_gain.split(' ')[0].replace(',', ''))

        duration = calculate_duration(length, elevation_gain)

        tags = driver.find_elements_by_class_name('big.rounded.active')
        for j in range(len(tags)):
            tags[j] = tags[j].text

        # Package data into an object
        info[link] = {
            "link": link,
            "name": driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/h1').text,
            "region": driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/a').text,
            "overview": driver.find_element(By.XPATH, '//*[@id="auto-overview"]').text,
            "description": driver.find_element(By.XPATH, '//*[@id="text-container-description"]').text,
            "difficulty": driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[1]').text,
            "length": length,
            "elevation_gain": elevation_gain,
            "route_type": driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[3]/span[2]').text,
            "duration_hours": duration[0],
            "duration_minutes": duration[1],
            "default_rating": driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[2]/meta[1]').get_attribute("content"),
            "default_weighting": driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[2]/meta[4]').get_attribute("content"),
            "tags": tags
        }

        # Scrape current trail images and track data
        scrape_trail_track_data(driver)
        scrape_trail_images(driver, state, info[link])

        print("    scraped", i, info[link]["name"])
        i += 1

    # Insert packaged info data into txt file
    with open(f'./states/{state}/info.txt', 'w') as file:
        for trail in info:
            file.write(str(info[trail]) + "\n")


def scrape_trail_track_data(driver):
    el = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[2]/ul/div')
    ActionChains(driver).move_to_element(el).perform()
    time.sleep(2)
    driver.find_element(By.XPATH, '//*[@id="trail_more_alternative_menu"]/span/div[1]/a').click()
    time.sleep(5)
    select = Select(driver.find_element_by_id("download"))
    select.select_by_value('jsonTrk')
    time.sleep(5)
    driver.find_element(By.XPATH, '//*[@id="map-download-modal"]/div/div[3]/div/button[2]').click()
    time.sleep(5)


def scrape_trail_images(driver, state, data, limit=3):
    name = data["name"]
    link = data["link"]

    # Navigate to photos of current trail
    driver.get(link.replace("?ref=result-card", "/photos"))
    time.sleep(5)

    # Save images of this trail to folder of the same name
    photos = driver.find_elements_by_class_name("photo-item.gallery.sm")
    Path(f"./states/{state}/img/{name}").mkdir(parents=True, exist_ok=True)
    for j in range(limit):
        url = photos[j].get_attribute("href")
        urllib.request.urlretrieve(url, f"./states/{state}/img/{name}/{j}.jpg")


# Calculates expected amount of time to complete a trail using "Naismith's rule"
def calculate_duration(length, elevation_gain):
    total_min = int((length / 3 + elevation_gain / 2000) * 60)
    return (total_min // 60, total_min % 60)

# scrape_trail_links(driver, STATES["va"])

login(driver)
scrape_trail_info(driver, STATES["va"], 90, 10)
# pp.pprint(load_trail_info())
