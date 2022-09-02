import React, { useState } from "react";
import { Modal } from "reactstrap";

function ModalVideo({ video }) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <video
        className="m-1"
        key={video.url}
        style={{ height: "4rem", width: "4rem" }}
        onClick={() => setModal((modal) => !modal)}
      >
        <source src={video.url} />
      </video>
      <Modal
        centered
        isOpen={modal}
        toggle={() => setModal((prevModal) => !prevModal)}
      >
        <video key={video.url} controls>
          <source src={video.url} />
        </video>
      </Modal>
    </>
  );
}

export default ModalVideo;
