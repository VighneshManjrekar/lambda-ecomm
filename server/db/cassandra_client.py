from cassandra.cluster import Cluster
from dotenv import load_dotenv
import os

load_dotenv()

CASSANDRA_HOST = os.getenv("CASSANDRA_HOST", "localhost")

cluster = Cluster([CASSANDRA_HOST])

session = cluster.connect()

KEYSPACE = "hybrid_analytics"

session.set_keyspace(KEYSPACE)