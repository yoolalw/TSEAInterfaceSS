from io import BytesIO

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.ie.service import Service
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

# Teste de interface !!

@pytest.fixture()
def chrome():
    service = Service(ChromeDriverManager().install())
    chrome = webdriver.Chrome(service=service)
    chrome.get('http://127.0.0.1:5500/interfaceSa.html')

    chrome.implicitly_wait(4)
    yield chrome
    chrome.quit()


@pytest.mark.usefixtures("chrome")
def test_displayed_itens(chrome):
    chrome.find_element(By.CLASS_NAME, "version-card").is_displayed()
    chrome.find_element(By.ID, "nav-versoes").is_displayed()
    chrome.find_element(By.ID, "nav-cliente").is_displayed()

@pytest.mark.usefixtures("chrome")
def test_click_redirect_itens(chrome):
    chrome.find_element(By.CLASS_NAME, "version-card").click()
    # nav_ver = chrome.find_element(By.ID, "nav-versoes").is_displayed()
    # nav_cli = chrome.find_element(By.ID, "nav-cliente").is_displayed()

    wait = WebDriverWait(chrome, 5)
    wait.until(lambda _ : chrome.find_element(By.CLASS_NAME, "version-label").is_displayed())

    wait.until(lambda _ : chrome.find_element(By.XPATH(" //*[@id="mainContent"]/div[2]/img")).is_displayed()




