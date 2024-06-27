const router = require("express").Router();

const express = require("express");
const axios = require("axios");
const app = express();
const uniqid = require("uniqid");
const sha256 = require("sha256");

//TESTING
const PHONE_PAY_HOST_URL = process.env.PHONE_PAY_HOST_URL;
const MERCHANT_ID = process.env.MERCHANT_ID;
const SALT_INDEX = process.env.SALT_INDEX;
const SALT_KEY = process.env.SALT_KEY;

router.get("/start", (req, res) => {
  res.status(200).send({ message: "phonepe app is working" });
});

router.get("/pay", (req, res) => {
  const payEndPoint = "/pg/v1/pay";
  merchantTransactionId = uniqid();
  const userId = 123;

  let amount = req.query.amount;
  if (!amount) {
    return res.json({ message: "enter correct amount" });
  }

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: userId,
    amount: amount,
    redirectUrl: `http://localhost:4000/redirect-url/${merchantTransactionId}`,
    redirectMode: "REDIRECT",
    mobileNumber: "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };
  /*SHA256(base64 encoded payload + “/pg/v1/pay” +
salt key) + ### + salt index*/
  const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
  const base63EncodedPayload = bufferObj.toString("base64");
  const xVerify =
    sha256(base63EncodedPayload + payEndPoint + SALT_KEY) + "###" + SALT_INDEX;
  console.log("----" + base63EncodedPayload);
  //console.log(xVerify);

  const options = {
    method: "post",
    url: `${PHONE_PAY_HOST_URL}${payEndPoint}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
    },
    data: {
      request: base63EncodedPayload,
    },
  };

  axios
    .post(
      `${PHONE_PAY_HOST_URL}/pg/v1/pay`,
      {
        request: base63EncodedPayload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          accept: "application/json",
        },
      }
    )
    .then(function (response) {
      const url = response.data.data.instrumentResponse.redirectInfo.url;
      console.log(url);
      res.redirect(url);
    })
    .catch(function (error) {
      res.status(500).send({ message: "server error" });
      console.error(error);
    });
});
router.get("/redirect-url/:id", (req, res) => {
  const merchantTransactionId = req.params.id;
  console.log(merchantTransactionId);

  if (merchantTransactionId) {
    //SHA256(“/pg/v1/status/{merchantId}/{merchantTransactionId}” + saltKey) + “###” + saltIndex
    const xVerify =
      sha256(
        `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY
      ) +
      "###" +
      SALT_INDEX;
    const options = {
      method: "get",
      url: `${PHONE_PAY_HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-MERCHANT-ID": merchantTransactionId,
        "X-VERIFY": xVerify,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if (response.data.code === "PAYMENT_SUCESS") {
          console.log("payment sucess");
        } else if (response.data.code === "PAYMENT_ERROR") {
          //redirect user to front error for error
          res.send("invalid format");
        }
        res.send(response.data);
      })
      .catch(function (error) {
        res.status(500).send({ message: "server error" });
      });
    //res.send(merchantTransactionId);
  } else {
    res.status(500).send({ message: "server error" });
  }
});

module.exports = router;
