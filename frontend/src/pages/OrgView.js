import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import { GoLocation, GoGlobe, GoMail } from "react-icons/go";
import { BsTelephoneFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

import "./css/OrgView.css";
import Review from "../components/Review";
import NewReview from "../components/NewReview";
import Header from "../components/Header";
import { fetchReviewsByOrg } from "../apiHelpers/review";

function OrgView({ logged, setLogged, userID, org }) {
  const [addSection, setAddSection] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setavgRating] = useState(0);

  const pageSize = 5;
  const navigate = useNavigate();
  useEffect(() => {
    if (org === null) {
      navigate("/");
    } else {
      (async function () {
        const response = await fetchReviewsByOrg(org.orgID);
        if (response.status === "success") {
          setReviews(response.reviews);
          setPageCount(Math.ceil(response.reviews.length / pageSize));
          setavgRating(
            response.reviews.reduce(
              (total, review) => total + review.rating,
              0
            ) / response.reviews.length
          );
        } else {
          //Error Handling
        }
      })();
    }
  }, [org, addSection, navigate]);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };
  if (!org) {
    return <></>;
  }
  return (
    <div className="min-vh-100">
      <Header logged={logged} setLogged={setLogged} />
      <div className="d-flex OrgView p-3">
        <div
          style={{ minHeight: "10rem" }}
          className="w-100 flex-wrap d-flex container-fluid org-dets align-items-center"
        >
          <div className="">
            <div className="fs-5 fw-bold">{org.name}</div>
            <div className="d-flex align-items-center">
              <StarRatings
                rating={avgRating}
                numberOfStars={5}
                starRatedColor="rgb(253,204,13)"
                starDimension="1rem"
              />
              <div className="d-flex ms-2 mt-3 align-items-end">
                <p className="fs-3 fst-italic ">{avgRating}</p>
                <p className="fs-4 fst-italic">/5</p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column">
            <div>
              <GoLocation />
              {org.address}
            </div>
            <div>
              <BsTelephoneFill />
              {org.phone}
            </div>
            <div>
              <GoGlobe />
              <a
                target="_blank"
                rel="noreferrer"
                style={{ color: "rgb(33, 37, 41)" }}
                href={`${org.website}`}
              >
                Website
              </a>
            </div>
            <div>
              <GoMail />
              {org.email ? org.email : "NA"}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center">
        <div className=" mt-3 d-flex w-75">
          <div
            role="button"
            className={`fw-bold section p-2 ${addSection ? "" : "selected"}`}
            onClick={() => setAddSection(false)}
          >
            Reviews
          </div>
          <div
            role="button"
            className={`fw-bold section p-2 ${!addSection ? "" : "selected"}`}
            onClick={() => setAddSection(true)}
          >
            Add Review
          </div>
        </div>
        {!addSection ? (
          <div className=" mt-3 reviews w-100 d-flex flex-column align-items-center">
            {reviews
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((value) => {
                return <Review key={value.reviewID} review={value} />;
              })}
          </div>
        ) : (
          <NewReview org={org} userID={userID} setAddSection={setAddSection} />
        )}
        {!addSection && reviews.length !== 0 && (
          <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={currentPage <= 0}>
              <PaginationLink
                onClick={(e) => handleClick(e, 0)}
                first
                href="#"
              />
            </PaginationItem>
            <PaginationItem disabled={currentPage <= 0}>
              <PaginationLink
                onClick={(e) => handleClick(e, currentPage - 1)}
                previous
                href="#"
              />
            </PaginationItem>
            {[...Array(pageCount)].map((_, i) => (
              <PaginationItem active={i === currentPage} key={i}>
                <PaginationLink onClick={(e) => handleClick(e, i)} href="#">
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem disabled={currentPage >= pageCount - 1}>
              <PaginationLink
                onClick={(e) => handleClick(e, currentPage + 1)}
                next
                href="#"
              />
            </PaginationItem>
            <PaginationItem disabled={currentPage >= pageCount - 1}>
              <PaginationLink
                onClick={(e) => handleClick(e, 0)}
                last
                href="#"
              />
            </PaginationItem>
          </Pagination>
        )}
      </div>
    </div>
  );
}

export default OrgView;
