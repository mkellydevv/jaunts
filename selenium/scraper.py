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

URL = "https://www." + "all" + "trails" + ".com"
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
# options.add_argument("disable-extensions")
options.add_argument("disable-infobars")
options.add_argument("incognito")
options.add_argument(f"user-agent={userAgent}")
options.add_argument("window-size=1280,1440")

driver = wd.Chrome(
    executable_path='/usr/bin/chromedriver',
    options=options
)

driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")


def login(driver):
    '''
    Login to AllTrails.com with a username and password as command line arguments.
    '''
    if len(sys.argv) < 3:
        print("Error: Login requires email and password as command line args")
        driver.close()
        exit()

    # Navigate to login page and wait for it to load
    driver.get(URL + "/login?ref=header")
    waitForIt(driver, 3, '//*[@id="login-form"]/div/div/div[2]/form/input', 'xpath')

    # Enter login info and submit
    driver.find_element(By.NAME, 'userEmail').send_keys(sys.argv[1])
    driver.find_element(By.NAME, 'userPassword').send_keys(sys.argv[2])
    driver.find_element(By.XPATH, '//*[@id="login-form"]/div/div/div[2]/form/input').click()

    # Wait to be redirected
    waitForIt(driver, 3, 'searchBar')

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

# Load img links from a state's img_links.txt file
def load_trail_img_links(state="virginia"):
    # Read lines from file and chop off \n char
    with open(f"./states/{state}/img_links.txt", 'r') as file:
        lines = file.readlines()
        for i, line in enumerate(lines):
            lines[i] = line[:len(line)-1]
        return lines

# Saves links to trails from a particular state to a text file
def scrape_trail_links(driver, state="virginia", amount=10):
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
    img_links = load_trail_img_links(state)

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

        # Navigate to link
        driver.get(link)

        # Wait for trail page to load
        loop = True
        while loop:
            try:
                WebDriverWait(driver, 3) \
                    .until(EC.presence_of_element_located((By.ID, 'text-container-description')))
                loop = False
            except:
                time.sleep(3)
                pass

        # Clean data before inserting into txt file
        name = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/h1').text
        region = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/a').text
        overview = driver.find_element(By.XPATH, '//*[@id="auto-overview"]').text
        description = driver.find_element(By.ID, 'text-container-description').text

        try:
            driver.find_element(By.XPATH, '//*[text()="Tips"]').click()
            tips = driver.find_element(By.ID, 'text-container-tips').text
        except:
            tips = ""

        try:
            driver.find_element(By.XPATH, '//*[text()="Getting There"]').click()
            getting_there = driver.find_element(By.ID, 'text-container-getting_there').text
        except:
            getting_there = ""

        difficulty = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[1]').text

        length = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[1]/span[2]').text
        length = float(length.split(' ')[0])

        elevation_gain = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[2]/span[2]').text
        elevation_gain = int(elevation_gain.split(' ')[0].replace(',', ''))

        route_type = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[3]/span[2]').text

        duration = calculate_duration(length, elevation_gain)

        default_rating = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[2]/meta[1]').get_attribute("content")

        default_weighting = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[2]/meta[4]').get_attribute("content")

        tags = driver.find_elements_by_class_name('big.rounded.active')
        for j in range(len(tags)):
            tags[j] = tags[j].text

        review_eles = driver.find_elements_by_class_name('styles-module__details___1QPxR.xlate-google > p')
        reviews = []
        for j in range(10):
            reviews.append(review_eles[j].text)

        # Package data into an object
        info[link] = {
            "link": link,
            "name": name,
            "region": region,
            "overview": overview,
            "description": description,
            "tips": tips,
            "getting_there": getting_there,
            "difficulty": difficulty,
            "length": length,
            "elevation_gain": elevation_gain,
            "route_type": route_type,
            "duration_hours": duration[0],
            "duration_minutes": duration[1],
            "default_rating": default_rating,
            "default_weighting": default_weighting,
            "tags": tags,
            "reviews": reviews
        }

        # Scrape current trail images and track data
        driver.get(link.replace("?ref=result-card", "/photos"))
        time.sleep(8)
        urls = []
        photos = driver.find_elements_by_class_name("photo-item.gallery.sm")
        for j in range(10):
            urls.append(photos[j].get_attribute("href"))
        img_links.append(urls)

        print("    scraped", i, info[link]["name"])
        i += 1

    # Insert packaged info data into txt file
    with open(f'./states/{state}/info.txt', 'w') as file:
        for trail in info:
            file.write(str(info[trail]) + "\n")

    # Insert packaged image links into txt file
    with open(f'./states/{state}/img_links.txt', 'w') as file:
        for lst in img_links:
            file.write(str(lst) + "\n")


