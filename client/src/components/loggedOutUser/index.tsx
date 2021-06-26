import React from "react";
import { Link } from "@material-ui/core";
import { navigate } from "gatsby";

const LoggedOutUser = () => {
  const linkOnClickHandler = (
    e:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate("/signin");
  };

  return (
    <div>
      <p>
        Please,{" "}
        <Link href="/signin" onClick={linkOnClickHandler}>
          login
        </Link>{" "}
        to view your todos dashboard.
      </p>
    </div>
  );
};

export default LoggedOutUser;
