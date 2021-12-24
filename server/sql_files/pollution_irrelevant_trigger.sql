CREATE TRIGGER pollution_report_irrelevant_trigger
    AFTER UPDATE ON pollution_reports
   FOR EACH ROW
       EXECUTE PROCEDURE pollution_report_irrelevant_fun()