from selenium import webdriver as wd
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from fake_useragent import UserAgent

import json
import pprint
import time
from pathlib import Path


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

# driver = wd.Chrome(
#     executable_path='/usr/bin/chromedriver',
#     options=options
# )

# driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

# Loads trail info from a state's info.txt file into a dict
def load_trail_info(state="virginia"):
    with open(f"./states/{state}/info.txt") as file:
        lines = file.readlines()
        dct = {}
        for line in lines:
            # Read lines from file and chop off \n char
            data = eval(line[:len(line)-1])
            dct[data["name"]] = data
        return dct

# Load links from a state's links.txt file
def load_trail_links(state="virginia"):
    # Read lines from file and chop off \n char
    with open(f"./states/{state}/links.txt") as file:
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


def scrape_trail_info(driver, state="virginia", start_index=0, limit=3):
    links = load_trail_links(state)
    info = load_trail_info(state)

    lst = []
    count = 0
    for link in links:
        driver.get(link)
        time.sleep(10)

        # Clean data
        length = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[1]/span[2]').text
        length = float(length.split(' ')[0])

        elevation_gain = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[2]/span[2]').text
        elevation_gain = int(elevation_gain.split(' ')[0].replace(',', ''))

        duration = calculate_duration(length, elevation_gain)

        data = {
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
            "tags": None
        }
        lst.append(str(data) + "\n")
        count += 1
        if count > limit:
            break

    with open(f'./states/{state}/info.txt', 'w') as file:
        file.writelines(lst)


def calculate_duration(length, elevation_gain):
    total_min = int((length / 3 + elevation_gain / 2000) * 60)
    return (total_min // 60, total_min % 60)

# scrape_trail_links(driver, STATES["va"])
scrape_trail_info(driver, STATES["va"])
