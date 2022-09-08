import React, { useEffect, useState, useMemo } from "react";
import { Input } from "reactstrap";

import removeImg from "./assets/remove.svg";

const iconByFn = {
  remove: { backgroundImage: `url(${removeImg})` },
};

function PreviewMedia({
  style,
  className,
  imageClassName,
  imageStyle,
  fileWithMeta: { remove },
  meta: {
    name = "",
    previewUrl,
    type,
    id,
    size = 0,
    status,
    duration,
    validationError,
  },
  canRemove,
  extra: { minSizeBytes },
  newReview,
  setNewReview,
}) {
  let title = `${name || "?"},`;
  if (duration) title = `${title},`;

  const [value, setValue] = useState("");

  const imagePattern = useMemo(() => /image\/\w+/, []),
    videoPattern = useMemo(() => /video\/\w+/, []),
    audioPattern = useMemo(() => /audio\/\w+/, []);
  useEffect(() => {
    function getValue() {
      if (imagePattern.test(type)) {
        return newReview.images.find((image) => image.id === id).caption;
      } else if (videoPattern.test(type)) {
        return newReview.videos.find((video) => video.id === id).caption;
      } else if (audioPattern.test(type)) {
        return newReview.audios.find((audio) => audio.id === id).caption;
      }
    }

    const temp = getValue();
    if (temp === undefined) {
      setValue("");
    } else {
      setValue(temp);
    }
  }, [imagePattern, videoPattern, audioPattern, newReview, id, type]);

  function changeParentValue(e) {
    let index;

    if (imagePattern.test(type)) {
      index = newReview.images.findIndex((image) => image.id === id);
      setNewReview((newReview) => {
        return {
          ...newReview,
          images: [
            ...newReview.images.slice(0, index),
            { ...newReview.images[index], caption: value },
            ...newReview.images.slice(index + 1),
          ],
        };
      });
    } else if (videoPattern.test(type)) {
      index = newReview.videos.findIndex((video) => video.id === id);
      setNewReview((newReview) => {
        return {
          ...newReview,
          videos: [
            ...newReview.videos.slice(0, index),
            { ...newReview.videos[index], caption: value },
            ...newReview.videos.slice(index + 1),
          ],
        };
      });
    } else if (audioPattern.test(type)) {
      index = newReview.audios.findIndex((audio) => audio.id === id);
      setNewReview((newReview) => {
        return {
          ...newReview,
          audios: [
            ...newReview.audios.slice(0, index),
            { ...newReview.audios[index], caption: value },
            ...newReview.audios.slice(index + 1),
          ],
        };
      });
    }
  }

  if (status === "error_file_size" || status === "error_validation") {
    return (
      <div className={className} style={style}>
        <span className="dzu-previewFileNameError">{title}</span>
        {status === "error_file_size" && (
          <span>{size < minSizeBytes ? "File too small" : "File too big"}</span>
        )}
        {status === "error_validation" && (
          <span>{String(validationError)}</span>
        )}
        {canRemove && (
          <span
            className="dzu-previewButton"
            style={iconByFn.remove}
            onClick={remove}
          />
        )}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <span
        style={{
          alignSelf: "flex-start",
          margin: "10px 3%",
          fontFamily: "Helvetica",
        }}
      >
        {previewUrl && (
          <img
            className={imageClassName}
            style={imageStyle}
            src={previewUrl}
            alt={title}
            title={title}
          />
        )}
      </span>
      {!previewUrl && <span className="dzu-previewFileName">{title}</span>}
      <Input
        onBlur={changeParentValue}
        type="text"
        placeholder="caption"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="dzu-previewStatusContainer">
        {status !== "preparing" &&
          status !== "getting_upload_params" &&
          status !== "uploading" &&
          canRemove && (
            <span
              className="dzu-previewButton"
              style={iconByFn.remove}
              onClick={remove}
            />
          )}
      </div>
    </div>
  );
}

export default PreviewMedia;
