import React, { useState } from "react";
import { Modal } from "reactstrap";

function ModalVideo({ video }) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <div className="d-flex flex-column justify-content-center">
        <video
          className="m-1"
          key={video.url}
          style={{ height: "9rem", width: "9rem" }}
          onClick={() => setModal((modal) => !modal)}
        >
          <source src={video.url} />
        </video>
        <p style={{ textAlign: "center" }}>{video.caption}</p>
      </div>

      <Modal
        centered
        isOpen={modal}
        toggle={() => setModal((prevModal) => !prevModal)}
      >
        <video key={video.url} controls>
          <source src={video.url} />
        </video>
        <p style={{ textAlign: "center" }}>{video.caption}</p>
      </Modal>
    </>
  );
}

export default ModalVideo;
