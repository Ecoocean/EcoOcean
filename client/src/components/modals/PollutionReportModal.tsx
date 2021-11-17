import React from "react";
import { Button, Modal } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

export const PollutionReportModal = ({ report, show, handleClose }: any) => {
  return (
    report && (
      <Modal size="lg" show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Pollution Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ID: {report.id}
          {report.address
            ? `Address: ${report.address}`
            : `Coordinates: lat: ${report.geom.y}, lng: ${report.geom.x}`}
          <ImageList sx={{ width: 350, height: 350 }} cols={2}>
            {report.photoUrls?.map((photoUrl: string) => (
              <ImageListItem key={photoUrl}>
                <a href={photoUrl} target="_blank">
                  <img width="164" height="164" src={photoUrl} />
                </a>
              </ImageListItem>
            ))}
          </ImageList>
        </Modal.Body>
        <Modal.Footer>
          <Avatar
            alt={report.reporter}
            src={!!report.reporterImageUrl ? report.reporterImageUrl : "/"}
          />
          {`Reporter: ${report.reporter}`}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  );
};
