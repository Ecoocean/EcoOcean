import React from "react";

const Image = ({ src }) => (
    <div>
        <img
            alt="analysis_image"
            src={src}
            style={{ display: "block", width: "100%", height: "auto" }}
        />
    </div>
);

export default Image;
