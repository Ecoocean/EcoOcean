import React from "react";

const Copyrights = () => {
  return (
    <div>
      <span>.הפלטפורמה הינה למטרת מחקר אקדמאי בלבד</span>
      &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
      <span>
        <a href="#">EcoOcean כל הזכויות שמורות ל</a> &copy;{" "}
        {new Date().getFullYear()}
      </span>
    </div>
  );
};

export default Copyrights;
