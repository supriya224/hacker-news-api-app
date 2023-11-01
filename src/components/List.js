import React, { useState, useEffect } from "react";



const JobBoard = () => {
  const [jobIds, setJobIds] = useState([]);
  const [jobDetails, setJobDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Fetch the initial list of job posting IDs
    fetch("https://hacker-news.firebaseio.com/v0/jobstories.json")
      .then((response) => response.json())
      .then((data) => setJobIds(data));
  }, []);

  useEffect(() => {
    // Fetch job details for the current page
    const startIndex = currentPage * 6;
    const endIndex = startIndex + 6;
    const pageIds = jobIds.slice(startIndex, endIndex);

    const promises = pageIds.map((id) =>
      fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      ).then((response) => response.json())
    );

    Promise.all(promises).then((data) => setJobDetails(data));
  }, [jobIds, currentPage]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container">
      <h1 className="heading"> Hacker News Job Board</h1>
      <ul className="list">
        {jobDetails.map((job) => (
          <li key={job.id} className="list list-items">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="list-link"
            >
              {job.title}
            </a>
            <p className="list-paragraph">
              {" "}
              {job.by} on {new Date(job.time * 1000).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
      {currentPage * 6 < jobIds.length && (
        <button onClick={loadMore} className="btn-btn">
          Load More Jobs
        </button>
      )}
    </div>
  );
};

export default JobBoard;
