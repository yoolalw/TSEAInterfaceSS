from io import BytesIO

import pytest
import validators
from selenium import webdriver
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.ie.service import Service
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

# Teste E2E !!

@pytest.fixture()
def chrome():
    service = Service(ChromeDriverManager().install())
    chrome = webdriver.Chrome(service=service)
    chrome.get('http://127.0.0.1:5500/interfaceSa.html')

    chrome.implicitly_wait(10)
    yield chrome
    chrome.quit()



@pytest.mark.usefixtures("chrome")
def test_click_redirect_itens(chrome):
    #verifica se os itens estao na tela
    chrome.find_element(By.CLASS_NAME, "version-card").is_displayed()
    chrome.find_element(By.ID, "nav-versoes").is_displayed()
    chrome.find_element(By.ID, "nav-cliente").is_displayed()

    #clica no elemento
    chrome.find_element(By.CLASS_NAME, "version-card").click()

    #verifica se redirecionou
    wait = WebDriverWait(chrome, 10)
    wait.until(lambda _ : chrome.find_element(By.CLASS_NAME, "version-label").is_displayed())

    #clica
    chrome.find_element(By.CLASS_NAME, "version-card").click()

    #verifica se redirecionou
    wait.until(lambda _: chrome.find_element(By.ID, "imgURLDoc").is_displayed())

    chrome.find_element(By.CLASS_NAME, "info-value").click()
    url = "https://xuhzmpkxbbcigdmwmzzl.supabase.co/storage/v1/object/public/docs/ChatGPT%20Image%2011_05_2026,%2010_33_18.png"
    assert validators.url(url) == True






