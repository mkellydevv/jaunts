from selenium import webdriver as wd
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

print('555')
options = wd.ChromeOptions()
options.add_argument(" - incognito")

driver = wd.Chrome(
    executable_path='/usr/bin/chromedriver',
    options=options
)
print('555')

driver.get("https://alltrails.com")
print(driver.title)
driver.quit()
