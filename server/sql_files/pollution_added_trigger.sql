CREATE TRIGGER pollution_report_added_trigger
    AFTER INSERT
   ON pollution_reports
   FOR EACH ROW
       EXECUTE PROCEDURE pollution_report_added_fun()