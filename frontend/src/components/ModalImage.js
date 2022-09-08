import React, { useState } from "react";
import { Modal } from "reactstrap";

function ModalImage({ image }) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <img
        className="m-1"
        style={{ height: "4rem", width: "4rem" }}
        alt="reviewImage"
        src={image.url}
        key={image.id}
        onClick={() => setModal(true)}
      />
      <Modal
        centered
        isOpen={modal}
        toggle={() => setModal((prevModal) => !prevModal)}
      >
        <img
          className="w-100"
          alt="reviewImage"
          src={image.url}
          key={image.id}
        />
        <p style={{ textAlign: "center" }}>{image.caption}</p>
      </Modal>
    </>
  );
}

export default ModalImage;
