from db.cassandra_client import session
from datetime import datetime

# utility function to record events in Cassandra
def record_event(
    product_id: int,
    event_type: str # view, favorite, buy
):
    event_time = datetime.utcnow()

    session.execute(
        """
        INSERT INTO product_events
        (product_id, event_type, event_time)
        VALUES (%s, %s, %s)
        """,
        (
            product_id,
            event_type,
            event_time
        )
    )

    session.execute(
        """
        UPDATE product_metrics
        SET count = count + 1
        WHERE product_id = %s
        AND event_type = %s
        """,
        (
            product_id,
            event_type
        )
    )

    return {
        "success": True,
        "product_id": product_id,
        "event_type": event_type
    }
