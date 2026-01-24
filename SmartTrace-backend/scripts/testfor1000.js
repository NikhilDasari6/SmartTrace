const axios = require("axios");

(async () => {
  const res = await axios.post("http://localhost:3000/api/bulk/generate", {
    productId: 1,
    units: 1000
  });

  console.log(res.data);
})();

