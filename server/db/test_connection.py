from mongodb import client
from elasticsearch_client import es

print("\n=== MongoDB ===")
try:
    print(client.server_info()["version"])
    print("MongoDB Connected")
except Exception as e:
    print("MongoDB Failed")
    print(e)


print("\n=== Elasticsearch ===")
try:
    print(es.info())
    print("Elasticsearch Connected")
except Exception as e:
    print("Elasticsearch Failed")
    print(e)


print("\n=== Cassandra ===")
try:
    from cassandra.cluster import Cluster

    cluster = Cluster(["localhost"])
    session = cluster.connect()

    rows = session.execute(
        "SELECT release_version FROM system.local"
    )

    for row in rows:
        print("Version:", row.release_version)

    print("Cassandra Connected")

except Exception as e:
    print("Cassandra Failed")
    print(e)