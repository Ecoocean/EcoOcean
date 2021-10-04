from fireo.utils.utils import generateKeyFromId
from google.cloud.firestore_v1 import GeoPoint

from api import query, mutation
from models.beach import Beach


@query.field("beaches")
def list_beaches_resolver(_, info):
    return Beach.collection.fetch()


@query.field("beach")
def get_beach_resolver(_, info, name):
    return Beach.collection.get(generateKeyFromId(Beach, name))


@mutation.field("addBeach")
def resolve_order_coffee(_, info, name, altitude, longitude):
    beach_element = Beach(name=name,
                          location=GeoPoint(altitude, longitude))
    beach_element.save()
    return beach_element
