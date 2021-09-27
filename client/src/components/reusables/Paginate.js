import React from "react";
import { Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Paginate = ({ prefix, pages, page }) => {
  const navigate = useNavigate();
  return (
    pages > 1 && (
      <Pagination className="mr-0 pr-0 ltr justify-content-end">
        {[...Array(pages).keys()].map((x) => (
          <Pagination.Item
            key={x + 1}
            onClick={(e) => navigate(`${prefix}/${x + 1}`)}
            active={x + 1 == page}
          >
            {x + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
