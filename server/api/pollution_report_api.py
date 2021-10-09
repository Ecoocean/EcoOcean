from google.cloud.firestore_v1 import GeoPoint
from api import mutation, query
from models.pollution_report import PollutionReport


@query.field("getAllPollutionReports")
def get_pollution_reports_resolver(_, info):
    return PollutionReport.collection.fetch()


@mutation.field("createPollutionReport")
def create_pollution_report_resolver(_, info, latitude, longitude, type):
    pollution_report = PollutionReport(location=GeoPoint(latitude, longitude),
                                       type=type)
    pollution_report.save()
    return pollution_report
