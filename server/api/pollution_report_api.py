

from google.cloud.firestore_v1 import GeoPoint
from pyrebase import pyrebase
from api import mutation, query
from models.pollution_report import PollutionReport

config = {
    "apiKey": "AIzaSyCFooLdzMAr2gXrGkKEzNUFNE6S5CtNq9g",
    "authDomain": "ecoocean.firebaseapp.com",
    "databaseURL": "https://ecoocean-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "ecoocean",
    "storageBucket": "ecoocean.appspot.com",
    "messagingSenderId": "1006140535576",
    "appId": "1:1006140535576:web:8162685da451d5bd9f646d",
    "measurementId": "G-CCN1TXNL3L"
}
firebase = pyrebase.initialize_app(config)

@query.field("getAllPollutionReports")
def get_pollution_reports_resolver(_, info):
    return PollutionReport.collection.fetch()


@mutation.field("createPollutionReport")
def create_pollution_report_resolver(_, info, latitude, longitude, type, images):
    pollution_report = PollutionReport(location=GeoPoint(latitude, longitude),
                                       type=type)
    storage = firebase.storage()
    # as admin
    # for image in images:
    #     image_data = image.split(';')
    #
    # msg = base64.b64decode(images[0])
    # im_arr = np.frombuffer(msg, dtype=np.uint8)  # im_arr is one-dim Numpy array
    # img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
    # storage.child("images/example.png").put(images[0])

    pollution_report.save()
    return pollution_report
