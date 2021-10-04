from fireo.models import Model
from fireo.fields import IDField, GeoPoint


class Beach(Model):
    name = IDField()
    location = GeoPoint()
