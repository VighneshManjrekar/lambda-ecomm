from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os

load_dotenv()

ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL")

es = Elasticsearch(ELASTICSEARCH_URL)