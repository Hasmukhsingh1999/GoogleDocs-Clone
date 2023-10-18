// SavedDocs.js
import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const SavedDocs = ({ savedData }) => {
  const { id } = useParams();

  // Assuming you have a function to filter savedData by id
  const filteredData = savedData

  return (
    <div>
      {filteredData &&
        filteredData.map((savedVersion, index) => (
          <Card key={index}>
            <CardContent>
              <Typography variant="h5">Saved Version {index + 1}</Typography>
              {savedVersion.ops.map((op, opIndex) => (
                <Typography key={opIndex} variant="body1">
                  {op.insert}
                </Typography>
              ))}
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default SavedDocs;
