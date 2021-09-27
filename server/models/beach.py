from fireo.models import Model
from fireo.fields import IDField, NumberField


class Beach(Model):
    name = IDField()
    altitude = NumberField()
    longitude = NumberField()
