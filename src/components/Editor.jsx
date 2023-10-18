import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { useParams, useNavigate  } from "react-router-dom";
import SavedDocs from "./SavedDocs";
const Component = styled(Box)`
  background: #f5f5f5;
`;

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["clean"], // remove formatting button
];

const Editor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id } = useParams();
  const quillRef = useRef(null);
  const [savedData, setSavedData] = useState([]);
  const navigate = useNavigate(); // Update to useNavigate
  useEffect(() => {
    if (quillRef.current === null) {
      const quillInstance = new Quill("#container", {
        theme: "snow",
        modules: { toolbar: toolbarOptions },
      });
      quillInstance.disable();
      quillInstance.setText("Loading the document....");
      quillRef.current = quillInstance; // Assign the Quill instance to the ref
      setQuill(quillInstance);
    }
  }, []);

  useEffect(() => {
    const socketServer = io("http://localhost:9000");
    setSocket(socketServer);

    // Clean up socket connection when the component unmounts
    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const handleChange = (delta, oldData, source) => {
      // If changes not done by the user, simply return
      if (source !== "user") return;
      // Send changes to the server
      socket && socket.emit("send-change", delta);
    };

    quill && quill.on("text-change", handleChange);

    // Clean up event listener when the component unmounts
    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const handleChange = (delta) => {
      quill.updateContents(delta);
    };

    socket && socket.on("receive-changes", handleChange);

    // Clean up event listener when the component unmounts
    return () => {
      socket && socket.off("receive-changes", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (quill === null || socket === null) return;
    socket &&
      socket.once("load-document", (document) => {
        quill && quill.setContents(document);
        quill && quill.enable();
      });
    socket && socket.emit("get-document", id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const interval = setInterval(() => {
      socket && socket.emit("save-document", quill.getContents());
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  const handleSaveDocument = () => {
    const documentData = quill.getContents();
    socket.emit("save-document", documentData);
    setSavedData([...savedData, documentData]);
    navigate(`/save-docs/${id}`); 
  };

  return (
    <Component>
      <Link to="/save-docs/" onClick={handleSaveDocument}>
        Save
      </Link>
      <Box id="container" className="container"></Box>
    </Component>
  );
};

export default Editor;
