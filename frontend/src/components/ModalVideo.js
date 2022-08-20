import React, { useState } from "react";
import { Modal } from "reactstrap";

function ModalVideo({ video }) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <video
        className="m-1"
        key={video.id}
        style={{ height: "4rem", width: "4rem" }}
        onClick={() => setModal((modal) => !modal)}
      >
        <source src={video.url} type="video/mp4" />
      </video>
      <Modal isOpen={modal} toggle={() => setModal((prevModal) => !prevModal)}>
        <video key={video.id} controls>
          <source src={video.url} type="video/mp4" />
        </video>
      </Modal>
    </>
  );
}

export default ModalVideo;
