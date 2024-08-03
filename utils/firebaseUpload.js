const admin = require("firebase-admin");

// Initialize Firebase App (replace with your credentials)
const serviceAccount = require("../firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const storage = admin.storage();
// ######################################################################



const UploadImageToFireBase = async (data, imageName, folderName) => {
  const bucket = storage.bucket(process.env.BUCKET_URL);

  console.log(data);
  try {
    const filename = Date.now() + "-" + imageName; // Generate unique filename

    const file = bucket.file(filename);

    await file.save(data.buffer, {
      contentType: data.mimetype,
      metadata: {
        // Add custom metadata if needed (e.g., creator, description)
      },
    });

    const publicUrl = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2050", // Adjust expiration as needed
    });

    return publicUrl[0];
  } catch (error) {
    console.error(error);
    return;
  }
};

module.exports = UploadImageToFireBase;

