const Payment = require("../model/payment");
var request = require("request");
const payController = {};

payController.paid = async (req, res) => {
  if (!req.body.purpose || !req.body.amount || !req.body.email) {
    res.status(400).json({
      success: false,
      message: "Needed fields mismatch.",
      statusCode: 400,
    });
  } else {
    var headers = {
      "X-Api-Key": "test_34291acc689b64ec59326f46da9",
      "X-Auth-Token": "test_e8dfe109e41193b4be159c800c7",
    };

    var payload = {
      purpose: req.body.purpose,
      amount: req.body.amount,
      buyer_name: req.body.name,
      redirect_url: "http://localhost:3000/users/me",
      send_email: true,
      email: req.body.email,
      allow_repeated_payments: false,
    };
    console.log(payload);
    request.post(
      "https://test.instamojo.com/api/1.1/payment-requests/",
      { form: payload, headers: headers },
      function (error, response, body) {
        if (!error && response.statusCode == 201) {
          let data = JSON.parse(response.body);

          res.status(200).json({
            success: true,
            message: "Initiating payment gateway.",
            statusCode: 200,
            url: data.payment_request.longurl,
          });
          const pay = Payment(req.body);
          pay.save();
        } else {
          console.log(error);
        }
      }
    );
  }
};

module.exports = payController;
