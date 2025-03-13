import express from "express";
import axios from "axios";
import CryptoJS from "crypto-js";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.static("public"));

// console.log(process.env);

// Bybit API
const bybitApiUrl = "https://api.bybit.nl";
const bybitApiKey = process.env.BYBIT_API_KEY;
const bybitApiSecret = process.env.BYBIT_API_SECRET;
const recvWindow = "5000";

// Query parameters
const category = "spot";
const symbol = "BTCUSDT";

app.get("/", async (req, res) => {
  const queryString = `category=${category}&symbol=${symbol}`;
  const signature = CryptoJS.HmacSHA256(queryString, bybitApiSecret).toString();
  const timeStamp = Date.now().toString();
  const result = await axios.get(
    `${bybitApiUrl}/v5/market/tickers?${queryString}`,
    {
      headers: {
        "X-BAPI-API-KEY": bybitApiKey,
        "X-BAPI-TIMESTAMP": timeStamp,
        "X-BAPI-SIGN": signature,
        "X-BAPI-RECV-WINDOW": recvWindow,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(result.data.result);
  res.render("index.ejs", { price: result.data.result.list[0].lastPrice });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