def download_trail_route_data(driver):
    # Hover more button
    more_btn = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[2]/ul/div')
    ActionChains(driver).move_to_element(more_btn).perform()

    # Click on Download Route button
    waitForIt(driver, 3, '//*[@id="trail_more_alternative_menu"]/span/div[1]/a')
    driver.find_element(By.XPATH, '//*[@id="trail_more_alternative_menu"]/span/div[1]/a').click()

    # Select jsonTrk option
    waitForIt(driver, 3, 'download')
    select = Select(driver.find_element_by_id("download"))
    select.select_by_value('jsonTrk')

    # Click on Download button
    driver.find_element(By.XPATH, '//*[@id="map-download-modal"]/div/div[3]/div/button[2]').click()
    time.sleep(5)


def calculate_duration(length, elevation_gain):
    '''
    Calculates expected amount of time to complete a trail using "Naismith's rule"
    '''
    total_min = int((length / 3 + elevation_gain / 2000) * 60)
    return (total_min // 60, total_min % 60)


def waitForIt(driver, duration, selector, attr='id', stale=False):
    '''
    Waits until the specified element by ID is present on the page.
    '''
    loop = True
    while loop:
        try:
            if attr == 'id':
                WebDriverWait(driver, duration) \
                    .until(EC.presence_of_element_located((By.ID, selector)))
            elif attr == 'xpath':
                WebDriverWait(driver, duration) \
                    .until(EC.presence_of_element_located((By.XPATH, selector)))
            loop = False
        except:
            time.sleep(duration)


def scrape_trail_data(driver, state, limit=1):
    links = load_trail_links(state)
    # Load trail data from json
    try:
        with open(f'./states/{state}/trails.json', 'r') as f:
            trails = json.load(f)
    except:
        trails = {}

    i = 0
    end = min(limit, len(links))
    while i < end:
        link = links[i]
        if link in trails:
            print("    skipped", i, trails[link]["name"])
            i +=1
            end = min(end + 1, len(links))
            continue

        # Navigate to trail page
        driver.get(link)

        # Wait for page to load
        waitForIt(driver, 3, 'text-container-description')

        # Scrape trail data
        name = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/h1').text
        region = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/a').text
        overview = driver.find_element(By.XPATH, '//*[@id="auto-overview"]').text
        description = driver.find_element(By.ID, 'text-container-description').text
        difficulty = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[1]').text
        route_type = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[3]/span[2]').text
        default_rating = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[2]/meta[1]').get_attribute("content")
        default_weighting = driver.find_element(By.XPATH, '//*[@id="title-and-menu-box"]/div[1]/div/div/span[2]/meta[4]').get_attribute("content")

        try:
            driver.find_element(By.XPATH, '//*[text()="Tips"]').click()
            tips = driver.find_element(By.ID, 'text-container-tips').text
        except:
            tips = ""

        try:
            driver.find_element(By.XPATH, '//*[text()="Getting There"]').click()
            getting_there = driver.find_element(By.ID, 'text-container-getting_there').text
        except:
            getting_there = ""

        length = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[1]/span[2]').text
        length = float(length.split(' ')[0])

        elevation_gain = driver.find_element(By.XPATH, '//*[@id="main"]/div[2]/div[1]/article/section[2]/div/span[2]/span[2]').text
        elevation_gain = int(elevation_gain.split(' ')[0].replace(',', ''))

        duration = calculate_duration(length, elevation_gain)

        tags = driver.find_elements_by_class_name('big.rounded.active')
        for j in range(len(tags)):
            tags[j] = tags[j].text

        review_eles = driver.find_elements_by_class_name('styles-module__details___1QPxR.xlate-google > p')
        reviews = []
        for j in range(10):
            reviews.append(review_eles[j].text)

        # Download trail route data
        # download_trail_route_data(driver)

        # Navigate to photos of this trail
        driver.get(link.replace("?ref=result-card", "/photos"))
        waitForIt(driver, 3, 'photo-fileupload-button')
        images = driver.find_elements_by_class_name("photo-item.gallery.sm")
        image_urls = []
        for j in range(10):
            image_urls.append(images[j].get_attribute("href"))

        # Store trail data in dict
        trails[link] = {
            "name": name,
            "region": region,
            "overview": overview,
            "description": description,
            "tips": tips,
            "getting_there": getting_there,
            "difficulty": difficulty,
            "length": length,
            "elevation_gain": elevation_gain,
            "route_type": route_type,
            "duration_hours": duration[0],
            "duration_minutes": duration[1],
            "default_rating": default_rating,
            "default_weighting": default_weighting,
            "tags": tags,
            "reviews": reviews,
            "images": image_urls
        }

        # Save trail data to json
        with open(f'./states/{state}/trails.json', 'w') as f:
            json.dump(trails, f)

        i += 1
        print("scraped", i, trails[link]["name"])


# scrape_trail_links(driver, STATES["va"])
# login(driver)
scrape_trail_data(driver, STATES["va"], 2)
