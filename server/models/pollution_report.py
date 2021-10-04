from fireo.fields import GeoPoint
from fireo.fields import DateTime, TextField
from fireo.models import Model


class PollutionReport(Model):
    location = GeoPoint()
    created_at = DateTime(auto=True)
    type = TextField()
