import "dotenv/config"; // <--- Add this line at the very top
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
