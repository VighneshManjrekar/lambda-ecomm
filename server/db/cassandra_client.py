from cassandra.cluster import Cluster
from dotenv import load_dotenv
import os

load_dotenv()

CASSANDRA_HOST = os.getenv("CASSANDRA_HOST", "localhost")

cluster = Cluster([CASSANDRA_HOST])

session = cluster.connect()

session.execute("""
CREATE KEYSPACE IF NOT EXISTS hybrid_analytics
WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
}
""")

session.set_keyspace("hybrid_analytics")

session.execute("""
CREATE TABLE IF NOT EXISTS product_events (
    product_id int,
    event_type text,
    event_time timestamp,

    PRIMARY KEY ((product_id), event_type, event_time)
)
WITH CLUSTERING ORDER BY (event_type ASC, event_time DESC);
""")

session.execute("""
CREATE TABLE IF NOT EXISTS product_metrics (
    product_id int,
    event_type text,
    count counter,
    PRIMARY KEY (product_id, event_type)
);
""")