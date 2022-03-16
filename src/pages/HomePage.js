import { useState } from "react";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoadingButton from "@mui/lab/LoadingButton";

const Input = styled("input")({
  display: "none",
});

const username = "bobsmith";

export const HomePage = () => {
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = {
    container: {
      backgroundColor: "#fff",
    },
    header: {
      paddingTop: 2,
      paddingBottom: 2,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 4,
    },
  };

  const uploadImages = async () => {
    setLoading(true);
    aws.config.update({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_ACCESS_ID,
      region: process.env.REACT_APP_REGION,
      signatureVersion: "v4",
    });

    const s3 = new aws.S3();

    images.forEach((image) => {
      image.uuid = uuidv4();
    });

    const preCheckPromises = images.map((image) =>
      s3.createPresignedPost({
        Bucket: process.env.REACT_APP_BUCKET_NAME,
        Fields: { key: `${username}/images/${image.uuid}` },
        Expires: 60,
      })
    );

    const preChecks = await Promise.all(preCheckPromises);

    const uploadPromises = preChecks.map(({ url, fields }, index) => {
      const formData = new FormData();

      Object.entries({ ...fields, file: images[index] }).forEach(
        ([key, value]) => {
          formData.append(key, value);
        }
      );

      return fetch(url, {
        method: "POST",
        body: formData,
      });
    });

    const uploads = await Promise.all(uploadPromises);

    const uploadsComplete = uploads.every((upload) => {
      return upload.ok;
    });

    if (uploadsComplete) {
      setUploadComplete(true);
      setImages([]);
      setUploadedImages([
        ...uploadedImages,
        ...uploads.map(({ url }, index) => ({
          src: `${url}/${username}/images/${images[index].uuid}`,
          fileName: `${username}/images/${images[index].uuid}`,
        })),
      ]);
      setLoading(false);
    } else {
      console.log("Failed to upload");
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography
        variant="h4"
        gutterBottom
        component="h1"
        align="center"
        sx={styles.header}
      >
        Upload Images
      </Typography>
      <Divider />
      <Box component="form" sx={styles.form}>
        <Stack spacing={2} alignItems="center">
          <label htmlFor="image-uploader">
            <Input
              accept="image/*"
              id="image-uploader"
              multiple
              type="file"
              onChange={(event) => {
                setImages([...images, ...event.target.files]);
              }}
            />
            <Button variant="contained" component="span">
              Add Images
            </Button>
          </label>
          {images.length !== 0 && (
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<UploadIcon />}
              variant="contained"
              onClick={uploadImages}
            >
              Upload Images
            </LoadingButton>
          )}

          {images.length !== 0 && (
            <>
              <Typography
                variant="subtitle"
                gutterBottom
                component="h3"
                align="center"
                sx={styles.header}
              >
                Images to Upload
              </Typography>
              <ImageList>
                {images.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      style={{ objectFit: "contain" }}
                      src={URL.createObjectURL(image)}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      title={image.name}
                      subtitle={`${Math.floor(image.size / 10) / 100} KB`}
                      actionIcon={
                        loading ? (
                          <CircularProgress
                            sx={{ color: "#fff", mr: 2 }}
                            size={20}
                          />
                        ) : (
                          <IconButton
                            sx={{ color: "#d32f2f" }}
                            onClick={() => {
                              setImages(
                                images.filter(
                                  (each) => each.name !== image.name
                                )
                              );
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          )}

          {uploadedImages.length !== 0 && (
            <>
              <Typography
                variant="subtitle"
                gutterBottom
                component="h3"
                align="center"
                sx={styles.header}
              >
                Uploaded Images
              </Typography>
              <ImageList>
                {uploadedImages.map(({ src, fileName }, index) => (
                  <ImageListItem key={index}>
                    <img
                      style={{ objectFit: "contain" }}
                      src={src}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      actionIcon={
                        <CheckCircleIcon sx={{ mr: 2, color: "#fff" }} />
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          )}

          {uploadComplete && !loading && (
            <Alert severity="success">
              Successfully uploaded {uploadedImages.length} images
            </Alert>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
